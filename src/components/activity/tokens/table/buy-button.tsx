"use client";

import { Button } from "@/components/ui/button";
import { usePrivy } from "@privy-io/react-auth";
import { useFundWallet } from "@privy-io/react-auth/solana";

export function BuyButton() {
	const { user } = usePrivy();
	const { fundWallet } = useFundWallet();

	if (!user) {
		return null;
	}

	const wallet = user.wallet;

	if (!wallet) {
		return null;
	}

	return (
		<Button variant="outline" onClick={() => fundWallet(wallet.address)}>
			BUY
		</Button>
	);
}
