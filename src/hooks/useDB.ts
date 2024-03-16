import { DBSchema, IDBPDatabase, openDB, wrap } from 'idb'
import { useSyncExternalStore } from 'react'

interface MyDB extends DBSchema {
    chats: {
        value: {
            name: string;
            id: number;
        };
        key: number;
        indexes: { 'by-id': number };
    };
    sesion: {
        value: {
            user_phone: string;
            session_id: string;
        };
        key: string;
    };
    info: {
        value: {
            name: string;
            user_phone: string;
        };
        key: string;
    }
}

class LocalDB {
    db: Promise<IDBPDatabase<MyDB>> | null = null

    constructor(db: Promise<IDBPDatabase<MyDB>> | null) {
        this.db = db
    }

    setDB(db: Promise<IDBPDatabase<MyDB>> | null) {
        this.db = db
        return this
    }

    async getChats() {
        if (this.db == null) return []
        const db = await this.db
        return db.getAll('chats')
    }

    async addChat(chat: MyDB['chats']['value']) {
        if (this.db == null) return
        const db = await this.db
        db.put('chats', chat, chat.id)
    }

    async getSesion() {
        if (this.db == null) return
        const db = await this.db
        return db.get('sesion', 'sesion')
    }

    async setSesion(sesion: MyDB['sesion']['value']) {
        if (this.db == null) return
        const db = await this.db
        try {
            await db.add('sesion', sesion, 'sesion')
        } catch {}
    }

    async getInfo() {
        if (this.db == null) return
        const db = await this.db
        return db.get('info', 'info')
    }

    async setInfo(info: MyDB['info']['value']) {
        if (this.db == null) return
        const db = await this.db
        try {
            await db.add('info', info, 'info')
        } catch {}    
    }

    isBrowser() {
        return this.db != null
    }
}

const ldb = new LocalDB(null)
const sldb = new LocalDB(null)

export function useLocalBD() {
    const u = useSyncExternalStore(
        () => () => { },
        () => ldb.db ? ldb : ldb.setDB(openDB<MyDB>('rchat', 1, {
            upgrade: (db) => {
                db.createObjectStore('chats', {
                    keyPath: 'id',
                    autoIncrement: true,
                }).createIndex('by-id', 'id', {
                    unique: true
                })

                db.createObjectStore('sesion')
                db.createObjectStore('info')
            }
        })
        ),
        () => sldb
    )
    return u
}