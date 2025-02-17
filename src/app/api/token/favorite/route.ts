import { db } from "@/server/db";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { privy } from "@/server/privy-client";

export async function POST(req: Request) {
	const { tokenId, symbol } = await req.json();
	const cookieStore = await cookies();
	const token = cookieStore.get("privy-token");

	if (!token) {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}

	if (!tokenId) {
		return NextResponse.json(
			{ error: "Token ID is required" },
			{ status: 400 },
		);
	}

	if (!symbol) {
		return NextResponse.json({ error: "Symbol is required" }, { status: 400 });
	}

	try {
		const verifiedClaims = await privy.verifyAuthToken(token.value);
		const userId = verifiedClaims.userId?.split(":")[2];

		if (!userId) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		const existingFavorite = await db.favorite.findFirst({
			where: {
				userId,
				tokenId,
			},
		});

		if (existingFavorite) {
			await db.favorite.delete({
				where: {
					id: existingFavorite.id,
				},
			});
			return NextResponse.json({ message: "Token removed from favorites" });
		}

		await db.favorite.create({
			data: {
				userId,
				tokenId,
				symbol,
			},
		});

		return NextResponse.json({ message: "Token added to favorites" });
	} catch (error) {
		console.error("Error managing favorite:", error);
		return NextResponse.json(
			{ error: "Failed to manage favorite" },
			{ status: 500 },
		);
	}
}

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

		const favorites = await db.favorite.findMany({
			where: { userId },
		});

		return NextResponse.json({ favorites });
	} catch (error) {
		console.error("Error fetching favorites:", error);
		return NextResponse.json(
			{ error: "Failed to fetch favorites" },
			{ status: 500 },
		);
	}
}
