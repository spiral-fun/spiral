"use client";

import { Textarea } from "@/components/ui/textarea";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	IconArrowRight,
	IconArrowsShuffle2,
	IconLoader,
} from "@tabler/icons-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormMessage,
} from "@/components/ui/form";
import { api } from "@/lib/api";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useChats } from "@/hooks/use-chats";
import type { ITokenData } from "../tabs/types";

const formSchema = z.object({
	message: z
		.string()
		.min(1, {
			message: "Message is required",
		})
		.max(1000, {
			message: "Message must be less than 1000 characters",
		}),
	model: z.enum(["auto", "openai", "gemini", "deepseek"], {
		message: "Model is required",
	}),
});

export default function StartBox({ token }: { token: ITokenData }) {
	const router = useRouter();
	const [isLoading, setIsLoading] = useState(false);
	const { addNewChat } = useChats();
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			message: "",
			model: "auto",
		},
	});

	const handleSubmit = async (values: z.infer<typeof formSchema>) => {
		if (isLoading) return;

		setIsLoading(true);
		try {
			const response = await api.post("/chat/create", {
				model: values.model,
				token: token,
			});

			if (response.data.id) {
				addNewChat({
					id: response.data.id,
					messages: [
						{
							content: values.message,
							role: "user",
						},
					],
				});

				const queryParams = new URLSearchParams({
					m: values.message,
				}).toString();

				router.push(`/chat/${response.data.id}?${queryParams}`);
			}
		} catch (error) {
			console.error(error);
			setIsLoading(false);
		}
	};

	return (
		<div className="w-full flex flex-col p-4">
			<Form {...form}>
				<form onSubmit={form.handleSubmit(handleSubmit)}>
					<FormField
						control={form.control}
						name="message"
						render={({ field }) => (
							<FormItem>
								<FormControl>
									<Textarea
										className="w-full resize-none rounded-b-none border-b-0 focus-visible:ring-0 h-[40px] min-h-[40px] scrollbar-none"
										placeholder="Ask anything..."
										disabled={isLoading}
										{...field}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<div className="flex justify-between items-center w-full border-x border-b px-4 py-2 rounded-x-md rounded-b-md">
						<div>
							<FormField
								control={form.control}
								name="model"
								render={({ field }) => (
									<FormItem>
										<Select
											onValueChange={field.onChange}
											defaultValue={field.value}
											disabled={isLoading}
										>
											<SelectTrigger className="w-[150px]">
												<SelectValue />
											</SelectTrigger>
											<SelectContent>
												<SelectItem value="auto">
													<div className="flex items-center gap-2">
														<IconArrowsShuffle2 size={16} />
														<span>Auto</span>
													</div>
												</SelectItem>
												<SelectItem value="openai">
													<div className="flex items-center gap-2">
														<Image
															priority
															src={"/openai.webp"}
															height={16}
															width={16}
															alt="openai"
															className="rounded-full"
														/>
														<span className="text-[14px]">Open AI</span>
													</div>
												</SelectItem>
												<SelectItem value="gemini">
													<div className="flex items-center gap-2">
														<Image
															priority
															src={"/google.png"}
															height={16}
															width={16}
															alt="gemini"
															className="rounded-full"
														/>
														<span className="text-[14px]">Gemini</span>
													</div>
												</SelectItem>
												<SelectItem value="deepseek">
													<div className="flex items-center gap-2">
														<Image
															priority
															src={"/deepseek.svg"}
															height={16}
															width={16}
															alt="deepseek"
															className="rounded-full"
														/>
														<span className="text-[14px]">Deepseek</span>
													</div>
												</SelectItem>
											</SelectContent>
										</Select>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>
						<Button
							size={"icon"}
							className="rounded-full flex items-center"
							type="submit"
							disabled={
								form.getValues().message.length === 0 ||
								form.formState.isSubmitting ||
								isLoading
							}
						>
							{isLoading ? (
								<IconLoader className="animate-spin" />
							) : (
								<IconArrowRight />
							)}
						</Button>
					</div>
				</form>
			</Form>
		</div>
	);
}
