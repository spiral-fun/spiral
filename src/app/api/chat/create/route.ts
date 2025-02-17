import { ratelimit } from "@/lib/ratelimiter";
import { db } from "@/server/db";
import { privy } from "@/server/privy-client";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
	const cookieStore = await cookies();
	const token = cookieStore.get("privy-token");
	const { model, token: tokenData } = await req.json();

	if (!token) {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}

	if (!model) {
		return NextResponse.json({ error: "Model is required" }, { status: 400 });
	}

	try {
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
		const chat = await db.chat.create({
			data: {
				userId: realId,
				model,
				isTokenChat: !!tokenData,
				tokenData: tokenData ? JSON.stringify(tokenData) : null,
			},
			select: {
				id: true,
			},
		});

		return NextResponse.json({ id: chat.id }, { status: 201 });
	} catch (error) {
		return NextResponse.json(
			{ error: "Failed to create chat" },
			{ status: 500 },
		);
	}
}
