"use client";

import Header from "@/components/home/header";
import { Hero } from "@/components/ui/hero-with-image-text-and-two-buttons";

export default function About() {
	return (
		<div className="bg-background w-full h-full lg:px-[36px]">
			<Header />
			<div>
				<Hero />
			</div>
		</div>
	);
}
