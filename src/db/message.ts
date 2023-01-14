import db from "./database";

export interface Message {
	id: number;
	content: string;
	time: Date;
	username: string;
}

export class MessageManager {
	static async getMessage(id: number) {
		const { rows } = await db.query("SELECT content, t, username FROM message WHERE id = $1", [id]);
		if (!rows[0]) {
			return {} as Message;
		} else {
			const { content, t: time, username } = rows[0];
			return {
				id,
				content,
				time,
				username
			} as Message;
		}
	}

	static async save(username: string, content: string) {
		if (!username || !content) {
			return;
		}

		await db.query("INSERT INTO message(username, content, t) VALUES($1, $2, $3)", [username, content, new Date()]);
	}

	static async *list(messages: number[]) {
		for (let message of messages) {
			yield await MessageManager.getMessage(message);
		}
	}
}
