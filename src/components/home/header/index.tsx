import { Button } from "@/components/ui/button";
import { useLogin } from "@privy-io/react-auth";
import {
	IconBrandGithub,
	IconBrandGithubFilled,
	IconBrandX,
} from "@tabler/icons-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Header() {
	const { login } = useLogin({
		onComplete: () => {
			router.push("/chat");
		},
	});
	const router = useRouter();

	return (
		<header className="w-[90%] lg:w-[80%] h-16 bg-background backdrop-blur-sm top-4 lg:top-6 sticky z-50 rounded-lg border border-border/40 mx-auto">
			<div className="w-full h-full flex flex-row items-center justify-between px-4">
				<Link
					href={"/"}
					className="flex flex-row items-center justify-center gap-3 select-none"
				>
					<Image
						src="/spiral.png"
						alt="Spiral"
						width={32}
						height={32}
						className="hover:rotate-180 transition-transform duration-500"
					/>
					<span className="text-2xl font-bold font-mono bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">
						Spiral
					</span>
				</Link>
				<ul className="col-start-2 gap-5 px-2 font-mono font-semibold uppercase -tracking-2 text-brand-neutrals-700 dark:text-brand-neutrals-200 xl:gap-11 hidden lg:flex">
					<li>
						<Link
							className="transition-colors duration-300 hover:text-brand-foreground motion-reduce:transition-none"
							href="/about"
						>
							ABOUT
						</Link>
					</li>
					<li>
						<Link
							className="transition-colors duration-300 hover:text-brand-foreground motion-reduce:transition-none"
							href="/spiral"
						>
							TOKEN
						</Link>
					</li>
				</ul>
				<div className="flex flex-row items-center justify-center gap-2">
					<Link href={"https://github.com/spiral-fw/spiral"} target="_blank">
						<Button size={"icon"} variant={"ghost"}>
							<IconBrandGithub />
						</Button>
					</Link>
					<Link href={"https://x.com/spiral_fw"} target="_blank">
						<Button size={"icon"} variant={"ghost"}>
							<IconBrandX />
						</Button>
					</Link>
					<Button
						className="h-[46px] font-mono text-[14px] transition-colors"
						variant="outline"
						onClick={() => login()}
					>
						SIGN IN
					</Button>
				</div>
			</div>
		</header>
	);
}
