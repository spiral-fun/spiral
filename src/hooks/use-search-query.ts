import { api } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { isAxiosError, type AxiosError } from "axios";

export interface Token {
	name: string;
	symbol: string;
	mint: string;
	image: string;
	decimals: number;
	hasSocials: boolean;
	poolAddress: string;
	liquidityUsd: number;
	marketCapUsd: number;
	priceUsd: number;
	lpBurn: number;
	market: string;
	freezeAuthority: string | null;
	mintAuthority: string | null;
	createdAt: number;
	lastUpdated: number;
	buys: number;
	sells: number;
	totalTransactions: number;
}

export interface SearchResponse {
	total: number;
	data: Token[];
	page: number;
	pages: number;
	status: "success" | "error";
}

/**
 * Custom hook for searching tokens with error handling and caching
 * @param query The search query string
 * @returns Query result with data, loading state, and error handling
 */
export function useSearchQuery(query: string) {
	return useQuery({
		queryKey: ["search", query],
		queryFn: async () => {
			if (!query.trim()) {
				return { data: [], total: 0, page: 1, pages: 0, status: "success" };
			}

			try {
				console.log("Fetching search results for:", query);
				const response = await api.get<SearchResponse>(
					`/token/search?q=${encodeURIComponent(query.trim())}`,
				);
				console.log("Search API response:", response.data);
				return response.data;
			} catch (error) {
				console.error("Search API error:", error);
				if (isAxiosError(error)) {
					if (error.response?.status === 401) {
						throw new Error("Please sign in to search tokens");
					}
					if (error.response?.status === 400) {
						throw new Error("Invalid search query");
					}
				}
				throw new Error("Failed to search tokens. Please try again later.");
			}
		},
		enabled: true,
		staleTime: 0,
		gcTime: 0,
		retry: 2,
		refetchOnWindowFocus: false,
		refetchOnMount: true,
	});
}
