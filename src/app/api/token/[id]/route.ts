import { privy } from "@/server/privy-client";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { solanaTracker } from "@/lib/solana-tracker";
import { db } from "@/server/db";

export async function GET(
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
		const verifiedClaims = await privy.verifyAuthToken(token.value);
		const realId = verifiedClaims.userId?.split(":")[2];

		if (!realId) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		const response = await solanaTracker.get(`/tokens/${id}`);
		const holders = await solanaTracker.get(`/tokens/${id}/holders`);

		const favorite = await db.favorite.findFirst({
			where: {
				userId: realId,
				tokenId: id,
			},
		});

		return NextResponse.json({
			...response.data,
			holders: holders.data.total,
			favorite: !!favorite,
		});
	} catch (error) {
		console.error("Error fetching token data:", error);
		return NextResponse.json(
			{ error: "Failed to fetch token data" },
			{ status: 500 },
		);
	}
}
