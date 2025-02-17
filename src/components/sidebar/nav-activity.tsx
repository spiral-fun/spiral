"use client";

import {
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from "@/components/ui/sidebar";
import { IconTransfer } from "@tabler/icons-react";
import Link from "next/link";

export function NavActivity() {
	return (
		<SidebarMenu className="px-2">
			<SidebarMenuItem>
				<SidebarMenuButton tooltip={"Activity"} asChild>
					<Link href={"/activity"}>
						<IconTransfer />
						<span className="font-bold">Activity</span>
					</Link>
				</SidebarMenuButton>
			</SidebarMenuItem>
		</SidebarMenu>
	);
}
