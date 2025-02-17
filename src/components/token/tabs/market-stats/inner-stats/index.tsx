import type { IStats } from "../../types";

export default function InnerStats({
	stats,
	selectedStat,
}: {
	stats: IStats;
	selectedStat: string;
}) {
	const formatNumber = (num: number) => {
		if (num >= 1000000000) {
			return `${(num / 1000000000).toFixed(0)} bi`;
		}
		if (num >= 1000000) {
			return `${(num / 1000000).toFixed(0)} mi`;
		}
		if (num >= 1000) {
			return `${(num / 1000).toFixed(0)} mil`;
		}
		return num.toFixed(0);
	};

	const totalTransactions = stats[selectedStat]
		? stats[selectedStat].sells + stats[selectedStat].buys
		: 0;
	const sellPercentage =
		totalTransactions > 0
			? ((stats[selectedStat]?.sells || 0) / totalTransactions) * 100
			: 0;
	const buyPercentage =
		totalTransactions > 0
			? ((stats[selectedStat]?.buys || 0) / totalTransactions) * 100
			: 0;

	const sellVolPercentage =
		totalTransactions > 0
			? ((stats[selectedStat]?.volume.sells || 0) / totalTransactions) * 100
			: 0;
	const buyVolPercentage =
		totalTransactions > 0
			? ((stats[selectedStat]?.volume.buys || 0) / totalTransactions) * 100
			: 0;

	return (
		<div className="w-full h-full border rounded-md rounded-t-none">
			<div className="flex flex-row justify-start items-start h-[64px]">
				<div className="flex flex-col justify-start items-start border-r w-32 md:w-28 p-2">
					<span className="text-xs text-neutral-600 dark:text-neutral-400 font-semibold">
						TXNS
					</span>
					<span className="text-lg font-semibold font-mono">
						{formatNumber(stats[selectedStat]?.transactions ?? 0)}
					</span>
				</div>
				<div className="flex flex-col w-full gap-1 p-2">
					<div className="flex justify-between text-xs">
						<span className="text-neutral-600 dark:text-neutral-400">
							SELLS
						</span>
						<span className="text-neutral-600 dark:text-neutral-400">BUYS</span>
					</div>
					<div className="flex w-full h-1 bg-neutral-800 rounded-full overflow-hidden">
						<div
							className="bg-red-500 h-full"
							style={{ width: `${sellPercentage}%` }}
						/>
						<div
							className="bg-green-500 h-full"
							style={{ width: `${buyPercentage}%` }}
						/>
					</div>
					<div className="flex justify-between text-xs">
						<span className="text-red-500">
							{stats[selectedStat]?.sells ?? 0}
						</span>
						<span className="text-green-500">
							{stats[selectedStat]?.buys ?? 0}
						</span>
					</div>
				</div>
			</div>
			<div className="flex flex-row justify-start items-start h-[64px]">
				<div className="flex flex-col justify-start items-start border-r w-32 md:w-28 p-2">
					<span className="text-xs text-neutral-600 dark:text-neutral-400 font-semibold">
						VOLUME
					</span>
					<span className="text-lg font-semibold font-mono">
						${formatNumber(stats[selectedStat]?.volume.total ?? 0)}
					</span>
				</div>
				<div className="flex flex-col w-full gap-1 p-2">
					<div className="flex justify-between text-xs">
						<span className="text-neutral-600 dark:text-neutral-400">
							SELLS VOL
						</span>
						<span className="text-neutral-600 dark:text-neutral-400">
							BUYS VOL
						</span>
					</div>
					<div className="flex w-full h-1 bg-neutral-800 rounded-full overflow-hidden">
						<div
							className="bg-red-500 h-full"
							style={{ width: `${sellVolPercentage}%` }}
						/>
						<div
							className="bg-green-500 h-full"
							style={{ width: `${buyVolPercentage}%` }}
						/>
					</div>
					<div className="flex justify-between text-xs">
						<span className="text-red-500">
							${formatNumber(stats[selectedStat]?.volume.sells ?? 0)}
						</span>
						<span className="text-green-500">
							${formatNumber(stats[selectedStat]?.volume.buys ?? 0)}
						</span>
					</div>
				</div>
			</div>
			<div className="flex flex-row justify-start items-start h-[64px]">
				<div className="flex flex-col justify-start items-start border-r w-32 md:w-28 p-2">
					<span className="text-xs text-neutral-600 dark:text-neutral-400 font-semibold">
						MARKERS
					</span>
					<span className="text-lg font-semibold font-mono">
						{formatNumber(stats[selectedStat]?.wallets ?? 0)}
					</span>
				</div>
				<div className="flex flex-col w-full gap-1 p-2">
					<div className="flex justify-between text-xs">
						<span className="text-neutral-600 dark:text-neutral-400">
							SELLERS
						</span>
						<span className="text-neutral-600 dark:text-neutral-400">
							BUYERS
						</span>
					</div>
					<div className="flex w-full h-1 bg-neutral-800 rounded-full overflow-hidden">
						<div
							className="bg-red-500 h-full"
							style={{ width: `${sellVolPercentage}%` }}
						/>
						<div
							className="bg-green-500 h-full"
							style={{ width: `${buyVolPercentage}%` }}
						/>
					</div>
					<div className="flex justify-between text-xs">
						<span className="text-red-500">
							{formatNumber(stats[selectedStat]?.sellers ?? 0)}
						</span>
						<span className="text-green-500">
							{formatNumber(stats[selectedStat]?.buyers ?? 0)}
						</span>
					</div>
				</div>
			</div>
		</div>
	);
}
