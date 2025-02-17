import { privy } from "@/server/privy-client";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import type { AxiosError } from "axios";
import {
	TokenSmartMoneyInflowRequest,
	type TokenSmartMoneyInflow,
} from "@hellomoon/api";
import client from "@/lib/hello-moon";

enum Granularity {
	THIRTY_MIN = "THIRTY_MIN",
	ONE_HOUR = "ONE_HOUR",
	SIX_HOUR = "SIX_HOUR",
	HALF_DAY = "HALF_DAY",
	ONE_DAY = "ONE_DAY",
	ONE_WEEK = "ONE_WEEK",
	ONE_MONTH = "ONE_MONTH",
}

export const getSmartMoneyInflows = async (
	granularity: Granularity,
	limit = 10,
): Promise<TokenSmartMoneyInflow[]> => {
	const response = await client.send(
		new TokenSmartMoneyInflowRequest({
			granularity,
			limit,
		}),
	);
	return response.data;
};

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

		const response = await getSmartMoneyInflows(Granularity.ONE_DAY, 9).catch(
			(error) => {
				console.error(error);
				return NextResponse.json({
					error: "Error while getting smart money inflows",
				});
			},
		);

		return NextResponse.json(response);
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
