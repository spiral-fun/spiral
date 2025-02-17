"use client";

import { Button } from "@/components/ui/button";
import { IconCoins, IconMenu3 } from "@tabler/icons-react";
import { useSidebar } from "@/components/ui/sidebar";
import Search from "@/components/token/home-page/search";
import Trending from "@/components/token/home-page/trending";
import SmartMoneyInflows from "@/components/token/home-page/smart-money-inflows";

export default function Account() {
	const { toggleSidebar, open, isMobile } = useSidebar();

	return (
		<div className="h-screen">
			<header className="py-2 lg:py-0 w-full flex shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
				<div className="w-full flex items-center gap-2 px-4">
					<div
						className={`items-center gap-2 flex ${open && !isMobile ? "opacity-0" : "opacity-100"}`}
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
			<div className="w-full flex flex-col gap-8 justify-center items-center lg:items-center">
				<div className="w-full lg:w-[900px] items-center flex pl-2 lg:pl-0 gap-2">
					<IconCoins size={24} />
					<span className="text-[24px] font-bold">Tokens</span>
				</div>
				<div className="w-full lg:w-[900px] items-start flex flex-col px-2  gap-2">
					<Search />
				</div>
				<div className="w-full lg:w-[900px] items-start flex flex-col px-2  gap-2">
					<Trending />
				</div>
				<div className="w-full lg:w-[900px] items-start flex flex-col px-2  gap-2">
					<SmartMoneyInflows />
				</div>
			</div>
		</div>
	);
}
