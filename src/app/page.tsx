import Chat from '@/components/chat'
import Chats from '@/components/chats'
import Name from '@/components/name'
import { useSupabase } from '@/hooks/supabase/server'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export default async function Home() {
    const supabase = useSupabase(cookies())
    await supabase.auth.initialize()    
    const s = await supabase.auth.getSession()
    // const u = await supabase.auth.getUser()
    // console.log('session s', s, u)
    if (!s.data?.session) return redirect('/login')
    return (
        <>
            <div className="flex min-h-screen max-[1152px]:px-16 max-[768px]:px-0 px-64">
                <aside className="w-64">
                    <section className="p-4 bg-slate-950">
                        <Name />
                    </section>
                    <Chats/>
                </aside>
                <Chat />
            </div>    
        </>
    )
}
