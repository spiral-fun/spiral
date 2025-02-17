import { GridPatternCard } from "@/components/ui/card-with-grid-ellipsis-pattern";
import { GridPatternCardBody } from "@/components/ui/card-with-grid-ellipsis-pattern";

export default function SpiralToken() {
	return (
		<div className="w-full h-full grid grid-cols-1 gap-4 px-2 lg:px-52">
			<GridPatternCard>
				<GridPatternCardBody>
					<h3 className="text-lg font-bold mb-1 text-foreground">
						85% Circulating Supply
					</h3>
					<p className="text-wrap text-sm text-foreground/60">
						The majority of tokens will be in circulation from launch, ensuring
						liquidity and broad community distribution.
					</p>
				</GridPatternCardBody>
			</GridPatternCard>
			<GridPatternCard>
				<GridPatternCardBody>
					<h3 className="text-lg font-bold mb-1 text-foreground">
						10% Locked for 2 Years
					</h3>
					<p className="text-wrap text-sm text-foreground/60">
						Reserved for future development, partnerships, and ecosystem growth,
						unlocking after two years.
					</p>
				</GridPatternCardBody>
			</GridPatternCard>
			<GridPatternCard>
				<GridPatternCardBody>
					<h3 className="text-lg font-bold mb-1 text-foreground">
						5% Team Allocation
					</h3>
					<p className="text-wrap text-sm text-foreground/60">
						Set aside for the core team, aligning incentives and supporting
						long-term contributions, with potential vesting.
					</p>
				</GridPatternCardBody>
			</GridPatternCard>
		</div>
	);
}
