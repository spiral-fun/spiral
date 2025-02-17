"use client";

import type * as React from "react";
import { NavTokens } from "@/components/sidebar/nav-tokens";
import { NavUser } from "@/components/sidebar/nav-user";
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarHeader,
	useSidebar,
} from "@/components/ui/sidebar";
import {
	IconBrandDiscordFilled,
	IconBrandX,
	IconMenu3,
	IconMoon,
	IconSun,
} from "@tabler/icons-react";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import { useTheme } from "next-themes";
import { NavChat } from "./nav-chats";
import { NavAccount } from "./nav-account";
import { NavActivity } from "./nav-activity";
import { usePrivy } from "@privy-io/react-auth";
import Image from "next/image";
import Link from "next/link";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
	const { toggleSidebar } = useSidebar();
	const { user } = usePrivy();
	const { theme, setTheme } = useTheme();

	const handleThemeChange = () => setTheme(theme === "dark" ? "light" : "dark");

	return (
		<Sidebar collapsible="icon" {...props}>
			<SidebarHeader>
				<div className="w-full px-2 py-2 flex justify-between items-center group-data-[collapsible=icon]:px-0">
					<div className="flex flex-row items-center gap-2">
						<Image
							src={"/spiral.png"}
							alt="Spiral"
							width={32}
							height={32}
							className="hidden dark:block"
						/>
						<Image
							src={"/spiral_black.png"}
							alt="Spiral"
							width={32}
							height={32}
							className="block dark:hidden"
						/>
						<span className="text-[18px] font-bold group-data-[collapsible=icon]:hidden">
							Spiral
						</span>
					</div>
					<div className="flex flex-row gap-1 items-center group-data-[collapsible=icon]:hidden">
						<Button
							type="button"
							size={"icon"}
							variant={"ghost"}
							className="w-[24px] h-[24px]"
							onClick={handleThemeChange}
						>
							<IconSun size={16} className="dark:block hidden" />
							<IconMoon size={16} className="dark:hidden block" />
						</Button>
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
				<Separator orientation="horizontal" className="mr-2 h-[1px]" />
			</SidebarHeader>
			<SidebarContent className="pt-2">
				<NavChat />
				<NavTokens />
				<NavAccount />
				<NavActivity />
			</SidebarContent>
			<SidebarFooter>
				<div className="py-2">
					<Separator orientation="horizontal" className="mr-2 h-[1px]" />
				</div>
				<NavUser wallet={user?.wallet?.address} />
				<Link href={"https://x.com/spiral_fw"} target="_blank">
					<Button
						variant={"ghost"}
						className="h-[32px] flex items-center justify-start px-2"
					>
						<IconBrandX size={16} />
						<span className="group-data-[collapsible=icon]:hidden font-mono">
							Follow Us
						</span>
					</Button>
				</Link>
			</SidebarFooter>
		</Sidebar>
	);
}
