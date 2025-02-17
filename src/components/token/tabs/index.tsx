"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import MarketStats from "./market-stats";
import Holders from "./holders";
import Traders from "./traders";
import BubbleMap from "./bubble-map";
import {
	IconAdjustmentsAlt,
	IconArrowsRightLeft,
	IconMapPin,
	IconWallet,
	IconUsers,
} from "@tabler/icons-react";
import { useSidebar } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import Chart from "./chart";

const tabs = [
	{
		value: "market-stats",
		label: "Market Stats",
		component: MarketStats,
		icon: <IconAdjustmentsAlt size={16} />,
	},
	{
		value: "holders",
		label: "Holders",
		component: Holders,
		icon: <IconWallet size={16} />,
	},
	{
		value: "traders",
		label: "Traders",
		component: Traders,
		icon: <IconArrowsRightLeft size={16} />,
	},
	{
		value: "bubble-map",
		label: "Bubble Map",
		component: BubbleMap,
		icon: <IconMapPin size={16} />,
	},
];

export default function TokenTabs({
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
	};
}) {
	const { isMobile } = useSidebar();
	const [activeTab, setActiveTab] = useState("market-stats");
	const [selectedTimeframe, setSelectedTimeframe] = useState("24h");

	const calculatePrice = (timeframe: string) => {
		if (tokenData) {
			const currentPrice = tokenData.pools[0]?.price.usd;
			let changePercentage = tokenData.events[timeframe]?.priceChangePercentage;

			if (changePercentage === undefined) {
				const timeframes = ["24h", "12h", "6h", "2h", "1h", "30m"];
				const currentIndex = timeframes.indexOf(timeframe);

				for (let i = currentIndex + 1; i < timeframes.length; i++) {
					const nextTimeframe = timeframes[i] as keyof typeof tokenData.events;
					if (
						tokenData.events[nextTimeframe]?.priceChangePercentage !== undefined
					) {
						changePercentage =
							tokenData.events[nextTimeframe].priceChangePercentage;
						break;
					}
				}

				if (changePercentage === undefined) {
					for (let i = currentIndex - 1; i >= 0; i--) {
						const prevTimeframe = timeframes[
							i
						] as keyof typeof tokenData.events;
						if (
							tokenData.events[prevTimeframe]?.priceChangePercentage !==
							undefined
						) {
							changePercentage =
								tokenData.events[prevTimeframe].priceChangePercentage;
							break;
						}
					}
				}
			}

			if (currentPrice && changePercentage !== undefined) {
				const previousPrice = currentPrice / (1 + changePercentage / 100);
				return previousPrice;
			}
			return 0;
		}
		return 0;
	};

	const timeframes = [
		{ label: "30m", value: "30m" },
		{ label: "1h", value: "1h" },
		{ label: "2h", value: "2h" },
		{ label: "6h", value: "6h" },
		{ label: "12h", value: "12h" },
		{ label: "24h", value: "24h" },
	];

	const ActiveComponent = tabs.find(
		(tab) => tab.value === activeTab,
	)?.component;

	return (
		<div className="w-full flex flex-col gap-2">
			<div className="w-full border rounded-md">
				<div className="flex flex-col md:flex-row md:justify-between md:items-center gap-1 bg-secondary p-2">
					<p className="text-md md:text-lg font-bold font-mono">
						${calculatePrice(selectedTimeframe).toFixed(5)}{" "}
						<span
							className={
								(tokenData.events[selectedTimeframe]?.priceChangePercentage ??
									0) >= 0
									? "text-green-500"
									: "text-red-500"
							}
						>
							(
							{tokenData.events[
								selectedTimeframe
							]?.priceChangePercentage?.toFixed(2) ?? "0.00"}
							%)
						</span>
					</p>
					<div className="flex flex-row gap-1 items-center">
						{timeframes.map((timeframe) => (
							<Button
								key={timeframe.value}
								variant={
									selectedTimeframe === timeframe.value ? "outline" : "ghost"
								}
								className="h-fit w-fit px-1 py-0.5 hover:bg-background transition-all duration-250 text-[14px]"
								onClick={() => setSelectedTimeframe(timeframe.value)}
							>
								{timeframe.label}
							</Button>
						))}
					</div>
				</div>
				<Chart tokenData={tokenData} selectedTimeframe={selectedTimeframe} />
			</div>
			{isMobile ? (
				<div>
					<Select value={activeTab} onValueChange={setActiveTab}>
						<SelectTrigger className="w-full rounded-b-none">
							<SelectValue>
								{tabs.find((tab) => tab.value === activeTab)?.label}
							</SelectValue>
						</SelectTrigger>
						<SelectContent className="rounded-t-none p-0">
							{tabs.map((tab) => (
								<SelectItem key={tab.value} value={tab.value}>
									<div className="flex items-center gap-2">
										{tab.icon}
										<span className="text-sm font-mono">{tab.label}</span>
									</div>
								</SelectItem>
							))}
						</SelectContent>
					</Select>
					<div className="bg-background border p-2 rounded-md rounded-t-none">
						{ActiveComponent && <ActiveComponent tokenData={tokenData} />}
					</div>
				</div>
			) : (
				<Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
					<ScrollArea className="w-full">
						<TabsList className="w-full inline-flex justify-start rounded-b-none">
							{tabs.map((tab) => (
								<TabsTrigger
									key={tab.value}
									value={tab.value}
									className="flex flex-row items-center gap-2"
								>
									{tab.icon}
									<span className="text-[14px] font-mono">{tab.label}</span>
								</TabsTrigger>
							))}
						</TabsList>
						<ScrollBar orientation="horizontal" />
					</ScrollArea>

					{tabs.map((tab) =>
						tab.value === "bubble-map" ? (
							<TabsContent
								key={tab.value}
								value={tab.value}
								className="h-[290px] bg-background border border-t-0 p-2 rounded-t-none rounded-md m-0"
							>
								<tab.component tokenData={tokenData} />
							</TabsContent>
						) : (
							<TabsContent key={tab.value} value={tab.value} asChild>
								<ScrollArea className="h-[290px] bg-background border border-t-0 rounded-t-none rounded-md m-0">
									<tab.component tokenData={tokenData} />
								</ScrollArea>
							</TabsContent>
						),
					)}
				</Tabs>
			)}
		</div>
	);
}
