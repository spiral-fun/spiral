import { privy } from "@/server/privy-client";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { solanaTracker } from "@/lib/solana-tracker";

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

		const response = await solanaTracker.get(`/top-traders/${id}`);

		return NextResponse.json(response.data);
	} catch (error) {
		console.error("Error fetching token data:", error);
		return NextResponse.json(
			{ error: "Failed to fetch token data" },
			{ status: 500 },
		);
	}
}
