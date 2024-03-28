import { DBSchema, IDBPDatabase, openDB } from 'idb'
// import { useSyncExternalStore } from 'react'

export interface MyDB extends DBSchema {
    chats: {
        value: {
            name: string;
            phone: string;
        };
        key: string;
        indexes: { 
            'by-phone': string
        };
    };
    session: {
        value: {
            phone: string;
            session_id: string;
            token: string;
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
        db.put('chats', chat, chat.phone)
    }

    async getSesion() {
        if (this.db == null) return
        const db = await this.db
        return db.get('session', 'sesion')
    }

    async setSesion(sesion: MyDB['sesion']['value']) {
        if (this.db == null) return
        const db = await this.db
        try {
            await db.add('session', sesion, 'sesion')
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
// const sldb = new LocalDB(null)

// export function useLocalBD() {
//     const u = useSyncExternalStore(
//         () => () => { },
//         () => ldb.db ? ldb : ldb.setDB(openDB<MyDB>('rchat', 0.1, {
//             upgrade: (db) => {
//                 const ch = db.createObjectStore('chats', {
//                     keyPath: 'id',
//                     autoIncrement: true,
//                 })
//                 ch.createIndex('by-phone', 'phone', {
//                     unique: true
//                 })

//                 db.createObjectStore('sesion')
//                 db.createObjectStore('info')
//             }
//         })
//         ),
//         () => sldb
//     )
//     return u
// }

export function useDB() {
    return ldb.db ? ldb : ldb.setDB(openDB<MyDB>('rchat', 2, {
        upgrade: (db) => {
            db.createObjectStore('chats', {
                keyPath: 'id',
                autoIncrement: true,
            }).createIndex('by-phone', 'phone', {
                unique: true
            })

            db.createObjectStore('session')
            db.createObjectStore('info')
        }
    }))
}