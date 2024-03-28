export const eventNames = {
    changeName: 'change_name',
    getName: 'get_name',
    infoRequest: 'info_request',
    deleteRequest: 'delete_request',
    infoResponse: 'info_response',
    sendMessage: 'send_message'
} as const

export type events = {
    [eventNames.changeName]: string
    [eventNames.getName]: null
    [eventNames.infoRequest]: { from: string },
    [eventNames.deleteRequest]: string,
    [eventNames.infoResponse]: { name: string, user_phone: string }
}

export const JWT_SECRET = new TextEncoder().encode(process.env.NEXT_JWT_SECRET!)
