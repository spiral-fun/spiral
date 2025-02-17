import { ratelimit } from "@/lib/ratelimiter";
import { db } from "@/server/db";
import { privy } from "@/server/privy-client";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
	const cookieStore = await cookies();
	const token = cookieStore.get("privy-token");
	const { searchParams } = new URL(req.url);
	const cursor = searchParams.get("cursor");
	const limit = Number(searchParams.get("limit")) || 10;

	if (!token) {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
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

		const chats = await db.chat.findMany({
			where: {
				userId: realId,
			},
			include: {
				messages: {
					take: 1,
					orderBy: {
						createdAt: "desc",
					},
				},
			},
			take: limit + 1,
			...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
			orderBy: {
				updatedAt: "desc",
			},
		});

		let nextCursor: string | undefined;
		if (chats.length > limit) {
			const nextItem = chats.pop();
			nextCursor = nextItem?.id;
		}

		return NextResponse.json({
			items: chats,
			nextCursor,
		});
	} catch (error) {
		return NextResponse.json(
			{ error: "Failed to fetch chats" },
			{ status: 500 },
		);
	}
}
