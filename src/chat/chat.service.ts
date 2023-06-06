import {Injectable, Logger, OnModuleInit, Req, Res} from '@nestjs/common';
import {RequestProps} from "../interface/response.interface";
import {Request, Response} from "express";
import {UserService} from "../user/user.service";
import {StatService} from "../stat/stat.service";
import {isNotEmptyString} from "../util/is";
import {sendResponse} from "../util";
import {ApiModel} from "./types";



const delay = (ms: number) => new Promise(res => setTimeout(res, ms));
export const importDynamic = new Function('modulePath', 'return import(modulePath)');


@Injectable()
export class ChatService implements OnModuleInit {

    gptApi: any;
    ChatMessage:any;
    ChatGPTAPIOptions:any;
    SendMessageOptions:any;
    timeoutMs: number = !isNaN(+process.env.TIMEOUT_MS) ? +process.env.TIMEOUT_MS : 100 * 1000;
    apiModel: ApiModel = 'ChatGPTAPI';
    model = isNotEmptyString(process.env.OPENAI_API_MODEL) ? process.env.OPENAI_API_MODEL : 'gpt-3.5-turbo';

    private readonly logger = new Logger(ChatService.name);
    constructor(private userService: UserService,private statService: StatService) {

    }

    async onModuleInit() {
        await this.initGPT();
    }
    async initGPT() {
        const { ChatGPTAPI,ChatMessage,ChatGPTAPIOptions,SendMessageOptions } = await importDynamic('chatgpt');
        this.ChatMessage = typeof ChatMessage;
        this.ChatGPTAPIOptions = typeof ChatGPTAPIOptions;
        this.SendMessageOptions = typeof SendMessageOptions;
        this.ChatMessage = typeof ChatMessage

        const disableDebug: boolean = process.env.OPENAI_API_DISABLE_DEBUG === 'true'
        const model = isNotEmptyString(process.env.OPENAI_API_MODEL) ? process.env.OPENAI_API_MODEL : 'gpt-3.5-turbo'

        const options: typeof ChatGPTAPIOptions = {
            apiKey: process.env.OPENAI_API_KEY,
            completionParams: { model },
            debug: !disableDebug,
        }

        if (!process.env.OPENAI_API_KEY) {
            throw new Error("OPENAI_API_KEY missing");
        }

        const OPENAI_API_BASE_URL = process.env.OPENAI_API_BASE_URL
        if (isNotEmptyString(OPENAI_API_BASE_URL))
            options.apiBaseUrl = `${OPENAI_API_BASE_URL}/v1`

        try {
            this.logger.log('Creating ChatGPT Api')
            this.gptApi = new ChatGPTAPI({ ...options })

            this.logger.log('Sending test message');

            const result = await this.sendMessage('Hello World!')
            console.log(`${result?.text} from ${result?.id}`);

        }
        catch (e) {
            console.log(e);
        }

    }

    async send(@Req() req: Request,@Res() res:Response){
        res.setHeader('Content-type', 'application/octet-stream')
        try {
            const email = req["userInfo"].email
            //查询用户等级
            const user =  await this.userService.findUserByName(email)
            //查询用户今日查询次数
            let count =  await this.statService.getQueryCount(email)
            console.log(count)
            if(user.level === 1 && count >= 10){
                await Promise.reject({
                    message: "今日可提问次数已达上限,请明日再来思密达" ?? 'Failed',
                    data: null,
                    status: 'Failed',
                })
            }

            const {prompt, options = {}, systemMessage, temperature, top_p} = req.body as RequestProps
            let firstChunk = true

            /*await this.chatReplyProcess({
                message: prompt,
                lastContext: options,
                process: (chat: typeof this.ChatMessage) => {
                    res.write(firstChunk ? JSON.stringify(chat) : `\n${JSON.stringify(chat)}`)
                    firstChunk = false
                },
                systemMessage,
                temperature,
                top_p,
            })*/
            const lastContext = options;
            const message = prompt;
            const process = (chat: typeof this.ChatMessage) => {
                res.write(firstChunk ? JSON.stringify(chat) : `\n${JSON.stringify(chat)}`)
                firstChunk = false
            }

            //const { message, lastContext, process, systemMessage, temperature, top_p } = paraObj
            try {
                let options: typeof this.SendMessageOptions = { timeoutMs:this.timeoutMs }

                if (isNotEmptyString(systemMessage))
                    options.systemMessage = systemMessage

                options.completionParams = {
                    model: this.model,
                    temperature:temperature,
                    top_p:top_p }

                if (lastContext != null) {
                    options.parentMessageId = lastContext.parentMessageId
                }

                const response = await this.gptApi.sendMessage(message, {
                    ...options,
                    onProgress: (partialResponse) => {
                        process?.(partialResponse)
                    },
                })

                return sendResponse({ type: 'Success', data: response })
            }
            catch (error: any) {
                const code = error.statusCode
                global.console.log(error)
                if (Reflect.has(ErrorCodeMessage, code))
                    return sendResponse({ type: 'Fail', message: ErrorCodeMessage[code] })
                return sendResponse({ type: 'Fail', message: error.message ?? 'Please check the back-end console' })
            }


            /*await importDynamic("chatgpt").then(module => {
                const { ChatMessage } = module;
                chatReplyProcess({
                    message: prompt,
                    lastContext: options,
                    process: (chat: typeof ChatMessage) => {
                        res.write(firstChunk ? JSON.stringify(chat) : `\n${JSON.stringify(chat)}`)
                        firstChunk = false
                    },
                    systemMessage,
                    temperature,
                    top_p,
                })
            })*/
            await this.statService.updateQueryCountByEmail(email,count+1);
        } catch (error) {
            res.write(JSON.stringify(error))
        } finally {
            res.end()
        }
    }

    async sendMessage(message: string, parentMessageId?: string) {

        if (!message || message.length === 0) {
            throw new Error("Message is empty");
        }

        let tries = 5;
        while (tries > 0) {
            try {
                const res: {
                    parentMessageId?: string | undefined,
                    role?: string | undefined,
                    id?: string | undefined,
                    text?: string | undefined,
                } = await this.gptApi.sendMessage(message, {
                    parentMessageId,

                })
                return res;
            } catch (e) {
                tries--;
                this.logger.error(e);
                await delay(10000);
            }
        }
    }
    /*
        async chatReplyProcess(options: ReqOptions) {
            const { message, lastContext, process, systemMessage, temperature, top_p } = options
            try {
                let options: typeof this.SendMessageOptions = { timeoutMs:this.timeoutMs }

                if (isNotEmptyString(systemMessage))
                    options.systemMessage = systemMessage

                options.completionParams = {
                    model: this.model,
                    temperature:temperature,
                    top_p:top_p }

                if (lastContext != null) {
                    options.parentMessageId = lastContext.parentMessageId
                }

                const response = await this.gptApi.sendMessage(message, {
                    ...options,
                    onProgress: (partialResponse) => {
                        process?.(partialResponse)
                    },
                })

                return sendResponse({ type: 'Success', data: response })
            }
            catch (error: any) {
                const code = error.statusCode
                global.console.log(error)
                if (Reflect.has(ErrorCodeMessage, code))
                    return sendResponse({ type: 'Fail', message: ErrorCodeMessage[code] })
                return sendResponse({ type: 'Fail', message: error.message ?? 'Please check the back-end console' })
            }
        }

        async fetchUsage() {
            const OPENAI_API_KEY = process.env.OPENAI_API_KEY
            const OPENAI_API_BASE_URL = process.env.OPENAI_API_BASE_URL

            if (!isNotEmptyString(OPENAI_API_KEY))
                return Promise.resolve('-')

            const API_BASE_URL = isNotEmptyString(OPENAI_API_BASE_URL)
                ? OPENAI_API_BASE_URL
                : 'https://api.openai.com'

            const [startDate, endDate] = formatDate()

            // 每月使用量
            const urlUsage = `${API_BASE_URL}/v1/dashboard/billing/usage?start_date=${startDate}&end_date=${endDate}`

            const headers = {
                'Authorization': `Bearer ${OPENAI_API_KEY}`,
                'Content-Type': 'application/json',
            }

            const options = {} as SetProxyOptions

            setupProxy(options)

            try {
                // 获取已使用量
                const useResponse = await options.fetch(urlUsage, { headers })
                if (!useResponse.ok)
                    throw new Error('获取使用量失败')
                const usageData = await useResponse.json() as UsageResponse
                const usage = Math.round(usageData.total_usage) / 100
                return Promise.resolve(usage ? `$${usage}` : '-')
            }
            catch (error) {
                global.console.log(error)
                return Promise.resolve('-')
            }
        }
    */
}

const ErrorCodeMessage: Record<string, string> = {
    401: '[OpenAI] 提供错误的API密钥 | Incorrect API key provided',
    403: '[OpenAI] 服务器拒绝访问，请稍后再试 | Server refused to access, please try again later',
    502: '[OpenAI] 错误的网关 |  Bad Gateway',
    503: '[OpenAI] 服务器繁忙，请稍后再试 | Server is busy, please try again later',
    504: '[OpenAI] 网关超时 | Gateway Time-out',
    500: '[OpenAI] 服务器繁忙，请稍后再试 | Internal Server Error',
}

function formatDate(): string[] {
    const today = new Date()
    const year = today.getFullYear()
    const month = today.getMonth() + 1
    const lastDay = new Date(year, month, 0)
    const formattedFirstDay = `${year}-${month.toString().padStart(2, '0')}-01`
    const formattedLastDay = `${year}-${month.toString().padStart(2, '0')}-${lastDay.getDate().toString().padStart(2, '0')}`
    return [formattedFirstDay, formattedLastDay]
}

/*
function setupProxy(options: SetProxyOptions) {
    if (isNotEmptyString(process.env.SOCKS_PROXY_HOST) && isNotEmptyString(process.env.SOCKS_PROXY_PORT)) {
        const agent = new SocksProxyAgent({
            hostname: process.env.SOCKS_PROXY_HOST,
            port: process.env.SOCKS_PROXY_PORT,
            userId: isNotEmptyString(process.env.SOCKS_PROXY_USERNAME) ? process.env.SOCKS_PROXY_USERNAME : undefined,
            password: isNotEmptyString(process.env.SOCKS_PROXY_PASSWORD) ? process.env.SOCKS_PROXY_PASSWORD : undefined,
        })
        options.fetch = (url, options) => {
            return fetch(url, { agent, ...options })
        }
    }
    else if (isNotEmptyString(process.env.HTTPS_PROXY) || isNotEmptyString(process.env.ALL_PROXY)) {
        const httpsProxy = process.env.HTTPS_PROXY || process.env.ALL_PROXY
        if (httpsProxy) {
            const agent = new HttpsProxyAgent(httpsProxy)
            options.fetch = (url, options) => {
                return fetch(url, { agent, ...options })
            }
        }
    }
    else {
        options.fetch = (url, options) => {
            return fetch(url, { ...options })
        }
    }
}

export interface ReqOptions {
    message: string
    lastContext?: { conversationId?: string; parentMessageId?: string }
    process?: (chat: ChatMessage) => void
    systemMessage?: string
    temperature?: number
    top_p?: number
}
*/
export interface SetProxyOptions {
    fetch?: typeof fetch
}

export interface UsageResponse {
    total_usage: number
}
