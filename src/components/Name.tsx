'use client'

import { useSelectedView } from '@/hooks/globalStates'
import { useDB } from '@/hooks/useDB'
import { View } from '@/lib/constants'

export default function Name() {
    const { info } = useDB()
    const { setSelectedView } = useSelectedView()

    return <h1 className='cursor-pointer' onClick={() => setSelectedView(View.Settings)} >{info?.name ?? 'Your Name'}</h1>
}