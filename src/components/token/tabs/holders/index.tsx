"use client";

import { api } from "@/lib/api";
import { IconArrowUpRight, IconCopy, IconLoader } from "@tabler/icons-react";
import { useQuery } from "@tanstack/react-query";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import type { IHoldersData, IWalletInfoData } from "../types";
import { TooltipContent } from "@/components/ui/tooltip";
import { TooltipTrigger } from "@/components/ui/tooltip";
import { Tooltip } from "@/components/ui/tooltip";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";

export default function Holders({
	tokenData,
}: {
	tokenData: {
		token: {
			mint: string;
		};
	};
}) {
	const { data, error, isLoading } = useQuery({
		queryKey: ["holders", tokenData.token.mint],
		queryFn: async () => {
			const response = await api.get(`/token/${tokenData.token.mint}/holders`);
			return response.data;
		},
		enabled: !!tokenData.token.mint,
		refetchInterval: 10000,
	});

	const [selectedAddressData, setSelectedAddressData] =
		useState<IWalletInfoData | null>(null);

	const copyToClipboard = async (address: string) => {
		if (address) {
			try {
				await navigator.clipboard.writeText(address);
			} catch (error) {
				console.error("Failed to copy to clipboard", error);
			}
		}
	};

	if (isLoading) {
		return (
			<div className="p-2 w-full h-full flex justify-center items-center">
				<Skeleton className="w-full h-[289px]" />
			</div>
		);
	}

	if (error) {
		return (
			<div className="w-full h-full flex justify-center items-center">
				Error loading holders data
			</div>
		);
	}

	if (!data) {
		return null;
	}

	return (
		<div>
			<Table>
				<TableHeader>
					<TableRow>
						<TableHead className="w-[100px]">Rank</TableHead>
						<TableHead>Holder</TableHead>
						<TableHead className="text-right">Amount</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{data.map((obj: IHoldersData, index: number) => {
						return (
							<TableRow key={obj.address}>
								<TableCell className="font-medium">{index + 1}</TableCell>
								<TableCell>
									{obj.address && (
										<TooltipProvider>
											<Tooltip
												delayDuration={50}
												onOpenChange={async () => {
													try {
														const response = await api.get(
															`/wallet/${obj.address}`,
														);
														setSelectedAddressData(
															response.data as IWalletInfoData,
														);
													} catch (error) {
														console.error(
															"Error fetching address data:",
															error,
														);
													}
												}}
											>
												<TooltipTrigger asChild>
													<button
														type="button"
														className="font-mono truncate max-w-[150px] lg:max-w-[300px] hover:bg-muted py-[5px] px-[6px] rounded-md"
													>
														{obj.address}
													</button>
												</TooltipTrigger>
												<TooltipContent className="w-[300px] h-[150px] bg-background text-primary">
													{!selectedAddressData ? (
														<div className="w-full h-full flex justify-center items-center">
															<IconLoader className="w-4 h-4 animate-spin text-muted-foreground" />
														</div>
													) : (
														<div className="w-full h-full flex flex-col gap-2">
															<div className="w-full flex justify-between items-center">
																<span className="font-bold">Balances</span>
																<span className="font-bold font-mono">
																	$
																	{new Intl.NumberFormat("en-US", {
																		style: "currency",
																		currency: "USD",
																		minimumFractionDigits: 2,
																		maximumFractionDigits: 2,
																	})
																		.format(selectedAddressData.total)
																		.slice(1)}
																</span>
															</div>
															<ScrollArea className="flex-grow">
																<div className="flex flex-col gap-2">
																	{selectedAddressData.tokens?.map(
																		(token, index) => (
																			<div
																				key={`${token.token.mint}-${index}`}
																				className="flex flex-col gap-1"
																			>
																				<div className="flex gap-2 items-center">
																					<Avatar className="w-[30px] h-[30px]">
																						<AvatarImage
																							src={token.token.image}
																							alt={token.token.name}
																							className="w-full h-full rounded-full object-cover"
																						/>
																						<AvatarFallback>
																							{token.token.symbol.substring(
																								0,
																								2,
																							)}
																						</AvatarFallback>
																					</Avatar>
																					<div className="w-full flex flex-col gap-0.5">
																						<span>{token.token.name}</span>
																						<div className="flex flex-row justify-between">
																							<span className="text-xs text-muted-foreground">
																								{token.balance.toFixed(2)}{" "}
																							</span>
																							<span className="text-xs text-muted-foreground">
																								$
																								{new Intl.NumberFormat(
																									"en-US",
																									{
																										style: "currency",
																										currency: "USD",
																										minimumFractionDigits: 2,
																										maximumFractionDigits: 2,
																									},
																								)
																									.format(token.value)
																									.slice(1)}
																							</span>
																						</div>
																					</div>
																				</div>
																			</div>
																		),
																	)}
																</div>
															</ScrollArea>
															<div className="flex gap-2 items-center">
																<Button
																	className="h-8"
																	variant="outline"
																	asChild
																>
																	<a
																		href={`https://solscan.io/account/${obj.address}`}
																		target="_blank"
																		rel="noopener noreferrer"
																	>
																		<span className="font-mono">Solscan</span>
																		<IconArrowUpRight size={16} />
																	</a>
																</Button>
																<Button
																	className="h-8"
																	variant="outline"
																	onClick={async () => {
																		await copyToClipboard(obj.address);
																		const button =
																			document.activeElement as HTMLButtonElement;
																		const span = button.querySelector("span");
																		if (span) {
																			span.textContent = "Copied";
																			setTimeout(() => {
																				span.textContent = "Copy";
																			}, 2000);
																		}
																	}}
																>
																	<span className="font-mono">Copy</span>
																	<IconCopy size={16} />
																</Button>
															</div>
														</div>
													)}
												</TooltipContent>
											</Tooltip>
										</TooltipProvider>
									)}
								</TableCell>
								<TableCell className="text-right font-mono">
									{Number(obj.amount).toLocaleString(undefined, {
										minimumFractionDigits: 2,
										maximumFractionDigits: 2,
									})}{" "}
									({obj.percentage.toFixed(2)}%)
								</TableCell>
							</TableRow>
						);
					})}
				</TableBody>
			</Table>
		</div>
	);
}
