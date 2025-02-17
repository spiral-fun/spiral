import { usePrivy } from "@privy-io/react-auth";
import { IconArrowsRightLeft } from "@tabler/icons-react";
import { api } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import type { IWalletTradesData } from "@/components/token/tabs/types";
import { DataTable } from "./table/data-table";
import { columns } from "./table/columns";

export default function Transactions() {
	const { user } = usePrivy();

	const { data, isLoading, error } = useQuery<IWalletTradesData>({
		queryKey: ["transactions"],
		queryFn: async () => {
			return (await api.get(`/wallet/${user?.wallet?.address}/transactions`))
				.data;
		},
		refetchInterval: 1000,
		enabled: !!user?.wallet?.address,
	});

	if (!user?.wallet?.address) {
		return null;
	}

	if (error) {
		return (
			<div className="w-full lg:w-[800px] flex flex-col gap-2">
				<div className="flex flex-col gap-2 p-4 border rounded-md bg-destructive/10 text-destructive">
					<p>Failed to load tokens</p>
					<p className="text-sm opacity-80">{(error as Error).message}</p>
				</div>
			</div>
		);
	}

	const columnData = data?.trades.map((trade) => ({
		tx_hash: trade.tx,
		type: "Transfer",
		source: trade.program,
		balance_changes: [
			{
				asset: {
					imageUrl: trade.from.token.image,
					symbol: trade.from.token.symbol,
				},
				amount: trade.from.amount,
			},
			{
				asset: {
					imageUrl: trade.to.token.image,
					symbol: trade.to.token.symbol,
				},
				amount: trade.to.amount,
			},
		],
	}));

	return (
		<div className="w-full lg:w-[800px] flex flex-col gap-2">
			{isLoading ? (
				<Skeleton className="h-[100px] w-full" />
			) : (
				<div className="flex flex-col gap-2">
					<div className="flex flex-row justify-between items-center gap-2">
						<div className="flex flex-row items-center gap-2">
							<IconArrowsRightLeft size={16} />
							<span className="text-[18px] font-bold">Transactions</span>
						</div>
					</div>
					<DataTable columns={columns} data={columnData || []} />
				</div>
			)}
		</div>
	);
}
