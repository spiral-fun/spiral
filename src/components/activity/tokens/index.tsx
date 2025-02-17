import { usePrivy } from "@privy-io/react-auth";
import { IconCoins } from "@tabler/icons-react";
import { DataTable } from "./table/data-table";
import { columns } from "./table/columns";
import { api } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { formatNumber } from "@/lib/utils";
import type { IWalletInfoData } from "@/components/token/tabs/types";

export default function Tokens() {
	const { user } = usePrivy();

	const { data, isLoading, error } = useQuery<IWalletInfoData>({
		queryKey: ["tokens"],
		queryFn: async () => {
			return (await api.get(`/wallet/${user?.wallet?.address}`)).data;
		},
		refetchInterval: 1000,
		enabled: !!user?.wallet?.address,
	});

	const columnsData =
		data?.tokens?.map((token) => ({
			asset: {
				imageUrl: token.token.image,
				name: token.token.symbol,
			},
			balance: token.balance,
			price: token.value / token.balance,
			value: token.value,
		})) ?? [];

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

	return (
		<div className="w-full lg:w-[800px] flex flex-col gap-2">
			{isLoading ? (
				<Skeleton className="h-[200px] w-full" />
			) : (
				<div className="flex flex-col gap-2">
					<div className="flex flex-row justify-between items-center gap-2">
						<div className="flex flex-row items-center gap-2">
							<IconCoins size={16} />
							<span className="text-[18px] font-bold">Tokens</span>
						</div>
						<div className="font-mono text-[16px]">
							{data?.total ? `$${formatNumber(data?.total ?? 0)}` : null}
						</div>
					</div>
					<DataTable columns={columns} data={columnsData} />
				</div>
			)}
		</div>
	);
}
