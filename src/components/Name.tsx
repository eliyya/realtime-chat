'use client'

import { useName } from '@/hooks/globalStates'

export default function Name() {
    const { name } = useName()
    
    return <h1>{name}</h1>
}