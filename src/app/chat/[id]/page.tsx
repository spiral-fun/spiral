// app/chat/[id]/page.tsx
import { db } from "@/server/db";
import { privy } from "@/server/privy-client";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import ChatComponent from "@/components/chat/chat-component";

async function getChat(id: string) {
	const cookieStore = await cookies();
	const token = cookieStore.get("privy-token");

	if (!token) redirect("/");

	try {
		const verifiedClaims = await privy.verifyAuthToken(token.value);
		const realId = verifiedClaims.userId?.split(":")[2];

		if (!realId) redirect("/chat");

		const chat = await db.chat.findFirst({
			where: {
				id,
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

		if (!chat) redirect("/");

		return chat;
	} catch (error) {
		redirect("/");
	}
}

export default async function ChatPage({
	params,
	searchParams,
}: {
	params: { id: string };
	searchParams: { [key: string]: string | string[] | undefined };
}) {
	const { id } = await params;
	const { m } = await searchParams;
	const message = typeof m === "string" ? m : undefined;

	if (!id) redirect("/chat");
	const chat = await getChat(id);

	return <ChatComponent chat={chat} initialMessage={message} />;
}
