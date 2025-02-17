"use client";

import StartBox from "@/components/chat/start-box";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useSidebar } from "@/components/ui/sidebar";
import { useChats } from "@/hooks/use-chats";
import { api } from "@/lib/api";
import { IconMenu3, IconTrendingUp } from "@tabler/icons-react";
import { useRouter } from "next/navigation";

export default function Page() {
	const { open, toggleSidebar, isMobile } = useSidebar();
	const { addNewChat } = useChats();
	const router = useRouter();

	const handleSubmit = async (message: string) => {
		try {
			const response = await api.post("/chat/create", {
				model: "auto",
			});

			if (response.data.id) {
				addNewChat({
					id: response.data.id,
					messages: [
						{
							content: message,
							role: "user",
						},
					],
				});

				const queryParams = new URLSearchParams({
					m: message,
				}).toString();

				router.push(`/chat/${response.data.id}?${queryParams}`);
			}
		} catch (error) {
			console.error(error);
		}
	};

	return (
		<div className="flex flex-col min-h-[calc(100vh-1rem)]">
			<header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
				<div className="flex items-center gap-2 px-4">
					<div
						className={`items-center gap-2 ${open && !isMobile ? "hidden" : "flex"}`}
					>
						<Button
							type="button"
							size={"icon"}
							variant={"ghost"}
							className="w-[24px] h-[24px]"
							onClick={toggleSidebar}
						>
							<IconMenu3 size={16} />
						</Button>
					</div>
				</div>
			</header>
			<div className="flex-1 w-full flex flex-col gap-10 justify-center items-center">
				<div className="flex flex-col gap-2 items-center">
					<span className="text-4xl font-semibold">Welcome to Spiral</span>
					<span className="max-w-[300px] lg:max-w-full text-center text-sm text-muted-foreground">
						Unleash a "spiral" of AI agents to navigate DeFi on Solana
					</span>
				</div>
				<div className="hidden lg:grid grid-cols-3 gap-4">
					<div>
						<Card
							onClick={() =>
								handleSubmit(
									"Help find the best trending tokens to buy on Solana",
								)
							}
							className="h-[130px] hover:brightness-110 cursor-pointer transition-all duration-300"
						>
							<CardContent className="p-4 max-w-[200px]">
								<div className="flex flex-col items-start gap-2">
									<div className="flex flex-row gap-2 items-center">
										<div className="w-[32px] h-[32px] rounded-full bg-secondary flex items-center justify-center">
											<IconTrendingUp size={16} />
										</div>
										<span className="font-bold">Trending</span>
									</div>
									<div>
										<span className="text-sm">
											Find the best tokens to buy on Solana
										</span>
									</div>
								</div>
							</CardContent>
						</Card>
					</div>
					<div>
						<Card
							onClick={() =>
								handleSubmit("Help me swap solana coins on Raydium")
							}
							className="h-[130px] hover:brightness-110 cursor-pointer transition-all duration-300"
						>
							<CardContent className="p-4 max-w-[200px]">
								<div className="flex flex-col items-start gap-2">
									<div className="flex flex-row gap-2 items-center">
										<div className="w-[32px] h-[32px] rounded-full bg-secondary flex items-center justify-center">
											<IconTrendingUp size={16} />
										</div>
										<span className="font-bold">Trade</span>
									</div>
									<div>
										<span className="text-sm">Swap on Raydium</span>
									</div>
								</div>
							</CardContent>
						</Card>
					</div>
					<div>
						<Card
							onClick={() => handleSubmit("Help me make a solana trading bot")}
							className="h-[130px] hover:brightness-110 cursor-pointer transition-all duration-300"
						>
							<CardContent className="p-4 max-w-[200px]">
								<div className="flex flex-col items-start gap-2">
									<div className="flex flex-row gap-2 items-center">
										<div className="w-[32px] h-[32px] rounded-full bg-secondary flex items-center justify-center">
											<IconTrendingUp size={16} />
										</div>
										<span className="font-bold">Knowledge</span>
									</div>
									<div>
										<span className="text-sm">Make a Solana trading bot</span>
									</div>
								</div>
							</CardContent>
						</Card>
					</div>
				</div>
			</div>

			<footer className="sticky bottom-0 w-full bg-background">
				<StartBox />
			</footer>
		</div>
	);
}
