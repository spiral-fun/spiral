import { Button } from "@/components/ui/button";
import { CardContent } from "@/components/ui/card";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { usePrivy, type User } from "@privy-io/react-auth";
import {
	type Icon,
	IconBrandGoogleFilled,
	IconMail,
	IconPhone,
} from "@tabler/icons-react";
import { IconBrandX } from "@tabler/icons-react";

interface ISocial {
	name: string;
	icon: Icon;
	linkFn: () => void;
	unlinkFn: () => Promise<User>;
}

interface ISocials {
	twitter: ISocial;
	google: ISocial;
	email: ISocial;
	phone: ISocial;
}

export default function ExternalLinks() {
	const {
		user,
		linkTwitter,
		linkPhone,
		linkEmail,
		linkGoogle,
		unlinkTwitter,
		unlinkPhone,
		unlinkEmail,
		unlinkGoogle,
	} = usePrivy();

	const socials: ISocials = {
		twitter: {
			name: "Twitter",
			icon: IconBrandX,
			linkFn: linkTwitter,
			unlinkFn: async () => {
				const updatedUser = await unlinkTwitter(user?.twitter?.subject ?? "");
				return updatedUser;
			},
		},

		google: {
			name: "Google",
			icon: IconBrandGoogleFilled,
			linkFn: linkGoogle,
			unlinkFn: async () => {
				const updatedUser = await unlinkGoogle(user?.google?.subject ?? "");
				return updatedUser;
			},
		},

		email: {
			name: "Email",
			icon: IconMail,
			linkFn: linkEmail,
			unlinkFn: async () => {
				const updatedUser = await unlinkEmail(user?.email?.address ?? "");
				return updatedUser;
			},
		},
		phone: {
			name: "Phone",
			icon: IconPhone,
			linkFn: linkPhone,
			unlinkFn: async () => {
				const updatedUser = await unlinkPhone(user?.phone?.number ?? "");
				return updatedUser;
			},
		},
	};

	const getConnectedValue = (key: keyof ISocials) => {
		if (!user) return "Not connected";

		switch (key) {
			case "twitter":
				return user.twitter?.username
					? `@${user.twitter.username}`
					: "Not connected";
			case "google":
				return user.google?.email ? `@${user.google.email}` : "Not connected";
			case "email":
				return user.email?.address ? user.email.address : "Not connected";
			case "phone":
				return user.phone?.number ? user.phone.number : "Not connected";
			default:
				return "Not connected";
		}
	};

	const isConnected = (key: keyof ISocials) => {
		if (!user) return false;

		switch (key) {
			case "twitter":
				return !!user.twitter?.subject;
			case "google":
				return !!user.google?.subject;
			case "email":
				return !!user.email?.address;
			case "phone":
				return !!user.phone?.number;
			default:
				return false;
		}
	};

	return (
		<>
			<div className="w-full lg:w-[600px] items-start flex pl-2 lg:pl-0">
				<span className="text-2xl font-bold">External Links</span>
			</div>

			<div className="px-1 w-full flex justify-center">
				{user ? (
					<Card className="w-full lg:w-[600px]">
						<CardContent className="w-full flex flex-col gap-4 py-4">
							<div className="w-full flex flex-col gap-4">
								{Object.entries(socials).map(([key, social]) => (
									<div
										key={key}
										className="w-full flex flex-row justify-between items-center gap-2 h-[36px]"
									>
										<div className="flex flex-row items-center gap-2">
											<div className="h-[32px] bg-muted w-[32px] flex items-center justify-center rounded-md">
												<social.icon size={16} />
											</div>
											<div className="flex flex-col leading-[15px]">
												<span className="text-[14px] text-muted-foreground">
													{social.name}
												</span>
												<span className="text-[12px]">
													{getConnectedValue(key as keyof ISocials)}
												</span>
											</div>
										</div>
										<div>
											<Button
												onClick={
													isConnected(key as keyof ISocials)
														? social.unlinkFn
														: social.linkFn
												}
												variant={
													isConnected(key as keyof ISocials)
														? "destructive"
														: "outline"
												}
												className="w-[91px]"
											>
												{isConnected(key as keyof ISocials)
													? "Unlink"
													: "Connect"}
											</Button>
										</div>
									</div>
								))}
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
