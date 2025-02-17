import { Separator } from "@/components/ui/separator";
import { AvatarFallback } from "@/components/ui/avatar";
import { Avatar } from "@/components/ui/avatar";
import { CardContent, CardDescription, CardTitle } from "@/components/ui/card";
import { Card } from "@/components/ui/card";
import { TooltipContent } from "@/components/ui/tooltip";
import { Tooltip, TooltipTrigger } from "@/components/ui/tooltip";
import { TooltipProvider } from "@/components/ui/tooltip";
import { usePrivy } from "@privy-io/react-auth";
import { format } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";

export default function AccountDetails() {
	const { user } = usePrivy();

	const copyToClipboard = async () => {
		if (user?.wallet?.address) {
			try {
				await navigator.clipboard.writeText(user.wallet.address);
			} catch (error) {
				console.error("Failed to copy to clipboard", error);
			}
		}
	};

	return (
		<>
			<div className="w-full lg:w-[600px] items-start flex pl-2 lg:pl-0">
				<span className="text-2xl font-bold">Account</span>
			</div>

			<div className="px-1 w-full flex justify-center">
				{user ? (
					<Card className="w-full lg:w-[600px]">
						<CardContent className="flex flex-col gap-4 py-4">
							<div className="w-full">
								<div className="flex flex-row items-center gap-2 pb-2">
									<Avatar className="w-[50px] h-[50px]">
										<AvatarFallback>
											{user.wallet?.address.at(0)}
											{user.wallet?.address.at(1)}
										</AvatarFallback>
									</Avatar>
									<div className="flex flex-col gap-1">
										<CardTitle className="w-full">
											{user.wallet?.address && (
												<TooltipProvider>
													<Tooltip delayDuration={150}>
														<TooltipTrigger
															className="font-mono truncate max-w-[300px] hover:bg-muted py-[5px] px-[6px] rounded-md"
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
										</CardTitle>
										<CardDescription className="text-[12px]">
											{user.createdAt &&
												`Joined at ${format(user.createdAt, "MMM d, yyyy")}`}
										</CardDescription>
									</div>
								</div>
								<Separator className="w-full h-[1px]" />
							</div>
							<div className="flex flex-col gap-1">
								<p className="text-xs font-bold text-muted-foreground">
									User ID
								</p>
								<p className="text-sm font-mono">{user.id.split(":").at(2)}</p>
							</div>
							<Separator className="w-full h-[1px]" />
							<div className="flex flex-col gap-1">
								<p className="text-xs font-bold text-muted-foreground">
									Connected Wallet
								</p>
								<p className="text-sm truncate font-mono">
									{user.wallet?.address}
								</p>
							</div>
						</CardContent>
					</Card>
				) : (
					<Skeleton className="w-full lg:w-[600px] h-[220px]" />
				)}
			</div>
		</>
	);
}
