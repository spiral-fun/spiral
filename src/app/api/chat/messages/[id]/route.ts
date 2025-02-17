import { db } from "@/server/db";
import { privy } from "@/server/privy-client";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { type CoreMessage, streamText } from "ai";
import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import { env } from "@/env";
import { Z } from "node_modules/@upstash/redis/zmscore-C3G81zLz.mjs";
import { z } from "zod";
import { ratelimit } from "@/lib/ratelimiter";

const openrouter = createOpenRouter({
	apiKey: env.OPEN_ROUTER_API_KEY,
});

function getAIClient(model: string) {
	switch (model) {
		case "openai":
			return openrouter("openai/gpt-4o");
		case "gemini":
			return openrouter("google/gemini-2.0-flash-001");
		case "deepseek":
			return openrouter("deepseek/deepseek-r1");
		default:
			return openrouter("openai/gpt-4o");
	}
}

export async function POST(
	req: Request,
	{ params }: { params: { id: string } },
) {
	const cookieStore = await cookies();
	const token = cookieStore.get("privy-token");
	const { id } = await params;

	if (!token) {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}

	try {
		const { messages } = await req.json();
		if (!messages || !Array.isArray(messages)) {
			return NextResponse.json(
				{ error: "Messages array is required" },
				{ status: 400 },
			);
		}

		const lastMessage = messages[messages.length - 1];
		if (!lastMessage?.content || typeof lastMessage.content !== "string") {
			return NextResponse.json(
				{ error: "Last message content is required and must be a string" },
				{ status: 400 },
			);
		}

		const object = z.object({
			content: z
				.string()
				.max(5000, { message: "Message must not exceed 5000 words" }),
		});

		const result = object.safeParse(lastMessage);

		if (!result.success) {
			return NextResponse.json(
				{ error: result.error.message },
				{ status: 400 },
			);
		}

		const verifiedClaims = await privy.verifyAuthToken(token.value);
		const realId = verifiedClaims.userId?.split(":")[2];

		if (!realId) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		const { success } = await ratelimit.limit(realId);

		if (!success) {
			return NextResponse.json(
				{ error: "Rate limit exceeded" },
				{ status: 429 },
			);
		}

		const chat = await db.chat.findFirst({
			where: {
				id: id,
				userId: realId,
			},
			include: {
				messages: {
					orderBy: {
						createdAt: "asc",
					},
				},
			},
		});

		if (!chat) {
			return NextResponse.json({ error: "Chat not found" }, { status: 404 });
		}

		await db.message.create({
			data: {
				content: lastMessage.content,
				role: "user",
				chatId: chat.id,
			},
		});

		const formattedMessages = chat.messages.map((msg) => ({
			role: msg.role === "user" ? "user" : "assistant",
			content: msg.content,
		}));

		formattedMessages.push({
			role: "user",
			content: lastMessage.content,
		});

		const aiClient = getAIClient(chat.model);
		try {
			const result = streamText({
				model: aiClient,
				system:
					chat.isTokenChat && chat.tokenData
						? `You are a Solana token expert. You help users understand token details and answer questions about tokens. Here is information about the token being discussed: ${chat.tokenData}`
						: "You are a helpful assistant who provides clear and accurate information.",
				messages: formattedMessages as CoreMessage[],
				async onFinish({ response }) {
					try {
						if (response.messages[0]?.content) {
							let textContent: string | undefined;
							if (Array.isArray(response.messages[0].content)) {
								textContent = response.messages[0].content.find(
									(c) => c.type === "text",
								)?.text;
							} else {
								textContent = response.messages[0].content;
							}
							if (textContent) {
								await db.message.create({
									data: {
										content: textContent,
										role: "assistant",
										chatId: chat.id,
									},
								});
							}
						}
					} catch (error) {
						console.error("Error in onFinish:", error);
					}
				},
			});

			const response = result.toDataStreamResponse();
			if (!response.body) {
				throw new Error("Stream body is null");
			}

			return new Response(response.body, {
				headers: {
					"Content-Type": "text/event-stream",
					"Cache-Control": "no-cache",
					Connection: "keep-alive",
				},
			});
		} catch (streamError) {
			console.error("Streaming error:", streamError);
			return NextResponse.json(
				{ error: "Failed to stream response" },
				{ status: 500 },
			);
		}
	} catch (error) {
		console.error("Error processing message:", error);
		return NextResponse.json(
			{ error: "Failed to process message" },
			{ status: 500 },
		);
	}
}
