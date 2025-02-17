"use client";

import Header from "@/components/home/header";
import Hero from "@/components/home/hero";

export default function HomePage() {
	return (
		<div className="bg-background w-full h-full lg:px-[36px]">
			<Header />
			<Hero />
		</div>
	);
}
