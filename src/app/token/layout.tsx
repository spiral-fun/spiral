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
				<main className="lg:bg-sidebar h-screen">
					<div className=" h-full bg-background lg:rounded overflow-y-auto">
						{children}
					</div>
				</main>
			</SidebarInset>
		</SidebarProvider>
	);
}
