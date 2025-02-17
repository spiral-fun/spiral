import { api } from "@/lib/api";
import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";

export type Chat = {
	id: string;
	messages: Array<{
		content: string;
		role: "user" | "assistant";
	}>;
};

type ChatsResponse = {
	items: Chat[];
	nextCursor?: string;
};

export function useChats() {
	const queryClient = useQueryClient();

	const query = useInfiniteQuery<ChatsResponse>({
		queryKey: ["chats"],
		queryFn: async ({ pageParam = undefined }) => {
			const response = await api.get<ChatsResponse>("/chat", {
				params: {
					cursor: pageParam,
					limit: 5,
				},
			});
			return response.data;
		},
		initialPageParam: null as string | null,
		getNextPageParam: (lastPage) => lastPage.nextCursor ?? null,
	});

	const addNewChat = (newChat: Chat) => {
		queryClient.setQueryData<{
			pages: ChatsResponse[];
			pageParams: (string | null)[];
		}>(["chats"], (old) => {
			if (!old) return { pages: [{ items: [newChat] }], pageParams: [null] };

			// Add the new chat to the first page
			const newPages = [...old.pages];
			if (newPages[0]) {
				newPages[0] = {
					...newPages[0],
					items: [newChat, ...newPages[0].items],
				};
			}

			return {
				...old,
				pages: newPages,
			};
		});
	};

	return {
		...query,
		addNewChat,
	};
}
