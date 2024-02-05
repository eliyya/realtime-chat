import Login from '@/components/Login'
import Chat from '@/components/chat'
import Chats from '@/components/chats'
import Name from '@/components/name'

export default function Home() {
    return (
        <>
            <Login/>
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
