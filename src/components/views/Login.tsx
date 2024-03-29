'use client'

import { useSelectedView } from '@/hooks/globalStates'
import { useDB } from '@/hooks/useDB'
import { View } from '@/lib/constants'
import { sendCode, verifyCode } from '@/server/auth'
import { FormEventHandler, useState } from 'react'

export function Login() {
    const [phone, setPhone] = useState('')
    const [code, setCode] = useState('')
    const [step, setStep] = useState(0)
    const { setSession } = useDB()
    const { setSelectedView} = useSelectedView()

    const login: FormEventHandler<HTMLFormElement> = async (e) => {
        e.preventDefault() 
        
        if (!step) {
            const r = await sendCode({phone})
            if (r.error) return alert(r.error)
            return setStep(1)
        }
        
        const {error,session_id,token} = await verifyCode({phone, code})
        if (error) {
            alert(error)
            setCode('')
            return setStep(0)
        }
        if (!session_id || !token) {
            alert('unable to login')
            setCode('')
            return setStep(0)
        }
        setSession({token, session_id, phone})
        setSelectedView(View.Chat)
    }

    return (
        <>
            <span>Login</span>
            <form onSubmit={login} className='flex flex-col p-4' >
                {!step ? <>
                    <label>Number Phone</label>
                    <input 
                        className='border rounded-md p-1 w-full bg-transparent'
                        type="text" 
                        name='phone' 
                        pattern='^\+52\d{10}' 
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        required 
                    />
                </> : <>
                    <label>SMS Code</label>
                    <input 
                        className='border rounded-md p-1 w-full bg-transparent'
                        type="text" 
                        name='code' 
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        required 
                    />
                </>}
                <input type="submit" />
            </form>
            <span></span>
        </>
    )
}