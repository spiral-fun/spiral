"use client";

import { Button } from "@/components/ui/button";
import { usePrivy } from "@privy-io/react-auth";
import { IconHistory, IconMenu3 } from "@tabler/icons-react";
import { useSidebar } from "@/components/ui/sidebar";
import { TooltipContent } from "@/components/ui/tooltip";
import { TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Tooltip } from "@/components/ui/tooltip";
import Tokens from "@/components/activity/tokens";
import Transactions from "@/components/activity/transactions";

export default function Account() {
	const { toggleSidebar, open, isMobile } = useSidebar();
	const { user } = usePrivy();

	const copyToClipboard = async () => {
		if (user?.wallet?.address) {
			await navigator.clipboard.writeText(user.wallet.address);
		}
	};

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
			<div className="w-full flex flex-col justify-center items-center lg:items-center gap-8">
				<div className="w-full lg:w-[800px] justify-start items-center flex pl-2 lg:pl-0 gap-2">
					<div className="flex flex-row items-center gap-2">
						<IconHistory size={24} />
						<span className="text-2xl font-bold">Activity</span>
					</div>

					<div>
						{user?.wallet?.address && (
							<TooltipProvider>
								<Tooltip delayDuration={150}>
									<TooltipTrigger
										className="font-mono truncate max-w-[200px] hover:bg-muted py-[5px] px-[6px] rounded-md"
										onClick={copyToClipboard}
									>
										{user.wallet.address}
									</TooltipTrigger>
									<TooltipContent>
										<p>Copy to clipboard</p>
									</TooltipContent>
								</Tooltip>
							</TooltipProvider>
						)}
					</div>
				</div>
				<Tokens />
				<Transactions />
			</div>
		</div>
	);
}
