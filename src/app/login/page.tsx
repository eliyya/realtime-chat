
import { cookies } from 'next/headers'
import SubmitButton from './SubmitButton'
import { createServerClient, CookieOptions } from '@supabase/ssr'
import { redirect } from 'next/navigation'
import { randomUUID } from 'crypto'


export default async function Login() {
    'use server'
    
    const us_ph = cookies().get('user_phone')
    const se_id = cookies().get('session_id')    
    if (us_ph && se_id) redirect('/')
    
    async function handler({phone}:{phone:string}) {
        'use server'
        const supabase = createServerClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            {
                cookies: {
                    get(name: string) {
                        return cookies().get(name)?.value
                    },
                    set(name: string, value: string, options: CookieOptions) {
                        try {
                            cookies().set({ name, value, ...options })
                        } catch {}
                    },
                    remove(name: string, options: CookieOptions) {
                        try {
                            cookies().set({ name, value: '', ...options })
                        } catch {}
                    },
                },
            },
        )
        console.log({phone})
        if (!phone) return {
            error: 'need phone',
            phone: ''
        }

        const x = await supabase.auth.signInWithOtp({phone})
        if (x.error) {
            console.log('error logn', x.error)
            
            return {
                error: `${x.error}`,
                phone: ''
            }
        }
        return {
            phone
        }
    }

    async function verify({phone, code}:{phone:string, code:string}) {
        'use server'

        const supabase = createServerClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            {
                cookies: {
                    get(name: string) {
                        return cookies().get(name)?.value
                    },
                    set(name: string, value: string, options: CookieOptions) {
                        try {
                            cookies().set({ name, value, ...options })
                        } catch {}
                    },
                    remove(name: string, options: CookieOptions) {
                        try {
                            cookies().set({ name, value: '', ...options })
                        } catch {}
                    },
                },
            },
        )
        const x = await supabase.auth.verifyOtp({phone, token:code, type:'sms'})
        if (x?.error) {
            console.log('error verify', x.error)
            return {
                error: x.error.message
            }
        }
        const session_id = randomUUID()
        cookies().set('user_phone', phone)
        cookies().set('session_id', session_id)
        console.log('verify', x, {phone, session_id})
        redirect('/')
    }
    return (
        <main className="flex h-screen w-screen justify-center items-center">
            <SubmitButton hadler={handler} verify={verify} />
        </main>
    )
}

