'use client'

import { useLocalBD } from '@/hooks/useDB'
import { FormEventHandler, useEffect, useState } from 'react'

export default function Login() {
    const db = useLocalBD()
    const [sesion, setSesion] = useState<Awaited<ReturnType<typeof db.getSesion>>|null>(null)
    useEffect(()=>{
        const getSesion = async () => {
            const sesion = await db.getSesion()
            if (sesion) setSesion(sesion)
        }
        getSesion()
    },[db])

    const submit: FormEventHandler<HTMLFormElement> = async (e) => {
        e.preventDefault()
        const req = await fetch('/api', {
            method: 'POST',
            body: new FormData(e.currentTarget)
        })
        const res = await req.text()
        console.log(res)
        
    }
    
    return (
        <form
            onSubmit={submit}
            className={`flex flex-col gap-4 p-4 justify-end items-center absolute top-1/2 left-1/2 min-w-10 min-h-10 bg-slate-800 ${sesion?'hidden':''}`}>
            <label>Login</label>
            <div>
                <label className='flex flex-col'>email</label>
                <input type="email" name='email' />
            </div>
            <input type="submit" value="submit" />
        </form>
    )
}