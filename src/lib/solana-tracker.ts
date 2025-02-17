import { env } from "@/env";
import axios from "axios";

export const solanaTracker = axios.create({
	baseURL: "https://data.solanatracker.io",
	headers: {
		"Content-Type": "application/json",
		"x-api-key": env.SOLANA_TRACKER_API_KEY,
	},
});
