"use client";

import { env } from "@/env";
import { PrivyProvider } from "@privy-io/react-auth";
import { toSolanaWalletConnectors } from "@privy-io/react-auth/solana";
import { ThemeProvider } from "./theme-provider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";

const solanaConnectors = toSolanaWalletConnectors();

export default function GlobalProviders({
	children,
}: { children: React.ReactNode }) {
	const [queryClient] = useState(
		() =>
			new QueryClient({
				defaultOptions: {
					queries: {
						staleTime: 60 * 1000,
						refetchOnWindowFocus: false,
					},
				},
			}),
	);

	return (
		<QueryClientProvider client={queryClient}>
			<PrivyProvider
				appId={env.NEXT_PUBLIC_PRIVY_APP_ID}
				config={{
					appearance: {
						theme: "dark",
						accentColor: "#676FFF",
						logo: "https://i.imgur.com/QhzpBCA.png",
						walletChainType: "solana-only",
						showWalletLoginFirst: true,
					},
					embeddedWallets: {
						solana: {
							createOnLogin: "users-without-wallets",
						},
					},
					externalWallets: {
						solana: { connectors: solanaConnectors },
					},
				}}
			>
				<ThemeProvider
					attribute="class"
					defaultTheme="dark"
					disableTransitionOnChange
				>
					{children}
				</ThemeProvider>
			</PrivyProvider>
		</QueryClientProvider>
	);
}
