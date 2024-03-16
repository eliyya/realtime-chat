'use client'

import { useState } from 'react'

export function SubmitButton(props: {hadler: ({phone}: {phone:string}) => Promise<{error?: string, phone: string}>, verify: ({phone, code}:{phone:string, code:string}) => Promise<{error:string}>}) {
    const [error, setError] = useState('')
    const [phone, setPhone] = useState('')
    return (
        <form>
            <h1>Login</h1>
            {(error && !phone) && <label>{error}</label>}
            {phone && <label>Se te ha enviado un codigo al telefono {phone}</label>}
            {phone 
                ? (
                    <div>
                        <label className='flex flex-col'>code</label>
                        <input type="text" name='phone' className='text-black' />
                    </div>
                )
                : (
                    <div>
                        <label className='flex flex-col'>phone</label>
                        <input type="text" name='phone' className='text-black' />
                    </div>
                )}
            <input type="submit" value="submit" onClick={async e => {
                e.preventDefault()
                const form = new FormData(e.currentTarget.parentElement as HTMLFormElement)
                if (phone) {
                    const x = await props.verify({phone, code: form.get('phone') as string})   
                    if (x.error) return setError(x.error)    
                } else {
                    const x = await props.hadler({phone: form.get('phone') as string})   
                    if (x.error) return setError(x.error)   
                    setPhone(x.phone)            
                }
            }}/>
        </form>
    )
}
export default SubmitButton