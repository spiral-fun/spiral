"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { formatNumber } from "@/lib/utils";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { IconArrowUpRight } from "@tabler/icons-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
type BalanceChange = {
	asset: {
		imageUrl: string;
		symbol: string;
	};
	amount: number;
};

export type Transaction = {
	tx_hash: string;
	type: string;
	source: string;
	balance_changes: BalanceChange[];
};

const copyToClipboard = (text: string) => {
	navigator.clipboard.writeText(text);
};

export const columns: ColumnDef<Transaction>[] = [
	{
		accessorKey: "tx_hash",
		header: "Tx Hash",
		cell: ({ row }) => {
			const txHash = row.getValue("tx_hash") as string;

			if (txHash) {
				return (
					<TooltipProvider>
						<Tooltip delayDuration={150}>
							<TooltipTrigger className="font-mono truncate max-w-[200px] hover:bg-muted py-[5px] px-[6px] rounded-md">
								{txHash}
							</TooltipTrigger>
							<TooltipContent asChild>
								<div className="flex flex-row gap-2 p-2">
									<Button
										variant="outline"
										onClick={() => copyToClipboard(txHash)}
									>
										Copy Hash
									</Button>
									<Link
										href={`https://solscan.io/tx/${txHash}`}
										target="_blank"
									>
										<Button
											variant="outline"
											className="flex items-center gap-2"
										>
											Solscan <IconArrowUpRight />
										</Button>
									</Link>
								</div>
							</TooltipContent>
						</Tooltip>
					</TooltipProvider>
				);
			}
		},
	},
	{
		accessorKey: "type",
		header: "Type",
		cell: ({ row }) => {
			const type = row.getValue("type") as Transaction["type"];
			return <span className="text-[14px] font-mono">{type}</span>;
		},
	},
	{
		accessorKey: "source",
		header: "Source",
		cell: ({ row }) => {
			const source = row.getValue("source") as Transaction["source"];
			return <span className="text-[14px] font-mono">{source}</span>;
		},
	},
	{
		accessorKey: "balance_changes",
		header: "Balance Changes",
		cell: ({ row }) => {
			const balanceChanges = row.getValue(
				"balance_changes",
			) as Transaction["balance_changes"];
			return (
				<div className="flex flex-row">
					{balanceChanges.map((change, index) => (
						<div
							className="w-full flex flex-col items-center"
							key={`${change.asset.symbol}-${index}`}
						>
							<Avatar className="h-[16px] w-[16px]">
								<AvatarImage src={change.asset.imageUrl} />
								<AvatarFallback>
									{change.asset.symbol.substring(0, 2)}
								</AvatarFallback>
							</Avatar>
							<span
								className={`text-[14px] font-mono ${
									change.amount < 0 ? "text-red-600" : "text-green-600"
								}`}
							>
								{change.amount < 0 ? "-" : "+"}
								{change.amount} {change.asset.symbol}
							</span>
						</div>
					))}
				</div>
			);
		},
	},
];
