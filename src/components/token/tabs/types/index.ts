export interface ITokenData {
	token: {
		name: string;
		symbol: string;
		mint: string;
		uri: string;
		decimals: number;
		hasFileMetaData: boolean;
		createdOn: string;
		description: string;
		image: string;
		showName: boolean;
		twitter?: string;
		website?: string;
	};
	pools: Array<{
		poolId: string;
		liquidity: { quote: number; usd: number };
		price: { quote: number | null; usd: number | null };
		tokenSupply: number;
		lpBurn: number;
		tokenAddress: string;
		marketCap: { quote: number; usd: number };
		market: string;
		quoteToken: string;
		decimals: number;
		security: { freezeAuthority: null; mintAuthority: null };
		deployer: string;
		lastUpdated: number;
		createdAt: number;
		txns?: { buys: number; total: number; volume: number; sells: number };
		curvePercentage?: number;
		curve?: string;
	}>;
	events: {
		[key: string]: {
			priceChangePercentage: number;
		};
	};
	risk: {
		rugged: boolean;
		risks: {
			name: string;
			description: string;
			level: string;
			score: number;
			value: string;
		}[];
		score: number;
		jupiterVerified: boolean;
	};
	buys: number;
	sells: number;
	txns: number;
	holders: number;
}

export interface IStats {
	[key: string]: {
		buyers: number;
		sellers: number;
		volume: {
			buys: number;
			sells: number;
			total: number;
		};
		transactions: number;
		buys: number;
		sells: number;
		wallets: number;
		price: number;
		priceChangePercentage: number;
	};
}

export interface IHoldersData {
	address: string;
	amount: number;
	percentage: number;
	value: {
		quote: number;
		usd: number;
	};
}

export interface IWalletInfoData {
	tokens: Array<{
		token: {
			name: string;
			symbol: string;
			mint: string;
			uri: string;
			decimals: number;
			image: string;
			hasFileMetaData: boolean;
		};
		pools: Array<{
			poolId: string;
			liquidity: { quote: number; usd: number };
			price: { quote: number | null; usd: number | null };
			tokenSupply: number;
			lpBurn: number;
			tokenAddress: string;
			marketCap: { quote: number; usd: number };
			market: string;
			quoteToken: string;
			decimals: number;
			security: { freezeAuthority: null; mintAuthority: null };
			deployer: string;
			lastUpdated: number;
			createdAt: number;
			txns?: { buys: number; total: number; volume: number; sells: number };
			curvePercentage?: number;
			curve?: string;
		}>;
		events: {
			[key: string]: {
				priceChangePercentage: number;
			};
		};
		risk: {
			rugged: boolean;
			risks: {
				name: string;
				description: string;
				level: string;
				score: number;
				value: string;
			}[];
			score: number;
			jupiterVerified: boolean;
		};
		balance: number;
		value: number;
	}>;
	total: number;
	totalSol: number;
	timestamp: string;
}

export interface ITradersData {
	wallet: string;
	held: number;
	sold: number;
	holding: number;
	realized: number;
	unrealized: number;
	total: number;
	total_invested: number;
}

export interface IWalletTradesData {
	trades: Array<{
		tx: string;
		from: {
			address: string;
			amount: number;
			token: {
				name: string;
				symbol: string;
				image: string;
				decimals: number;
			};
		};
		to: {
			address: string;
			amount: number;
			token: {
				name: string;
				symbol: string;
				image: string;
				decimals: number;
			};
		};
		price: {
			usd: number;
			sol: string;
		};
		volume: {
			usd: number;
			sol: number;
		};
		wallet: string;
		program: string;
		time: number;
	}>;
	nextCursor: number;
	hasNextPage: boolean;
}
