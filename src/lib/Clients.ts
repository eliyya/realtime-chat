import { randomUUID } from 'crypto'
import { EventEmitter } from 'stream'
import { ClientEventName, ForegroundColors, FormatColors } from './constants'

export const clients = new Map<string, Client>()

export class Client {
    #emitter = new EventEmitter()
    #platform = 'unknown'
    sessions: {
        session_id: string;
        id: string;
    }[] = []

    #phone: string

    constructor(phone: string, platform?: string) {
        this.#phone = phone
        this.#platform = platform??'unknown'
    }

    get phone() {
        return this.#phone
    }

    get emitter() {
        return this.#emitter
    }

    get platform() {
        return this.#platform
    }
    
    addSession(session_id: string) {
        const b = this.sessions.find(s => s.session_id === session_id)
        if (b) {
            this.#emitter.emit(`${session_id}+${b.id}+delete`)
        }
        const id = randomUUID()
        this.sessions = this.sessions.filter(s => s.session_id !== session_id)
        this.sessions.push({ session_id, id })
        for (const session of this.sessions) {
            this.#emitter.emit(`${session.session_id}+${session.id}`, ClientEventName.NewConnection, {session_id, platform: this.#platform})
        }
        return id
    }

    sendMessage(body: {
        message: string;
        to: string;
        id: string;
        created_at: number;
        from: string
    }) {
        for (const session of this.sessions) {
            this.#emitter.emit(`${session.session_id}+${session.id}`, ClientEventName.NewMessage, body)
        }
    }

    removeSession(session_id: string, id: string) {
        this.emitter.removeAllListeners(`${session_id}+${id}`)
        this.sessions = this.sessions.filter(s => s.session_id !== session_id)
        if (!this.sessions.length) clients.delete(this.phone)
        console.log(ForegroundColors.Blue, 'Disconnected', FormatColors.Reset, this.phone, session_id, 'events:', this.emitter.listeners(`${session_id}+${id}`).length)
    }

}