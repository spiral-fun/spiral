export default function BubbleMap({
	tokenData,
}: {
	tokenData: {
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
	};
}) {
	return (
		<div className="h-full w-full">
			<iframe
				className="w-full h-full max-w-full"
				src={`https://app.bubblemaps.io/sol/token/${tokenData.token.mint}`}
				title="Bubble Map"
			/>
		</div>
	);
}
