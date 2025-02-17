import { PrivyClient } from "@privy-io/server-auth";

import { env } from "@/env";

const createPrivyClient = () =>
	new PrivyClient(env.NEXT_PUBLIC_PRIVY_APP_ID, env.PRIVY_APP_SECRET);

const globalForPrivy = globalThis as unknown as {
	privy: ReturnType<typeof createPrivyClient> | undefined;
};

export const privy = globalForPrivy.privy ?? createPrivyClient();
