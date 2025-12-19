import { BaseMessage } from '@langchain/core/messages';

interface ChatSession {
    messages: BaseMessage[];
    context: Record<string, unknown>;
}

const sessions = new Map<string, ChatSession>();

export class InMemoryChatHistory {
    private sessionId: string;

    constructor(options: { sessionId: string; userId: string }) {
        this.sessionId = `${options.userId}:${options.sessionId}`;
        if (!sessions.has(this.sessionId)) {
            sessions.set(this.sessionId, { messages: [], context: {} });
        }
    }

    async getMessages(): Promise<BaseMessage[]> {
        return sessions.get(this.sessionId)?.messages ?? [];
    }

    async addMessages(messages: BaseMessage[]): Promise<void> {
        const session = sessions.get(this.sessionId);
        if (session) {
            session.messages.push(...messages);
        }
    }

    async getContext(): Promise<Record<string, unknown>> {
        return sessions.get(this.sessionId)?.context ?? {};
    }

    setContext(context: Record<string, unknown>): void {
        const session = sessions.get(this.sessionId);
        if (session) {
            session.context = { ...session.context, ...context };
        }
    }
}

export function createChatHistory(options: { sessionId: string; userId: string }) {
    return new InMemoryChatHistory(options);
}
