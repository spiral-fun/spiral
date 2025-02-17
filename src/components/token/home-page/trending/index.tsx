import { Button } from "@/components/ui/button";

import { api } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import type { ITrendingData } from "../types";
import Image from "next/image";
import { formatNumber } from "@/lib/utils";
import { IconStar } from "@tabler/icons-react";
import Link from "next/link";

export default function Trending() {
	const { data, error, isLoading } = useQuery<ITrendingData[]>({
		queryKey: ["trending"],
		queryFn: async () => {
			const response = await api.get("/token/trending");
			return response.data;
		},
	});

	if (isLoading) {
		return (
			<div className="w-full items-start flex flex-col gap-4">
				<div className="flex items-start justify-start">
					<span className="text-[18px] font-bold">Trending</span>
				</div>
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
					{Array.from({ length: 9 }, (_, i) => (
						<div
							key={`trending-skeleton-${crypto.randomUUID()}`}
							className="h-[80px] w-full bg-muted animate-pulse rounded-md"
						/>
					))}
				</div>
			</div>
		);
	}

	if (error) {
		return <div>Error: {error.message}</div>;
	}

	if (!data) {
		return null;
	}

	return (
		<div className="w-full items-start flex flex-col gap-4">
			<div className="flex items-start justify-start">
				<span className="text-[18px] font-bold">Trending</span>
			</div>
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
				{data.map((token) => (
					<Link href={`/token/${token.token.mint}`} key={token.token.mint}>
						<div className="h-full justify-start p-2 border rounded-md bg-background hover:bg-secondary/50 transition-all cursor-pointer">
							<div className="flex flex-row justify-between items-center gap-2">
								<div className="flex flex-row gap-2 items-center">
									<Image
										src={token.token.image}
										alt={token.token.name}
										className="w-[32px] h-[32px] rounded-full"
										width={32}
										height={32}
									/>
									<div className="flex flex-col justify-start text-start font-mono">
										<span className="font-bold text-[14px]">
											{token.token.name} ({token.token.symbol})
										</span>
										<div className="flex flex-row gap-1 items-center">
											<span className="text-[12px]">
												$
												{token.pools[0]?.price.usd
													? token.pools[0].price.usd < 0.01
														? token.pools[0].price.usd.toFixed(8)
														: formatNumber(token.pools[0].price.usd)
													: "0"}
											</span>
											<span
												className={`text-[12px] ${
													(token.events["24h"]?.priceChangePercentage ?? 0) >= 0
														? "text-green-500"
														: "text-red-500"
												}`}
											>
												(
												{(token.events["24h"]?.priceChangePercentage ?? 0) >= 0
													? "+"
													: ""}
												{(
													token.events["24h"]?.priceChangePercentage ?? 0
												).toFixed(2)}
												%)
											</span>
										</div>
									</div>
								</div>
								<Button
									variant={"ghost"}
									size={"icon"}
									className="w-[24px] h-[24px] relative"
									onClick={() => {
										const button = document.getElementById("star-button");

										if (button?.classList.contains("animate-star-fill")) {
											button?.classList.remove("animate-star-fill");
										} else {
											button?.classList.add("animate-star-fill");
										}

										api.post("/token/favorite", {
											tokenId: token.token.mint,
											symbol: token.token.symbol,
										});
									}}
								>
									<IconStar
										size={16}
										id="star-button"
										className={token.isFavorited ? "animate-star-fill" : ""}
									/>
								</Button>
							</div>
							<span className="text-[12px] font-mono">
								24h Volume: ${formatNumber(token.pools[0]?.txns?.volume ?? 0)}
							</span>
						</div>
					</Link>
				))}
			</div>
		</div>
	);
}
