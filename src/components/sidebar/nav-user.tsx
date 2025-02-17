"use client";

import { useFundWallet } from "@privy-io/react-auth/solana";
import { ChevronsUpDown, LogOut } from "lucide-react";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	useSidebar,
} from "@/components/ui/sidebar";
import { IconChartArrowsVertical, IconWallet } from "@tabler/icons-react";
import { usePrivy } from "@privy-io/react-auth";
import { useRouter } from "next/navigation";
import { Skeleton } from "../ui/skeleton";

export function NavUser({
	wallet,
}: {
	wallet?: string;
}) {
	const router = useRouter();
	const { isMobile } = useSidebar();
	const { user, logout } = usePrivy();
	const handleLogout = async () => {
		logout().then(() => router.push("/"));
	};
	const { fundWallet } = useFundWallet();

	const handleFundWallet = async () => {
		if (user?.wallet) {
			await fundWallet(user.wallet.address);
		}
	};

	return (
		<SidebarMenu>
			<SidebarMenuItem>
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<SidebarMenuButton
							size="default"
							variant={"default"}
							className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground border"
						>
							<IconWallet />
							<div className="grid flex-1 text-left text-sm leading-tight">
								{wallet ? (
									<span className="truncate font-mono">{wallet}</span>
								) : (
									<Skeleton className="w-full h-[20px]" />
								)}
							</div>
							<ChevronsUpDown className="ml-auto size-4" />
						</SidebarMenuButton>
					</DropdownMenuTrigger>
					<DropdownMenuContent
						className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
						side={isMobile ? "bottom" : "right"}
						align="end"
						sideOffset={4}
					>
						<DropdownMenuLabel className="p-0 font-normal">
							<div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
								<div className="flex flex-row items-center gap-1 text-left text-sm leading-tight max-w-full">
									<div className="w-min-[16px]">
										<IconWallet size={16} />
									</div>
									<span className="truncate font-semibold">{wallet}</span>
								</div>
							</div>
						</DropdownMenuLabel>
						<DropdownMenuSeparator />
						<DropdownMenuGroup>
							<DropdownMenuItem onClick={handleFundWallet}>
								<IconChartArrowsVertical size={16} />
								Fund Wallet
							</DropdownMenuItem>
						</DropdownMenuGroup>
						<DropdownMenuSeparator />
						<DropdownMenuItem onClick={handleLogout}>
							<LogOut />
							Log out
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</SidebarMenuItem>
		</SidebarMenu>
	);
}
