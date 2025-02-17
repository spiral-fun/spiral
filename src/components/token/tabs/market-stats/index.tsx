import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";
import { IconLoader } from "@tabler/icons-react";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import type { IStats, ITokenData } from "../types";
import InnerStats from "./inner-stats";

export default function MarketStats({
	tokenData,
}: {
	tokenData: ITokenData;
}) {
	const [selectedTimeframe, setSelectedTimeframe] = useState<
		"5m" | "1h" | "4h" | "24h"
	>("24h");
	const pool = tokenData.pools[0];

	const { data, error, isLoading } = useQuery({
		queryKey: ["stats", tokenData.token.mint],
		queryFn: async () => {
			const response = await api.get(
				`/token/${tokenData.token.mint}/${pool?.poolId}/stats`,
			);
			return response.data;
		},
		enabled: !!tokenData.token.mint && !!pool?.poolId,
		refetchInterval: 10000,
	});

	const stats = data as IStats;

	if (isLoading) {
		return (
			<div className="p-2 w-full h-full flex justify-center items-center">
				<IconLoader size={32} className="w-4 h-4 animate-spin" />
			</div>
		);
	}

	if (error) {
		return <div>Error loading stats data</div>;
	}

	if (!data) {
		return null;
	}

	const formatNumber = (num: number) => {
		if (num >= 1000000) {
			return `${(num / 1000000).toFixed(0)} mi`;
		}
		if (num >= 1000) {
			return `${(num / 1000).toFixed(0)} mil`;
		}
		return num.toString();
	};

	return (
		<div className="p-2">
			<div className="grid grid-cols-2 md:grid-cols-4 gap-2 scrollbar-hide">
				<div className="flex flex-col border rounded-md p-2 border-neutral-200 dark:border-neutral-700">
					<h3 className="text-xs font-semibold">Market Cap</h3>
					<p className="text-sm font-mono">
						${formatNumber(pool?.marketCap.usd ?? 0)}
					</p>
				</div>
				<div className="flex flex-col border rounded-md p-2 border-neutral-200 dark:border-neutral-700">
					<h3 className="text-xs font-semibold">Liquidity</h3>
					<p className="text-sm font-mono">
						${formatNumber(pool?.liquidity.usd ?? 0)}
					</p>
				</div>
				<div className="flex flex-col border rounded-md p-2 border-neutral-200 dark:border-neutral-700">
					<h3 className="text-xs font-semibold"># of Holders</h3>
					<p className="text-sm font-mono">
						{formatNumber(tokenData.holders ?? 0)}
					</p>
				</div>
				<div className="flex flex-col border rounded-md p-2 border-neutral-200 dark:border-neutral-700">
					<h3 className="text-xs font-semibold">Rug Risk</h3>
					{tokenData.risk.score < 2 ? (
						<p className="text-sm font-mono text-green-300">LOW</p>
					) : tokenData.risk.score > 6 ? (
						<p className="text-sm font-mono text-red-500">HIGH</p>
					) : tokenData.risk.score > 8 ? (
						<p className="text-sm font-mono text-red-900">EXTREME</p>
					) : (
						<p className="text-sm font-mono text-yellow-300">MODERATE</p>
					)}
				</div>
			</div>
			<div className="pt-2 flex w-full flex-col">
				<div className="flex flex-row">
					<Button
						variant={"outline"}
						className={`rounded-r-none rounded-bl-none justify-center whitespace-nowrap text-sm font-medium transition-colors flex flex-col items-center h-fit p-2 flex-1 gap-0 ${
							selectedTimeframe === "5m"
								? "bg-neutral-200 dark:bg-neutral-900"
								: ""
						}`}
						onClick={() => setSelectedTimeframe("5m")}
					>
						<span>5M</span>
						<span
							className={
								data["5m"].priceChangePercentage &&
								data["5m"].priceChangePercentage >= 0
									? "text-green-500"
									: "text-red-500"
							}
						>
							{data["5m"].priceChangePercentage &&
							data["5m"].priceChangePercentage >= 0
								? "+"
								: ""}
							{data["5m"].priceChangePercentage?.toFixed(2)}%
						</span>
					</Button>
					<Button
						variant={"outline"}
						className={`rounded-none justify-center whitespace-nowrap text-sm font-medium transition-colors flex flex-col items-center h-fit p-2 flex-1 gap-0 ${
							selectedTimeframe === "1h"
								? "bg-neutral-200 dark:bg-neutral-900"
								: ""
						}`}
						onClick={() => setSelectedTimeframe("1h")}
					>
						<span>1H</span>
						<span
							className={
								data["1h"].priceChangePercentage &&
								data["1h"].priceChangePercentage >= 0
									? "text-green-500"
									: "text-red-500"
							}
						>
							{data["1h"].priceChangePercentage &&
							data["1h"].priceChangePercentage >= 0
								? "+"
								: ""}
							{data["1h"].priceChangePercentage?.toFixed(2)}%
						</span>
					</Button>
					<Button
						variant={"outline"}
						className={`rounded-none justify-center whitespace-nowrap text-sm font-medium transition-colors flex flex-col items-center h-fit p-2 flex-1 gap-0 ${
							selectedTimeframe === "4h"
								? "bg-neutral-200 dark:bg-neutral-900"
								: ""
						}`}
						onClick={() => setSelectedTimeframe("4h")}
					>
						<span>4H</span>
						<span
							className={
								data["4h"].priceChangePercentage &&
								data["4h"].priceChangePercentage >= 0
									? "text-green-500"
									: "text-red-500"
							}
						>
							{data["4h"].priceChangePercentage &&
							data["4h"].priceChangePercentage >= 0
								? "+"
								: ""}
							{data["4h"].priceChangePercentage?.toFixed(2)}%
						</span>
					</Button>
					<Button
						variant={"outline"}
						className={`rounded-l-none rounded-br-none justify-center whitespace-nowrap text-sm font-medium transition-colors flex flex-col items-center h-fit p-2 flex-1 gap-0 ${
							selectedTimeframe === "24h"
								? "bg-neutral-200 dark:bg-neutral-900"
								: ""
						}`}
						onClick={() => setSelectedTimeframe("24h")}
					>
						<span>24H</span>
						<span
							className={
								data["24h"].priceChangePercentage &&
								data["24h"].priceChangePercentage >= 0
									? "text-green-500"
									: "text-red-500"
							}
						>
							{data["24h"].priceChangePercentage &&
							data["24h"].priceChangePercentage >= 0
								? "+"
								: ""}
							{data["24h"].priceChangePercentage?.toFixed(2)}%
						</span>
					</Button>
				</div>
				<InnerStats stats={stats} selectedStat={selectedTimeframe} />
			</div>
		</div>
	);
}
