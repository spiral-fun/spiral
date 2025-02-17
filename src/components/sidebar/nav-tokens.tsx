"use client";

import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarMenuSub,
} from "@/components/ui/sidebar";
import {
	IconChevronDown,
	IconCoins,
	IconLoader,
	IconStar,
} from "@tabler/icons-react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import Link from "next/link";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";

export function NavTokens() {
	const {
		data: favorites,
		isLoading,
		error,
	} = useQuery({
		queryKey: ["favoriteTokens"],
		queryFn: async () => {
			const response = await api.get("/token/favorite");
			return response.data.favorites;
		},

		refetchInterval: 1000,
	});

	const router = useRouter();

	return (
		<SidebarMenu className="px-2">
			<Collapsible asChild defaultOpen={false} className="group/collapsible">
				<SidebarMenuItem>
					<CollapsibleTrigger asChild>
						<SidebarMenuButton
							tooltip={"Tokens"}
							onClick={() => router.push("/token")}
						>
							<IconCoins />
							<span className="font-bold">Tokens</span>
							<IconChevronDown className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-180" />
						</SidebarMenuButton>
					</CollapsibleTrigger>
					<CollapsibleContent>
						<SidebarMenuSub>
							{isLoading ? (
								<div className="flex justify-center py-2">
									<IconLoader size={16} className="animate-spin" />
								</div>
							) : error ? (
								<div className="flex justify-start py-2 text-sm text-red-500">
									Error loading favorites
								</div>
							) : favorites.length > 0 ? (
								favorites.map(
									(favorite: { tokenId: string; symbol: string }) => (
										<div key={favorite.tokenId} className="relative">
											<Link href={`/token/${favorite.tokenId}`}>
												<Button
													className="flex justify-start text-sm w-full px-2 h-[24px]"
													variant={"ghost"}
												>
													<span>${favorite.symbol}</span>
												</Button>
											</Link>
											<Button
												variant="ghost"
												size="icon"
												className="w-[24px] h-[24px] absolute top-0 right-4 z-10 flex items-center justify-center"
												onClick={() => {
													api.post("/token/favorite", {
														tokenId: favorite.tokenId,
														symbol: favorite.symbol,
													});
												}}
											>
												<IconStar size={16} className="stroke-yellow-400" />
											</Button>
										</div>
									),
								)
							) : (
								<div className="flex justify-start py-2 text-sm text-muted-foreground">
									No favorite tokens
								</div>
							)}
						</SidebarMenuSub>
					</CollapsibleContent>
				</SidebarMenuItem>
			</Collapsible>
		</SidebarMenu>
	);
}
