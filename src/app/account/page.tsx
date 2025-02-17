"use client";

import { Button } from "@/components/ui/button";
import { IconMenu3 } from "@tabler/icons-react";
import { useSidebar } from "@/components/ui/sidebar";
import ExternalLinks from "@/components/account/external-links";
import AccountDetails from "@/components/account/account-details";

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
			<div className="w-full flex flex-col justify-center items-center lg:items-center gap-4">
				<AccountDetails />
				<ExternalLinks />
			</div>
		</div>
	);
}
