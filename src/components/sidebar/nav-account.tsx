"use client";

import {
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from "@/components/ui/sidebar";
import { IconUser } from "@tabler/icons-react";
import Link from "next/link";

export function NavAccount() {
	return (
		<SidebarMenu className="px-2">
			<SidebarMenuItem>
				<SidebarMenuButton tooltip={"Account"} asChild>
					<Link href={"/account"}>
						<IconUser />
						<span className="font-bold">Account</span>
					</Link>
				</SidebarMenuButton>
			</SidebarMenuItem>
		</SidebarMenu>
	);
}
