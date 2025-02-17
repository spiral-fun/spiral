import GlobalProviders from "@/components/global-providers";
import "@/styles/globals.css";
import { GeistSans } from "geist/font/sans";
import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "Spiral",
	description: "Built for the next generation of Solana",
	icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
	children,
}: Readonly<{ children: React.ReactNode }>) {
	return (
		<html lang="en" className={GeistSans.className} suppressHydrationWarning>
			<body>
				<GlobalProviders>{children}</GlobalProviders>
			</body>
		</html>
	);
}
