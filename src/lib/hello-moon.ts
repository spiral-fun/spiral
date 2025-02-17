import { env } from "@/env";
import { RestClient } from "@hellomoon/api";

const client = new RestClient(env.HELLOMOON_API_KEY);

export default client;
