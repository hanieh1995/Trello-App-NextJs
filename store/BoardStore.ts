import { databases } from '@/appwrite';
import { getTodosGroupedByColumn } from '@/utils/getTodosGroupedByColumn';
import { create } from 'zustand'

interface BoardState {
    board: Board;
    getBoard: () => void;
    setBoardState: (board: Board) => void;
    updateTodoInDb: (todo: Todo, columnId: TypedColumn, ) => void;

    searchString: string;
    setSearchString: (searchString:string) => void;
}

export const useBoardStore = create<BoardState>((set) => ({
    board: {
        columns: new Map<TypedColumn, Column>(),
    },

    searchString:"",
    setSearchString:(searchString) => set({ searchString }),

    getBoard: async () => {
        const board = await getTodosGroupedByColumn();
        set({ board });
    },
    setBoardState: (board)=> set({board}),

    updateTodoInDb: async (todo, columnId) =>{
        await databases.updateDocument(
            process.env.NEXT_PUBLIC_DATABASE_ID!,
            process.env.NEXT_PUBLIC_TODOS_COLLECTION_ID!,
            todo.$id,
            {
                title: todo.title,
                status: columnId,
            }
        )
    }
}))

