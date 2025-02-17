import { AppSidebar } from "@/components/sidebar/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

export default function Layout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<SidebarProvider>
			<AppSidebar className="border-none" />
			<SidebarInset>
				<main className="lg:bg-sidebar lg:h-svh">
					<div className="lg:h-screen h-full bg-background lg:rounded">
						{children}
					</div>
				</main>
			</SidebarInset>
		</SidebarProvider>
	);
}
