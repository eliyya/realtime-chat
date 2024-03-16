'use client'

import { createClient } from '@/hooks/supabase/client'
import { useLocalBD } from '@/hooks/useDB'
import { useName } from '@/hooks/useSelectedChat'
import { useEffect } from 'react'

export default function Name() {
    const {name, setName} = useName()
    const db = useLocalBD()
    const supabase = createClient()
    
    
    useEffect(() => {
        const getName = async () => {
            const session = await db.getSesion()
            if (session) {
                setName(session.name)
            }
        }
        getName()
        const st = async () => {
            const user = await supabase.auth.getUser()
            const user_id = user?.data.user?.id
            fetch('/api', {
                headers: {
                    user_id: user_id!
                }
            }).then(r => {
                // stream
                const reader = r.body!.getReader()
                const decoder = new TextDecoder()
                const read = async () => {
                    const { done, value } = await reader.read()
                    if (done) {
                        return
                    }
                    console.log(decoder.decode(value))
                    read()
                }
                read()
            })
        }
    }, [db, setName, supabase.auth])
    return <h1>{name}</h1>
}