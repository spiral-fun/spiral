import { solanaTracker } from "@/lib/solana-tracker";
import { privy } from "@/server/privy-client";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import type { AxiosError } from "axios";

export async function GET(req: Request) {
	const cookieStore = await cookies();
	const token = cookieStore.get("privy-token");

	if (!token) {
		return NextResponse.json(
			{ error: "Authentication required" },
			{ status: 401 },
		);
	}

	try {
		const verifiedClaims = await privy.verifyAuthToken(token.value);
		const userId = verifiedClaims.userId?.split(":")[2];

		if (!userId) {
			return NextResponse.json(
				{ error: "Invalid authentication token" },
				{ status: 401 },
			);
		}

		const { searchParams } = new URL(req.url);
		const query = searchParams.get("q");

		if (!query) {
			return NextResponse.json(
				{ error: "Search query is required" },
				{ status: 400 },
			);
		}

		const sanitizedQuery = query.trim().slice(0, 100);
		const response = await solanaTracker.get(
			`/search?query=${encodeURIComponent(sanitizedQuery)}&limit=10`,
		);

		return NextResponse.json(response.data);
	} catch (error) {
		console.error("Search error:", error);
		const axiosError = error as AxiosError;

		if (axiosError.response?.status === 404) {
			return NextResponse.json({ error: "No results found" }, { status: 404 });
		}

		if (axiosError.response?.status === 503) {
			return NextResponse.json(
				{ error: "Search service temporarily unavailable" },
				{ status: 503 },
			);
		}

		return NextResponse.json(
			{ error: "An unexpected error occurred" },
			{ status: 500 },
		);
	}
}
