import { solanaTracker } from "@/lib/solana-tracker";
import { privy } from "@/server/privy-client";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import type { AxiosError } from "axios";
import { db } from "@/server/db";
import type { ITokenData } from "@/components/token/tabs/types";

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

		const [response, userFavorites] = await Promise.all([
			solanaTracker.get("/tokens/trending"),
			db.favorite.findMany({
				where: { userId },
				select: { tokenId: true },
			}),
		]);

		const favoritedTokenIds = new Set(userFavorites.map((fav) => fav.tokenId));

		const limitedData = response.data.slice(0, 9).map((token: ITokenData) => ({
			...token,
			isFavorited: favoritedTokenIds.has(token.token.mint),
		}));

		return NextResponse.json(limitedData);
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
