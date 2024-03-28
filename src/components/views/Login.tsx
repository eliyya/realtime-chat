'use client'

import { View, useSelectedView, useSession } from '@/hooks/globalStates'
import { useDB } from '@/hooks/useDB'
import { FormEventHandler, useState } from 'react'

type props = {
    handlerLogin: (props:{phone:string}) => Promise<{
        error?:string
        phone:string
    }>
    verifyCode: (props:{phone:string, code:string}) => Promise<{
        error?:string
        phone:string
        token?:string
        session_id?:string
    }>
}

export function Login({ handlerLogin, verifyCode }: props) {
    const [ph, setPh] = useState('')
    const {setSession} = useSession()
    const db = useDB()
    const { setSelectedView} = useSelectedView()

    const login: FormEventHandler<HTMLFormElement> = async (e) => {
        e.preventDefault()
        
        const form = new FormData(e.currentTarget)
        const phone = form.get('phone') as string | null
        const code = form.get('code') as string | null
        
        if (phone) {
            const r = await handlerLogin({phone})
            if (r.error) return alert(r.error)
            e.currentTarget.querySelector<HTMLInputElement>('input[name="phone"]')?.setAttribute('value', '')
            setPh(phone)
        } else if (code) {
            const {phone,error,session_id,token} = await verifyCode({phone: ph, code})
            if (error) {
                alert(error)
                return setPh('')
            }
            if (!session_id || !token) return alert('unable to login')
            setPh('')
            db.setSesion({token, session_id, phone})
            setSession({token, session_id, phone})
            setSelectedView(View.chat)
        }
    }

    return (
        <>
            <span>Login</span>
            <form onSubmit={login} className='flex flex-col p-4' >
                {!ph ? <>
                    <label>Number Phone</label>
                    <input 
                        className='border rounded-md p-1 w-full bg-transparent'
                        type="text" 
                        name='phone' 
                        pattern='^\+52\d{10}' 
                        required 
                    />
                </> : <>
                    <label>SMS Code</label>
                    <input 
                        className='border rounded-md p-1 w-full bg-transparent'
                        type="text" 
                        name='code' 
                        required 
                    />
                </>}
                <input type="submit" />
            </form>
            <span></span>
        </>
    )
}