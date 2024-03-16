'use client'
import {useSelectedChat} from '@/hooks/useSelectedChat'
import {  } from '@/hooks/useDB'

export default function Chat() {
    const {selectedChat, setSelectedChat} = useSelectedChat()
    // const db = useLocalDB()
    const createChat = async () => {
        // await db.addChat({name: 'chat2'})
    }
    return (<main className="text-center flex-grow flex flex-col justify-between border">
        <button onClick={createChat}>create</button>
        <span>
            {
                selectedChat < 0 
                    ? 'select a chat to open it'
                    : `chat opened ${selectedChat}`
            }
        </span>
        <span>c</span>
    </main>)
}