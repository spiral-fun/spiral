export interface ITrendingData {
	token: {
		name: string;
		symbol: string;
		mint: string;
		uri: string;
		decimals: number;
		image: string;
		description: string;
		extensions: {
			twitter: string;
			telegram: string;
		};
		tags: string[];
		creator: {
			name: string;
			site: string;
		};
		hasFileMetaData: boolean;
	};
	pools: Array<{
		liquidity: {
			quote: number;
			usd: number;
		};
		price: {
			quote: number;
			usd: number;
		};
		tokenSupply: number;
		lpBurn: number;
		tokenAddress: string;
		marketCap: {
			quote: number;
			usd: number;
		};
		market: string;
		quoteToken: string;
		decimals: number;
		security: {
			freezeAuthority: string;
			mintAuthority: string;
		};
		lastUpdated: number;
		createdAt: number;
		poolId: string;
		txns?: { buys: number; total: number; volume: number; sells: number };
	}>;
	events: {
		[key: string]: {
			priceChangePercentage: number;
		};
	};
	risk: {
		rugged: boolean;
		risks: Array<{
			name: string;
			description: string;
			level: string;
			score: number;
		}>;
		score: number;
	};
	buys: number;
	sells: number;
	txns: number;
	isFavorited: boolean;
}
