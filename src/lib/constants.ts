export const JWT_SECRET = new TextEncoder().encode(process.env.NEXT_JWT_SECRET!)

export enum CookieName {
    UserPhone = 'user_phone',
    SessionId = 'session_id',
    Session = 'session',
}

export enum ClientEventName {
    NewConnection,
    DuplicateConnection,
}

export enum View {
    Login,
    Chat,
    AddFriend,
    DuplicateConnection,
    Settings,
}

export type ClientEvent = {
    event: ClientEventName.NewConnection
    data: {session_id: string; platform: string}
} | {
    event: ClientEventName.DuplicateConnection
    data: {phone: string; session_id: string}
}

export enum FormatColors {
    Reset = '\x1b[0m',
    Bright = '\x1b[1m',
    Dim = '\x1b[2m',
    Underscore = '\x1b[4m',
    Blink = '\x1b[5m',
    Reverse = '\x1b[7m',
    Hidden = '\x1b[8m',
}

export enum BackgroundColors {
    BgBlack = '\x1b[40m',
    BgRed = '\x1b[41m',
    BgGreen = '\x1b[42m',
    BgYellow = '\x1b[43m',
    BgBlue = '\x1b[44m',
    BgMagenta = '\x1b[45m',
    BgCyan = '\x1b[46m',
    BgWhite = '\x1b[47m',
    BgGray = '\x1b[100m'
}


export enum ForegroundColors {
    Black = '\x1b[30m',
    Red = '\x1b[31m',
    Green = '\x1b[32m',
    Yellow = '\x1b[33m',
    Blue = '\x1b[34m',
    Magenta = '\x1b[35m',
    Cyan = '\x1b[36m',
    White = '\x1b[37m',
    Gray = '\x1b[90m',
}