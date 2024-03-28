export const EVENT_NAMES = {
    changeName: 'change_name',
    getName: 'get_name',
    infoRequest: 'info_request',
    deleteRequest: 'delete_request',
    infoResponse: 'info_response',
    sendMessage: 'send_message'
} as const

export type events = {
    [EVENT_NAMES.changeName]: string
    [EVENT_NAMES.getName]: null
    [EVENT_NAMES.infoRequest]: { from: string },
    [EVENT_NAMES.deleteRequest]: string,
    [EVENT_NAMES.infoResponse]: { name: string, user_phone: string }
}

export const JWT_SECRET = new TextEncoder().encode(process.env.NEXT_JWT_SECRET!)
