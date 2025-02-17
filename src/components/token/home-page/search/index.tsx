import { IconSearch } from "@tabler/icons-react";
import { useState, useEffect } from "react";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
	Command,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
	CommandEmpty,
} from "@/components/ui/command";
import { useDebounce } from "@/hooks/use-debonce";
import { useSearchQuery, type Token } from "@/hooks/use-search-query";
import { Avatar } from "@/components/ui/avatar";
import { formatNumber } from "@/lib/utils";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

const LOADING_ITEMS = [
	{ id: "skeleton-1" },
	{ id: "skeleton-2" },
	{ id: "skeleton-3" },
];

const formatPrice = (price: number) => {
	if (price === 0) return "0.00";

	if (price < 0.00001) {
		return price.toFixed(8);
	}

	if (price < 0.001) {
		return price.toFixed(6);
	}

	if (price < 1) {
		return price.toFixed(4);
	}

	return formatNumber(price, 2);
};

const getTokenPrice = (token: Token) => {
	if (token.priceUsd !== undefined) {
		return token.priceUsd;
	}

	if (token.marketCapUsd && token.liquidityUsd) {
		return token.liquidityUsd / (token.marketCapUsd / 2);
	}

	return 0;
};

export default function Search() {
	const [open, setOpen] = useState(false);
	const [searchTerm, setSearchTerm] = useState("");
	const debouncedSearchTerm = useDebounce(searchTerm, 300);
	const { data: searchResults, isLoading } =
		useSearchQuery(debouncedSearchTerm);

	useEffect(() => {
		if (!open) {
			setSearchTerm("");
		}
	}, [open]);

	return (
		<div className="w-full items-start flex flex-col gap-2">
			<div className="flex items-start justify-start">
				<span className="text-[18px] font-bold">Search</span>
			</div>
			<Dialog open={open} onOpenChange={setOpen}>
				<DialogTrigger asChild>
					<Button
						variant="outline"
						className="relative flex w-full items-center justify-start gap-2 text-muted-foreground"
					>
						<IconSearch className="h-4 w-4" />
						<span>Search tokens...</span>
						<kbd className="pointer-events-none absolute right-2 hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
							⌘ + K
						</kbd>
					</Button>
				</DialogTrigger>
				<DialogContent className="sm:max-w-[500px] p-0">
					<VisuallyHidden>
						<DialogHeader className="w-0 h-0">
							<DialogTitle />
							<DialogDescription />
						</DialogHeader>
					</VisuallyHidden>
					<Command className="rounded-lg border shadow-md" shouldFilter={false}>
						<CommandInput
							placeholder="Search tokens..."
							value={searchTerm}
							onValueChange={setSearchTerm}
						/>
						<CommandList>
							{isLoading && (
								<div className="py-6 text-center">
									<div className="animate-pulse space-y-3">
										{LOADING_ITEMS.map((item) => (
											<div
												key={item.id}
												className="flex items-center gap-3 px-4 py-3"
											>
												<div className="h-8 w-8 rounded-full bg-muted" />
												<div className="flex flex-1 flex-col gap-2">
													<div className="h-4 w-24 rounded bg-muted" />
													<div className="h-3 w-16 rounded bg-muted" />
												</div>
												<div className="flex flex-col items-end gap-2">
													<div className="h-4 w-16 rounded bg-muted" />
													<div className="h-3 w-20 rounded bg-muted" />
												</div>
											</div>
										))}
									</div>
								</div>
							)}
							{!isLoading &&
								(!searchResults?.data || searchResults.data.length === 0) && (
									<CommandEmpty>No results found.</CommandEmpty>
								)}
							{!isLoading &&
								searchResults?.data &&
								searchResults.data.length > 0 && (
									<CommandGroup
										heading={`Tokens (${searchResults.data.length})`}
									>
										{searchResults.data.map((token) => (
											<CommandItem
												key={token.mint}
												value={token.mint}
												className="flex items-center gap-3 px-4 py-3 cursor-pointer"
												onSelect={() => {
													window.location.href = `/token/${token.mint}`;
													setOpen(false);
												}}
											>
												<Avatar className="h-8 w-8">
													<img
														src={token.image}
														alt={token.name}
														className="h-full w-full object-cover"
													/>
												</Avatar>
												<div className="flex flex-col">
													<span className="font-medium">{token.name}</span>
													<span className="text-xs text-muted-foreground">
														{token.symbol}
													</span>
												</div>
												<div className="ml-auto flex flex-col items-end">
													<span className="font-medium">
														${formatPrice(getTokenPrice(token))}
													</span>
													<span className="text-xs text-muted-foreground">
														MC: ${formatNumber(token.marketCapUsd || 0, 2)}
													</span>
												</div>
											</CommandItem>
										))}
									</CommandGroup>
								)}
						</CommandList>
					</Command>
				</DialogContent>
			</Dialog>
		</div>
	);
}
