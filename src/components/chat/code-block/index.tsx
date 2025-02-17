"use client";

import type React from "react";
import { useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import { Button } from "@/components/ui/button";
import { IconCheck, IconCopy } from "@tabler/icons-react";

interface CodeBlockProps {
	language: string;
	value: string;
}

export const CodeBlock: React.FC<CodeBlockProps> = ({ language, value }) => {
	const [copied, setCopied] = useState(false);

	const copyToClipboard = () => {
		navigator.clipboard.writeText(value);
		setCopied(true);
		setTimeout(() => setCopied(false), 2000);
	};

	return (
		<div className="relative">
			<Button
				className="absolute right-2 top-2 z-10"
				size="icon"
				variant="secondary"
				onClick={copyToClipboard}
			>
				{!copied ? (
					<IconCopy className={"text-gray-500"} />
				) : (
					<IconCheck className={"text-green-500"} />
				)}
			</Button>
			<SyntaxHighlighter
				language={language}
				style={vscDarkPlus}
				customStyle={{
					margin: "1em 0",
					borderRadius: "0.5rem",
					padding: "1em",
					fontSize: "0.8rem",
					overflowX: "auto",
					maxWidth: "calc(100vw - 1rem)",
				}}
				wrapLines={true}
				wrapLongLines={true}
				showLineNumbers={false}
			>
				{value}
			</SyntaxHighlighter>
		</div>
	);
};

export default CodeBlock;
