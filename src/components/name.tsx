'use client'

import { useLocalBD } from '@/hooks/useDB'
import { useEffect, useState } from 'react'

export default function Name() {
    const [name, setName] = useState('your name')
    const db = useLocalBD()
    
    useEffect(() => {
        const getName = async () => {
            const session = await db.getSesion()
            if (session) {
                setName(session.name)
            }
        }
        getName()
    }, [db])
    return <h1>{name}</h1>
}