"use client";

import { useQuery } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import {
	IconBrandX,
	IconChartCandle,
	IconCoins,
	IconMenu3,
	IconReportMoney,
	IconStar,
	IconWorld,
} from "@tabler/icons-react";
import { useSidebar } from "@/components/ui/sidebar";
import Image from "next/image";
import { useEffect } from "react";
import TokenTabs from "@/components/token/tabs";
import { TooltipContent } from "@/components/ui/tooltip";
import { Tooltip, TooltipTrigger } from "@/components/ui/tooltip";
import { TooltipProvider } from "@/components/ui/tooltip";
import Link from "next/link";
import { CardContent } from "@/components/ui/card";
import StartBox from "@/components/token/start-box";
import { Card } from "@/components/ui/card";
import { useChats } from "@/hooks/use-chats";

export default function TokenPage() {
	const { id } = useParams();
	const { open, toggleSidebar, isMobile } = useSidebar();
	const router = useRouter();
	const { addNewChat } = useChats();

	const handleSubmit = async (message: string) => {
		try {
			const response = await api.post("/chat/create", {
				model: "auto",
				token: tokenData,
			});

			if (response.data.id) {
				addNewChat({
					id: response.data.id,
					messages: [
						{
							content: message,
							role: "user",
						},
					],
				});

				const queryParams = new URLSearchParams({
					m: message,
				}).toString();

				router.push(`/chat/${response.data.id}?${queryParams}`);
			}
		} catch (error) {
			console.error(error);
		}
	};

	const {
		data: tokenData,
		error,
		isLoading,
	} = useQuery({
		queryKey: ["tokenData", id],
		queryFn: async () => {
			const response = await api.get(`/token/${id}`);
			return response.data;
		},
		enabled: !!id,
		refetchInterval: 10000,
	});

	useEffect(() => {
		if (tokenData) {
			const button = document.getElementById("star-button");
			if (tokenData.favorite) {
				button?.classList.add("animate-star-fill");
			}
		}
	}, [tokenData]);

	if (isLoading) {
		return (
			<div className="w-full h-screen p-2">
				<div className="h-full">
					<Skeleton className="w-full h-full" />
				</div>
			</div>
		);
	}

	if (error) {
		const errorMessage =
			error instanceof Error ? error.message : "An unknown error occurred";
		return <div>Error: {errorMessage}</div>;
	}

	const copyToClipboard = async () => {
		if (id) {
			try {
				await navigator.clipboard.writeText(id as string);
			} catch (error) {
				console.error("Failed to copy to clipboard", error);
			}
		}
	};

	return (
		<div className="flex flex-col lg:flex-row h-screen">
			<div className="w-full lg:w-8/12 flex flex-col">
				<header
					className={`${isMobile ? "flex" : "hidden"} h-12 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:flex`}
				>
					<div className="flex items-center gap-2 px-4">
						<div
							className={`items-center gap-2 ${open && !isMobile ? "hidden" : "flex"}`}
						>
							<Button
								type="button"
								size={"icon"}
								variant={"ghost"}
								className="w-[24px] h-[24px]"
								onClick={toggleSidebar}
							>
								<IconMenu3 size={16} />
							</Button>
						</div>
					</div>
				</header>
				<div className="p-4 flex-1 w-full flex flex-col gap-4 justify-start items-start">
					<div className="w-full flex justify-between items-center h-14 lg:h-[28px]">
						<div className="flex items-center gap-2">
							<Image
								src={tokenData.token.image}
								alt={tokenData.token.name}
								width={24}
								height={24}
								className="w-[24px] h-[24px] rounded-full"
							/>
							<span className="font-bold text-[18px] break-words">
								{`${tokenData.token.name} (${tokenData.token.symbol})`}
							</span>
							{id && (
								<TooltipProvider>
									<Tooltip delayDuration={150}>
										<TooltipTrigger
											className="text-[14px] font-mono truncate max-w-[150px] hover:bg-muted py-[3px] px-[3px] rounded-md"
											onClick={copyToClipboard}
										>
											{id}
										</TooltipTrigger>
										<TooltipContent>
											<p>Copy to clipboard</p>
										</TooltipContent>
									</Tooltip>
								</TooltipProvider>
							)}
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
										tokenId: id,
										symbol: tokenData.token.symbol,
									});
								}}
							>
								<IconStar size={16} id="star-button" />
							</Button>
						</div>
						<div>
							{tokenData.token.twitter && (
								<Link href={tokenData.token.twitter} target="_blank">
									<button
										type="button"
										className="p-1 hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded-full"
									>
										<IconBrandX size={16} />
									</button>
								</Link>
							)}
							{tokenData.token.website && (
								<Link href={tokenData.token.website} target="_blank">
									<button
										type="button"
										className="p-1 hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded-full"
									>
										<IconWorld size={16} />
									</button>
								</Link>
							)}
						</div>
					</div>
					<TokenTabs tokenData={tokenData} />
				</div>
			</div>
			<div className="w-full lg:w-4/12 flex flex-col py-10 lg:py-0 border">
				<div className="flex-1 w-full flex flex-col gap-4 justify-center items-center p-4">
					<div className="flex flex-col gap-2 items-center">
						<span className="text-[16px] font-semibold">
							What would you like to know about{" "}
							<span className="font-bold">{tokenData.token.name}</span>?
						</span>
					</div>
					<div className="w-full">
						<StartBox token={tokenData} />
					</div>
					<div className="grid grid-cols-2 gap-4">
						<div>
							<Card
								onClick={() =>
									handleSubmit("Do a holder Analysis on this token")
								}
								className="h-full hover:brightness-110 cursor-pointer transition-all duration-300"
							>
								<CardContent className="p-4">
									<div className="flex flex-col items-start gap-2">
										<div className="flex flex-row gap-2 items-center">
											<div className="w-[32px] h-[32px] rounded-full bg-secondary flex items-center justify-center">
												<IconCoins size={16} />
											</div>
											<span className="font-bold">Holder Analysis</span>
										</div>
									</div>
								</CardContent>
							</Card>
						</div>
						<div>
							<Card
								onClick={() =>
									handleSubmit("Do a liquidity pools analysis on this token")
								}
								className="h-full hover:brightness-110 cursor-pointer transition-all duration-300"
							>
								<CardContent className="p-4">
									<div className="flex flex-col items-start gap-2">
										<div className="flex flex-row gap-2 items-center">
											<div className="w-[32px] h-[32px] rounded-full bg-secondary flex items-center justify-center">
												<IconReportMoney size={16} />
											</div>
											<span className="font-bold">Liquidity Pools</span>
										</div>
									</div>
								</CardContent>
							</Card>
						</div>
						<div>
							<Card
								onClick={() =>
									handleSubmit("Do a twitter sentiment analysis on this token")
								}
								className="h-full hover:brightness-110 cursor-pointer transition-all duration-300"
							>
								<CardContent className="p-4">
									<div className="flex flex-col items-start gap-2">
										<div className="flex flex-row gap-2 items-center">
											<div className="w-[32px] h-[32px] rounded-full bg-secondary flex items-center justify-center">
												<IconBrandX size={16} />
											</div>
											<span className="font-bold">Twitter Sentiment</span>
										</div>
									</div>
								</CardContent>
							</Card>
						</div>
						<div>
							<Card
								onClick={() =>
									handleSubmit("Do a trading activity analysis on this token")
								}
								className="h-full hover:brightness-110 cursor-pointer transition-all duration-300"
							>
								<CardContent className="p-4">
									<div className="flex flex-col items-start gap-2">
										<div className="flex flex-row gap-2 items-center">
											<div className="w-[32px] h-[32px] rounded-full bg-secondary flex items-center justify-center">
												<IconChartCandle size={16} />
											</div>
											<span className="font-bold">Trading Activity</span>
										</div>
									</div>
								</CardContent>
							</Card>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
