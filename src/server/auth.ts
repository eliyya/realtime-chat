'use server'

import { JWT_SECRET } from '@/lib/constants'
import { CookieOptions, createServerClient } from '@supabase/ssr'
import { randomUUID } from 'crypto'
import { SignJWT, jwtVerify } from 'jose'
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
    const token = await new SignJWT({phone, session_id}).setProtectedHeader({ alg: 'HS256' }).sign(JWT_SECRET)

    return {
        phone,
        token,
        session_id
    }
}

export async function getSessionPayload(token: string) {
    try {
        const {payload} = await jwtVerify<{
            phone: string
            session_id: string
        }>(token, JWT_SECRET)
        return payload
    } catch (error) {
        if (error instanceof Error && (
            error.message.includes('JWS Protected Header is invalid') ||
            error.message.includes('signature verification failed') ||
            error.message.includes('timestamp check failed')
        )) {
            throw new Error('Invalid token', {cause: error.message})
        } else {
            throw error
        }
    }
}

export async function getSession(token: string) {
    try {
        const {phone, session_id} = await getSessionPayload(token)
        return {phone, session_id}
    } catch (error) {
        return null
    }
}