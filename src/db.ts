import Dexie from "dexie";
import { IConversation } from "./components/types";

export class ChatHistoryDB extends Dexie {
    public conversations!: Table<IConversation, number>;
    constructor(){
        super('ChatHistoryDB');
        this.version(1).stores({
            conversations: '++id, timestamp, title'
        });
    }
}

export const db = new ChatHistoryDB();