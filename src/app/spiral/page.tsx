"use client";

import Header from "@/components/home/header";
import SpiralToken from "@/components/home/token";

export default function Spiral() {
	return (
		<div className="bg-background w-full h-full lg:px-[36px]">
			<Header />
			<div className="w-full h-full flex flex-col items-center justify-center">
				<div className="flex flex-row items-center justify-center gap-4 py-10 lg:pt-20">
					<span className="text-5xl font-bold font-mono bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">
						Spiral
					</span>
					<span className="text-5xl font-bold font-mono bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">
						Token
					</span>
				</div>
				<SpiralToken />
			</div>
		</div>
	);
}
