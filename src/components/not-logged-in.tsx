"use client";

import type React from "react";
import { useLogin } from "@privy-io/react-auth";
import {
	AlertDialog,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import Image from "next/image";
import { Button } from "@/components/ui/button";

const NotLoggedIn: React.FC = () => {
	const { login } = useLogin();

	return (
		<AlertDialog open={true}>
			<AlertDialogHeader className="hidden">
				<AlertDialogTitle>You are not logged in</AlertDialogTitle>
				<AlertDialogDescription>
					Please login to continue
				</AlertDialogDescription>
			</AlertDialogHeader>
			<AlertDialogContent className="flex flex-col items-center justify-center gap-4">
				<Image
					src={"/spiral.png"}
					alt="Spiral"
					width={64}
					height={64}
					className="hidden dark:block"
				/>
				<Image
					src={"/spiral_black.png"}
					alt="Spiral"
					width={64}
					height={64}
					className="block dark:hidden"
				/>
				<h1 className="text-2xl font-bold">You are not logged in</h1>
				<p className="text-sm text-gray-500">Please login to continue</p>
				<Button onClick={() => login()}>Login</Button>
			</AlertDialogContent>
		</AlertDialog>
	);
};

export default NotLoggedIn;
