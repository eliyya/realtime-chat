import MainView from '@/components/MainView'
import Chats from '@/components/Chats'
import Name from '@/components/Name'
import { EventHandler } from './EventHandler'
import { AddFriendButton } from '@/components/AddFriendButton'

export default async function Home() {
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
                        <AddFriendButton />
                    </section>
                </aside>
                <main className="text-center flex-grow flex flex-col justify-between border">
                    <MainView />
                </main>
            </div>    
            <EventHandler />
        </>
    )
}
