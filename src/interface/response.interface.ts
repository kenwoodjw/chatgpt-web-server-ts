

export interface Response {

}

export interface ChatContext {
    conversationId?: string
    parentMessageId?: string
}



export interface RequestProps {
    prompt: string
    options?: ChatContext
    systemMessage: string
    temperature?: number
    top_p?: number
}