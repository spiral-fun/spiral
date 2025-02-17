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
	IconMessage,
	IconPlus,
	IconLoader,
} from "@tabler/icons-react";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { useChats } from "@/hooks/use-chats";

export function NavChat() {
	const router = useRouter();
	const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
		useChats();

	const getChatPreview = (chat: { messages: Array<{ content: string }> }) => {
		if (chat.messages.length === 0) return "New Chat";
		const firstMessage = chat.messages[0];
		if (!firstMessage) return "New Chat";
		return firstMessage.content.length > 30
			? `${firstMessage.content.substring(0, 30)}...`
			: firstMessage.content;
	};

	return (
		<SidebarMenu className="px-2">
			<div className="relative">
				<Button
					variant="ghost"
					size="icon"
					className="w-[24px] h-[24px] absolute top-1 right-8 z-10 flex items-center justify-center"
					onClick={() => router.push("/chat")}
				>
					<IconPlus size={16} />
				</Button>

				<Collapsible asChild defaultOpen={false} className="group/collapsible">
					<SidebarMenuItem>
						<CollapsibleTrigger asChild>
							<SidebarMenuButton tooltip={"Chats"}>
								<IconMessage />
								<span className="font-bold">Chats</span>
								<IconChevronDown className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-180" />
							</SidebarMenuButton>
						</CollapsibleTrigger>
						<CollapsibleContent>
							<SidebarMenuSub>
								{isLoading ? (
									<div className="flex justify-center py-2">
										<IconLoader size={16} className="animate-spin" />
									</div>
								) : (
									<>
										{data?.pages[0]?.items?.length ? (
											<>
												{data.pages.map((page) =>
													page.items.map((chat) => (
														<Button
															key={chat.id}
															variant="ghost"
															className={cn(
																"w-full justify-start gap-2 h-8 px-2 text-sm",
																"hover:bg-accent hover:text-accent-foreground",
																"group relative",
															)}
															onClick={() => router.push(`/chat/${chat.id}`)}
														>
															<span className="truncate font-mono">
																{getChatPreview(chat)}
															</span>
														</Button>
													)),
												)}
												{hasNextPage && (
													<Button
														variant="outline"
														size="sm"
														className="w-full justify-center h-8 text-xs"
														onClick={() => fetchNextPage()}
														disabled={isFetchingNextPage}
													>
														{isFetchingNextPage ? (
															<IconLoader size={14} className="animate-spin" />
														) : (
															"Show More"
														)}
													</Button>
												)}
											</>
										) : (
											<div className="flex justify-start py-2 text-sm text-muted-foreground">
												No saved chats
											</div>
										)}
									</>
								)}
							</SidebarMenuSub>
						</CollapsibleContent>
					</SidebarMenuItem>
				</Collapsible>
			</div>
		</SidebarMenu>
	);
}
