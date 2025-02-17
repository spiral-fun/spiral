"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { IconArrowRight } from "@tabler/icons-react";
import { useLogin } from "@privy-io/react-auth";
import { useRouter } from "next/navigation";

function Hero() {
	const { login } = useLogin({
		onComplete: () => {
			router.push("/chat");
		},
	});
	const router = useRouter();

	return (
		<div className="w-full py-20 lg:py-20 px-4 ">
			<div className="container mx-auto">
				<div className="grid grid-cols-1 gap-8 items-center lg:grid-cols-2">
					<div className="flex gap-4 flex-col">
						<div>
							<Badge variant="outline">We&apos;re live!</Badge>
						</div>
						<div className="flex gap-4 flex-col">
							<h1 className="text-5xl md:text-7xl max-w-lg tracking-tighter text-left font-regular">
								Intelligent DeFi Agents
							</h1>
							<p className="text-xl leading-relaxed tracking-tight text-muted-foreground max-w-md text-left">
								Spiral is a network of specialized, composable DeFi agents that
								collaborate to perform complex on-chain operations. Built on the
								Solana blockchain, Spiral seamlessly unifies various DeFi
								functions—such as trading, staking, liquidity management, and
								sentiment analysis—within a single platform powered by a natural
								language interface. By enabling agents to coordinate
								dynamically, Spiral removes the steep learning curve for new
								DeFi users, delivering powerful yet flexible solutions through
								conversational commands and interactive visuals.
							</p>
						</div>
						<div className="flex flex-row gap-4">
							<Button size="lg" className="gap-4" onClick={() => login()}>
								Start here <IconArrowRight className="w-4 h-4" />
							</Button>
						</div>
					</div>
					<div className="rounded-md">
						<Image
							src={"/screenshot.jpeg"}
							width={2000}
							height={2000}
							alt="Spiral Website"
							className="rounded-md"
						/>
					</div>
				</div>
			</div>
		</div>
	);
}

export { Hero };
