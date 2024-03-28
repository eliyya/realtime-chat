'use server'

import { JWT_SECRET } from '@/lib/constants'
import { CookieOptions, createServerClient } from '@supabase/ssr'
import { randomUUID } from 'crypto'
import { SignJWT } from 'jose'
import { cookies } from 'next/headers'

export async function sendCode({phone}:{phone:string}) {
    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                get: (name: string) => cookies().get(name)?.value,
                set: (name: string, value: string, options: CookieOptions) => void cookies().set({ name, value, ...options }),
                remove: (name: string, options: CookieOptions) => void cookies().set({ name, value: '', ...options }),
            },
        },
    )
    
    if (!phone) return {
        error: 'need phone',
        phone: ''
    }

    const {error} = await supabase.auth.signInWithOtp({phone})
    if (error) {
        return {
            error: `${error}`,
            phone: ''
        }
    }
    return { phone }
}

export async function verifyCode({phone, code}:{phone:string, code:string}) {
    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                get: (name: string) => cookies().get(name)?.value,
                set: (name: string, value: string, options: CookieOptions) => void cookies().set({ name, value, ...options }),
                remove: (name: string, options: CookieOptions) => void cookies().set({ name, value: '', ...options }),
            },
        },
    )
    const x = await supabase.auth.verifyOtp({phone, token:code, type:'sms'})
    if (x?.error) {
        return {
            error: x.error.message,
            phone
        }
    }
    const session_id = randomUUID()
    cookies().set('user_phone', phone)
    cookies().set('session_id', session_id)
    const token = await new SignJWT({phone, session_id}).setProtectedHeader({ alg: 'HS256' }).sign(JWT_SECRET)
    cookies().set('session', token)

    return {
        phone,
        token,
        session_id
    }
}