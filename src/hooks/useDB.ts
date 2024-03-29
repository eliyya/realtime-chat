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
    sessions: {
        value: {
            phone: string;
            session_id: string;
            platform: string;
            token?: string;
        };
        key: string;
        indexes: {
            'by-session': string,
            'by-token': string
        }
    };
    info: {
        value: {
            name: string;
            user_phone: string;
        };
        key: string;
    },
    messages_to_send: {
        value: {
            message: string;
            to: string;
            id: string;
            created_at: number;
        };
        key: string;
        indexes: {
            'by-to': string
            'by-id': string
        }
    }
    messages: {
        value: {
            message: string;
            from: string;
            to: string;
            id: string;
            created_at: number;
        };
        key: string;
        indexes: {
            'by-to': string
            'by-id': string
        }
    }
}

const pdb = openDB<RTCSchemma>('rchat', 2, {
    upgrade: (db) => {        
        db.createObjectStore('chats', {
            keyPath: 'phone',
        }).createIndex('by-phone', 'phone', {
            unique: true
        })

        const s = db.createObjectStore('sessions', {
            keyPath: 'session_id'
        })
        s.createIndex('by-session', 'session_id', {
            unique: true
        })
        s.createIndex('by-token', 'token', {
            unique: true
        })

        db.createObjectStore('info')

        const mts = db.createObjectStore('messages_to_send', {
            keyPath: 'id'
        })
        mts.createIndex('by-to', 'to', {
            unique: false
        })
        mts.createIndex('by-id', 'id', {
            unique: true
        })

        const ms = db.createObjectStore('messages', {
            keyPath: 'id'
        })
        ms.createIndex('by-to', 'to', {
            unique: false
        })
        ms.createIndex('by-id', 'id', {
            unique: true
        })
    },
})

type useDBType = {
    db: Awaited<Promise<IDBPDatabase<RTCSchemma>>> | undefined

    session: RTCSchemma['sessions']['value'] | undefined
    sessions: RTCSchemma['sessions']['value'][]
    setSession: (session: RTCSchemma['sessions']['value']) => RTCSchemma['sessions']['value']
    deleteSesion: () => void
    addSession: (session: RTCSchemma['sessions']['value']) => RTCSchemma['sessions']['value']
    removeSession: (id: string) => void

    info: RTCSchemma['info']['value'] | undefined
    setInfo: (info: RTCSchemma['info']['value']) => RTCSchemma['info']['value']
    deleteInfo: () => void

    chats: RTCSchemma['chats']['value'][]
    addChat: (chat: RTCSchemma['chats']['value']) => RTCSchemma['chats']['value']
    deleteChat: (phone: string) => void

    messagesToSend: RTCSchemma['messages_to_send']['value'][]
    addMessageToSend: (message: RTCSchemma['messages_to_send']['value']) => RTCSchemma['messages_to_send']['value']
    removeMessageToSend: (id: string) => void

    messages: RTCSchemma['messages']['value'][]
    addMessage: (message: RTCSchemma['messages']['value']) => RTCSchemma['messages']['value']
    deleteMessage: (id: string) => void
}

export const useDB = create<useDBType>((set,use) => {
    pdb.then(async db => {
        set({db})
        const sessions = await db.getAll('sessions')
        set({sessions})
        const session = sessions.find(s => s.token)
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

        const messagesToSend = await db.getAll('messages_to_send')
        set({messagesToSend})

        const messages = await db.getAll('messages')
        set({messages})
    })
    
    return {
        db: undefined,
        
        session: undefined,
        sessions: [],
        setSession(session) {
            const { db, sessions } = use()
            set({session, sessions: [...sessions.filter(s=>!s.token), session]})
            try {
                db?.put('sessions', session)
            } catch {}
            return session
        },
        deleteSesion() {
            const { db } = use()
            set({session: undefined, chats: [], messages: [], messagesToSend: [], sessions: []})
            const toDel = ['sessions', 'info', 'chats', 'messages_to_send', 'messages'] as const
            for (const store of toDel) {
                try {
                    db?.clear(store)
                } catch {}
            }
        },
        addSession(session) {
            const { db, sessions } = use()
            if (session.token) {
                set({sessions: [...sessions.filter(s => !s.token), session]})
                set({session})
            } else {
                set({sessions: [...sessions.filter(s => s.session_id !== session.session_id), session]})
            }
            try {
                db?.put('sessions', session)
            } catch {}
            return session
        },
        removeSession(id) {
            const { db, sessions, session } = use()
            set({sessions: sessions.filter(s => s.session_id !== id)})
            if (session?.session_id === id) set({session: undefined})
            try {
                db?.delete('sessions', id)
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
        addChat(chat) {
            const {chats, db} = use()
            set({chats: [...chats, chat]})
            try {
                db?.add('chats', chat)
            } catch {}
            return chat
        },
        deleteChat(phone) {
            const {chats, db} = use()
            set({chats: chats.filter(c => c.phone !== phone)})
            try {
                db?.delete('chats', phone)
            } catch {}
        },

        messagesToSend: [],
        addMessageToSend(message) {
            const {messagesToSend, db} = use()
            set({messagesToSend: [...messagesToSend, message]})
            try {
                db?.add('messages_to_send', message)
            } catch {}
            return message
        },
        removeMessageToSend(id) {
            const {messagesToSend, db} = use()
            set({messagesToSend: messagesToSend.filter(m => m.id !== id)})
            try {
                db?.delete('messages_to_send', id)
            } catch {}
        },

        messages: [],
        addMessage(message) {
            const {messages, db} = use()
            set({messages: [...messages, message]})
            try {
                db?.add('messages', message)
            } catch {}
            return message
        },
        deleteMessage(id) {
            const {messages, db} = use()
            set({messages: messages.filter(m => m.id !== id)})
            try {
                db?.delete('messages', id)
            } catch {}
        }
    }
})
