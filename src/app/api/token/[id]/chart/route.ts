import { privy } from "@/server/privy-client";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { solanaTracker } from "@/lib/solana-tracker";

function formatTimeframe(timeframe: string) {
	if (timeframe === "24h") {
		return "1d";
	}
	if (timeframe === "1h") {
		return "1h";
	}
	if (timeframe === "3h") {
		return "3h";
	}
	return timeframe;
}

export async function GET(
	req: Request,
	{ params }: { params: { id: string } },
) {
	const cookieStore = await cookies();
	const token = cookieStore.get("privy-token");
	const { id } = await params;
	const { searchParams } = new URL(req.url);
	const timeframe = searchParams.get("timeframe");
	const formattedTimeFrame = formatTimeframe(timeframe ?? "");

	if (!token) {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}

	try {
		const verifiedClaims = await privy.verifyAuthToken(token.value);
		const realId = verifiedClaims.userId?.split(":")[2];

		if (!realId) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		const response = await solanaTracker.get(
			`/chart/${id}?type=${formattedTimeFrame}`,
		);

		return NextResponse.json(response.data);
	} catch (error) {
		console.error("Error fetching token chart data:", error);
		return NextResponse.json(
			{ error: "Failed to fetch token chart data" },
			{ status: 500 },
		);
	}
}
