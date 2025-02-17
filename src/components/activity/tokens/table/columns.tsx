"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { formatNumber } from "@/lib/utils";
import { useFundWallet } from "@privy-io/react-auth";
import { BuyButton } from "./buy-button";

export type Payment = {
	asset: {
		imageUrl: string;
		name: string;
	};
	balance: number;
	price: number;
	value: number;
};

export const columns: ColumnDef<Payment>[] = [
	{
		accessorKey: "asset",
		header: "Asset",
		cell: ({ row }) => {
			const asset = row.getValue("asset") as Payment["asset"];

			if (asset.imageUrl) {
				return (
					<div className="flex flex-row items-center gap-2">
						<Avatar className="h-[16px] w-[16px]">
							<AvatarImage src={asset.imageUrl} alt={asset.name} />
							<AvatarFallback>{asset.name.substring(0, 2)}</AvatarFallback>
						</Avatar>
						<span className="text-[14px] font-mono">{asset.name}</span>
					</div>
				);
			}
		},
	},
	{
		accessorKey: "balance",
		header: "Balance",
		cell: ({ row }) => {
			const balance = row.getValue("balance") as Payment["balance"];
			return (
				<span className="text-[14px] font-mono">{balance.toFixed(2)}</span>
			);
		},
	},
	{
		accessorKey: "price",
		header: "Price",
		cell: ({ row }) => {
			const price = row.getValue("price") as Payment["price"];
			return (
				<span className="text-[14px] font-mono">${formatNumber(price)}</span>
			);
		},
	},
	{
		accessorKey: "value",
		header: "Value",
		cell: ({ row }) => {
			const value = row.getValue("value") as Payment["value"];
			return (
				<span className="text-[14px] font-mono">${formatNumber(value)}</span>
			);
		},
	},
	{
		id: "actions",
		cell: () => {
			return (
				<div className="flex flex-row items-end justify-end gap-2">
					<BuyButton />
				</div>
			);
		},
	},
];
