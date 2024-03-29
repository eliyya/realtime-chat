'use client'

import { create } from 'zustand'
import { RTCSchemma } from './useDB'
import { View } from '@/lib/constants'

export const useSelectedView = create<{
    selectedChat: RTCSchemma['chats']['value'] | undefined
    selectedView: View
    setSelectedChat: (value: RTCSchemma['chats']['value']) => void
    setSelectedView: (value: View) => void
}>((set) => {
            return {
                selectedChat: undefined,
                setSelectedChat: (selectedChat) => set({ selectedChat }),
                selectedView: View.Chat,
                setSelectedView: (selectedView) => set({ selectedView }),
            }
        })