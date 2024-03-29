import { DBSchema, IDBPDatabase, openDB } from 'idb'
import { create } from 'zustand'

export interface RTCSchemma extends DBSchema {
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

const pdb = openDB<RTCSchemma>('rchat', 2, {
    upgrade: (db) => {
        db.createObjectStore('chats', {
            keyPath: 'phone',
        }).createIndex('by-phone', 'phone', {
            unique: true
        })

        db.createObjectStore('session')
        db.createObjectStore('info')
    }
})

type useDBType = {
    db: Awaited<Promise<IDBPDatabase<RTCSchemma>>> | undefined

    session: RTCSchemma['session']['value'] | undefined
    setSession: (session: RTCSchemma['session']['value']) => RTCSchemma['session']['value']
    deleteSesion: () => void

    info: RTCSchemma['info']['value'] | undefined
    setInfo: (info: RTCSchemma['info']['value']) => RTCSchemma['info']['value']
    deleteInfo: () => void

    chats: RTCSchemma['chats']['value'][]
    addChat: (chat: RTCSchemma['chats']['value']) => RTCSchemma['chats']['value']
    deleteChat: (phone: string) => void
}

export const useDB = create<useDBType>((set,use) => {
    pdb.then(async db => {
        set({db})
        const session = await db.get('session', 'sesion')
        set({session})
        const info = await db.get('info', 'info')
        set({info})

        const chats = await db.getAll('chats')   
        if (session?.token && !chats?.some(c => c.phone === session.phone)) {
            set({chats: [{
                name: 'Chat With You',
                phone: session.phone
            }]}) 
            db.add('chats', {
                name: 'Chat With You',
                phone: session.phone
            })
        }
        else set({chats})
    })
    
    return {
        db: undefined,
        
        session: undefined,
        setSession(session: RTCSchemma['session']['value']) {
            set({session})
            const {db} = use()
            try {
                db?.put('session', session, 'sesion')
            } catch {}
            return session
        },
        deleteSesion() {
            set({session: undefined})
            const {db} = use()
            try {
                db?.delete('session', 'sesion')
            } catch {}
            try {
                db?.delete('info', 'info')
            } catch {}
            try {
                db?.clear('chats')
            } catch {}
        },

        info: undefined,
        setInfo(info: RTCSchemma['info']['value']) {
            set({info})
            const {db} = use()
            try {
                db?.put('info', info, 'info')
            } catch {}
            return info
        },
        deleteInfo() {
            set({info: undefined})
            const {db} = use()
            try {
                db?.delete('info', 'info')
            } catch {}
        },

        chats: [],
        addChat(chat: RTCSchemma['chats']['value']) {
            const {chats, db} = use()
            set({chats: [...chats, chat]})
            try {
                db?.add('chats', chat)
            } catch {}
            return chat
        },
        deleteChat(phone: string) {
            const {chats, db} = use()
            set({chats: chats.filter(c => c.phone !== phone)})
            try {
                db?.delete('chats', phone)
            } catch {}
        }
    }
})
