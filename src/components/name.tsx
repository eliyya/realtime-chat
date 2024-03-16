'use client'

import { useLocalBD } from '@/hooks/useDB'
import { useName } from '@/hooks/globalStates'
import { useEffect } from 'react'

export default function Name() {
    const {name, setName} = useName()
    const db = useLocalBD()
    
    useEffect(() => {
        const getName = async () => {
            if (!db.isBrowser()) return
            const session = await db.getInfo()
            if (session) setName(session.name)
        }
        getName()
    }, [db, setName])
    
    return <h1>{name}</h1>
}