import MainView from '@/components/MainView'
import Chats from '@/components/chats'
import Name from '@/components/Name'
import { EventHandler } from './EventHandler'
import { NewChat } from '@/components/NewChat'
import { CookieOptions, createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { randomUUID } from 'crypto'
import { SignJWT } from 'jose'
import { JWT_SECRET } from '@/lib/constants'

export default async function Home() {
    async function handlerLogin({phone}:{phone:string}) {
        'use server'

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
    async function verifyCode({phone, code}:{phone:string, code:string}) {
        'use server'

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
    return (
        <>
            <div className="flex min-h-screen max-[1152px]:px-16 max-[768px]:px-0 px-64">
                <aside className="w-64 flex flex-col">
                    <section className="p-4 bg-slate-950">
                        <Name />
                    </section>
                    <section className='flex-1 flex flex-col'>
                        <div className='flex-1'>
                            <Chats/>
                        </div>
                        <NewChat />
                    </section>
                </aside>
                <MainView handlerLogin={handlerLogin} verifyCode={verifyCode} />
            </div>    
            <EventHandler />
        </>
    )
}
