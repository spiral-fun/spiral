import { useQuery } from "@tanstack/react-query";
import type { ITokenData } from "../types";
import { api } from "@/lib/api";
import ChartComponent from "./real-chart";
import { Skeleton } from "@/components/ui/skeleton";
import { useTheme } from "next-themes";

export default function Chart({
	tokenData,
	selectedTimeframe,
}: { tokenData: ITokenData; selectedTimeframe: string }) {
	const { theme } = useTheme();
	const { data, error, isLoading } = useQuery({
		queryKey: ["chart", tokenData.token.mint, selectedTimeframe],
		queryFn: async () => {
			const response = await api.get(
				`/token/${tokenData.token.mint}/chart?timeframe=${selectedTimeframe}`,
			);
			return response.data;
		},
		enabled: !!tokenData.token.mint || !!selectedTimeframe,
		refetchInterval: 10000,
	});

	if (isLoading) {
		return (
			<div className="w-full h-full flex flex-col gap-2">
				<Skeleton className="w-full h-[450px]" />
			</div>
		);
	}

	if (error) {
		return <div>Error: {error.message}</div>;
	}

	return (
		<ChartComponent
			data={data.oclhv}
			colors={{
				backgroundColor: theme === "dark" ? "black" : "white",
				textColor: theme === "dark" ? "white" : "black",
			}}
		/>
	);
}
