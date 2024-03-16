'use client'

import { createClient } from '@/hooks/supabase/client'
import { useLocalBD } from '@/hooks/useDB'
import { useName } from '@/hooks/globalStates'
import { useEffect } from 'react'
import { useCookies } from 'react-cookie'
import { useRouter } from 'next/navigation'
import { eventNames } from '@/lib/constants'

export function EventHandler() {
    const {name, setName} = useName()
    const db = useLocalBD()
    const supabase = createClient()
    const router = useRouter()
    const [cookies, setCookie, removeCookie] = useCookies(['user_phone', 'session_id'])
    useEffect(() => {
        let to = setTimeout(() => null, 60_000 * 3)
        const event = async (text: string) => {
            let ev: {name:string, value:any}
            try {
                ev = JSON.parse(text)
            } catch {
                return
            }
            console.log(ev)
            if (ev.name === eventNames.infoRequest) {
                fetch('/api', {method: 'POST',body:JSON.stringify({name:eventNames.infoResponse, value: { name:name, to: ev.value.from }})})
            } else if (ev.name === eventNames.infoResponse) {
                setName(ev.value.name)
            }
        }
        (async () => {
            // handshake
            if (!db.isBrowser()) return
            const s = await db.getSesion()
            let session_id = cookies.session_id||s?.session_id
            let user_phone = cookies.user_phone||s?.user_phone
            console.log('session_id', session_id, 'user_phone', user_phone)
            if (!session_id || !user_phone) return router.push('/login')
            setCookie('user_phone', user_phone)
            setCookie('session_id', session_id)
            db.setSesion({
                session_id,
                user_phone
            })
            fetch('/api', {method: 'POST', body: JSON.stringify({name:eventNames.infoRequest,value:session_id})}).then(r=>r.json() as Promise<{requested:string}>).then(r=>{
                if (r.requested) to = setTimeout(()=>{
                    fetch('/api', {method: 'POST',body:JSON.stringify({name:eventNames.deleteRequest, value: r.requested})})
                },60_000*3)
            })
            fetch('/api')
                .then(async r => {
                    if (r.status !== 200) return alert('unable to connect to server')
                    const reader = r.body!.getReader()
                    const decoder = new TextDecoder()
                    while (true) {
                        const { done, value } = await reader.read()
                        if (done) break
                        event(decoder.decode(value))
                    }
                })
        })()
        return () => {
            clearTimeout(to)
            fetch('/api', { method: 'DELETE' }) 
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [db])
    return <></>
}