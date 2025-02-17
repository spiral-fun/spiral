"use client";

import { useEffect, useRef, useState } from "react";
import { useChat } from "@ai-sdk/react";
import type { Message } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
	IconArrowRight,
	IconLoader,
	IconMenu3,
	IconUser,
	IconWhirl,
} from "@tabler/icons-react";
import { useSidebar } from "@/components/ui/sidebar";
import type { Components } from "react-markdown";
import CodeBlock from "@/components/chat/code-block";
import ReactMarkdown from "react-markdown";

type ChatComponentProps = {
	chat: {
		id: string;
		messages: Message[];
	};
	initialMessage?: string;
};

export default function ChatComponent({
	chat,
	initialMessage,
}: ChatComponentProps) {
	const [isProcessingInitial, setIsProcessingInitial] = useState(false);
	const messagesEndRef = useRef<HTMLDivElement>(null);
	const initialMessageProcessedRef = useRef(false);
	const { open, toggleSidebar, isMobile } = useSidebar();

	const {
		messages,
		input,
		handleInputChange,
		handleSubmit,
		isLoading,
		append,
	} = useChat({
		api: `/api/chat/messages/${chat.id}`,
		initialMessages: chat.messages.map((msg) => ({
			id: msg.id,
			content: msg.content,
			role: msg.role,
		})),
	});

	useEffect(() => {
		if (messagesEndRef.current && messages) {
			messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
		}
	}, [messages]);

	useEffect(() => {
		const processFirstMessage = async () => {
			if (
				initialMessage &&
				!isProcessingInitial &&
				chat.id &&
				!initialMessageProcessedRef.current
			) {
				try {
					setIsProcessingInitial(true);
					initialMessageProcessedRef.current = true;

					await append({
						role: "user",
						content: initialMessage,
					});

					window.history.replaceState({}, "", `/chat/${chat.id}`);
				} catch (error) {
					console.error("Error processing initial message:", error);
					initialMessageProcessedRef.current = false;
				} finally {
					setIsProcessingInitial(false);
				}
			}
		};

		processFirstMessage();
	}, [initialMessage, chat.id, append, isProcessingInitial]);

	const markdownComponents: Components = {
		code({ node, className, children, ...props }) {
			const match = /language-(\w+)/.exec(className || "");
			const language = match ? match[1] : "";

			return !className ? (
				<code
					className="bg-zinc-800 px-1 py-0.5 rounded text-sm text-white"
					{...props}
				>
					{children}
				</code>
			) : (
				<CodeBlock
					language={language ?? "text"}
					value={String(children).replace(/\n$/, "")}
				/>
			);
		},
		p({ children }) {
			return <p className="mb-4 last:mb-0">{children}</p>;
		},
		ul({ children }) {
			return <ul className="list-disc pl-4 mb-4 last:mb-0">{children}</ul>;
		},
		ol({ children }) {
			return <ol className="list-decimal pl-4 mb-4 last:mb-0">{children}</ol>;
		},
		li({ children }) {
			return <li className="mb-2 last:mb-0">{children}</li>;
		},
	};

	return (
		<div className="flex flex-col h-screen w-full overflow-hidden">
			<header className="flex-none h-[50px] sticky top-0 bg-background z-10">
				<div className="flex items-center h-full px-2 sm:px-4">
					<div
						className={`items-center gap-2 ${open && !isMobile ? "hidden" : "flex"}`}
					>
						<Button
							type="button"
							size={"icon"}
							variant={"ghost"}
							className="w-8 h-8"
							onClick={toggleSidebar}
						>
							<IconMenu3 size={16} />
						</Button>
					</div>
				</div>
			</header>

			<ScrollArea className="flex-1 p-2 sm:p-4 space-y-4 w-full mx-auto">
				<div className="flex flex-col gap-6">
					{messages.map((message, index) => (
						<div
							key={message.id}
							className={`flex flex-col sm:flex-row gap-2 sm:gap-4 ${index !== 0 && "border-t pt-4 sm:pt-6"} items-start`}
						>
							<div className="flex-shrink-0">
								{message.role === "assistant" ? (
									<Avatar className="h-8 w-8 sm:h-10 sm:w-10 flex items-center justify-center">
										<AvatarImage
											src="/spiral.png"
											className="hidden dark:block"
										/>
										<AvatarImage
											src="/spiral_black.png"
											className="block dark:hidden"
										/>
									</Avatar>
								) : (
									<Avatar className="h-8 w-8 sm:h-10 sm:w-10">
										<AvatarFallback>
											<IconUser size={20} />
										</AvatarFallback>
									</Avatar>
								)}
							</div>
							<div className="flex-1 max-w-full overflow-hidden break-words">
								<ReactMarkdown components={markdownComponents}>
									{message.content}
								</ReactMarkdown>
							</div>
						</div>
					))}
				</div>
				<div ref={messagesEndRef} />
			</ScrollArea>

			<div className="flex-none border-t p-2 sm:p-4 sticky bottom-0 bg-background w-full">
				<form onSubmit={handleSubmit} className="flex items-center gap-2">
					<Textarea
						value={input}
						onChange={handleInputChange}
						placeholder="Type a message..."
						className="flex-1 w-full resize-none focus-visible:ring-0 h-[50px] sm:h-[70px] min-h-[50px] sm:min-h-[70px] text-sm sm:text-base scrollbar-none"
						rows={1}
						disabled={isLoading || isProcessingInitial}
						onKeyDown={(e) => {
							if (e.key === "Enter" && !e.shiftKey) {
								e.preventDefault();
								handleSubmit(e as unknown as SubmitEvent);
							}
						}}
					/>
					<Button
						type="submit"
						disabled={!input.trim() || isLoading || isProcessingInitial}
						className="h-8 w-8 sm:h-10 sm:w-10 p-1.5 sm:p-2 rounded-full flex items-center justify-center flex-shrink-0"
					>
						{isLoading ? (
							<IconLoader className="animate-spin" />
						) : (
							<IconArrowRight />
						)}
						<span className="sr-only">Send message</span>
					</Button>
				</form>
			</div>
		</div>
	);
}
