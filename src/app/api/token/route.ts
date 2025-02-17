import { privy } from "@/server/privy-client";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
	const cookieStore = await cookies();
	const token = cookieStore.get("privy-token");

	if (!token) {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}

	try {
		const verifiedClaims = await privy.verifyAuthToken(token.value);
		const userId = verifiedClaims.userId?.split(":")[2];

		if (!userId) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		return NextResponse.json({});
	} catch (error) {
		console.error("Error fetching tokens:", error);
		return NextResponse.json(
			{ error: "Failed to fetch tokens" },
			{ status: 500 },
		);
	}
}
