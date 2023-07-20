import pkg from '@bot-whatsapp/bot'
import BaileysProvider from '@bot-whatsapp/provider/baileys'
import JsonFileAdapter from '@bot-whatsapp/database/json'
import { ChatGPTUnofficialProxyAPI } from 'chatgpt';
import { oraPromise } from 'ora'
import dotenv from 'dotenv-safe'
import PQueue from 'p-queue';

dotenv.config()

// import state global
import globalState from './state/globalState.js'

// import languajes
import languajes from './languajes.js'

const languaje_bot = languajes[process.env.LANGUAJE_BOT] ?? languajes['en']

console.log(`Languaje bot: ${process.env.LANGUAJE_BOT}`)
console.log(`Languaje bot: ${languaje_bot}`)
console.log(`Languaje bot: ${languaje_bot['welcome']}`)

const { createBot, createProvider, createFlow, addKeyword, EVENTS } = pkg

const queue = new PQueue({ concurrency: 1 });


const simulateTyping = async (ctx, provider) => {
    // view message 
    await provider.vendor.readMessages([ctx?.key])
    await provider.vendor.presenceSubscribe(ctx?.key?.remoteJid)

    // simulare writing
    await provider.vendor.sendPresenceUpdate('composing', ctx?.key?.remoteJid)
}

const simulateEndPause = async (ctx, provider) => {
    await provider.vendor.sendPresenceUpdate('paused', ctx?.key?.remoteJid)
}

const api = new ChatGPTUnofficialProxyAPI({
    accessToken: process.env.OPENAI_ACCESS_TOKEN,
    apiReverseProxyUrl: process.env.URL_REVERSE_PROXY,
    debug: false
})

const flowChatGptImage = addKeyword(EVENTS.MEDIA)
    .addAnswer([ `${languaje_bot['welcome']}`, languaje_bot['textOnly']])


const flowChatGptDoc = addKeyword(EVENTS.DOCUMENT)
    .addAnswer([languaje_bot['welcome'], languaje_bot['textOnly']])

const flowChatGptAudio = addKeyword(EVENTS.VOICE_NOTE)
    .addAnswer([languaje_bot['welcome'], languaje_bot['textOnly']])


const flowChatGptLocation = addKeyword(EVENTS.LOCATION)
    .addAnswer([languaje_bot['welcome'], languaje_bot['textOnly']])

const flowChatGpt = addKeyword(EVENTS.WELCOME)
    .addAnswer([languaje_bot['welcome']])
    .addAnswer([languaje_bot['helpYou']],
        { capture: true },
        async (ctx, { fallBack, flowDynamic, gotoFlow, provider }) => {

            // simular escribiendo
            await simulateTyping(ctx, provider)

            // reiniciar conversacion
            if (ctx.body.toLowerCase().trim().includes('reiniciar')) {
                globalState.update(ctx.from, {
                    name: ctx.pushName ?? ctx.from,
                    chatGPT: null,
                    conversationNumber: 0,
                    finishedAnswer: true
                })

                await flowDynamic(languaje_bot['restart'])
                await simulateEndPause(ctx, provider)
                await gotoFlow(flowChatGpt)

                return
            }

            // bienvenida
            if (!globalState.get(ctx.from)?.chatGPT) {
                let prompt = languaje_bot['prompt_instructions'];
                prompt = prompt.replace('{name}', ctx.pushName);
                prompt = prompt.replace('{body}', ctx.body.trim());

                try {
                    const response = await queue.add(() => oraPromise(api.sendMessage(prompt), {
                        text: prompt,
                    }));

                    globalState.update(ctx.from, {
                        name: ctx.pushName ?? ctx.from,
                        chatGPT: response,
                        conversationNumber: 1,
                        finishedAnswer: true

                    })

                    await flowDynamic(response.text ?? languaje_bot['error'])
                } catch (error) {
                    console.error(error);
                    globalState.update(ctx.from, { finishedAnswer: true });
                    await flowDynamic(languaje_bot['error']);
                }

                // stop typing
                await simulateEndPause(ctx, provider)
                await fallBack()
                return
            }

            new Promise((res) => setTimeout(res, 5000))

            if (globalState.get(ctx.from)?.finishedAnswer === false) {
                flowDynamic(languaje_bot['oneMessage'])
                await fallBack()
                return
            }

            if (globalState.get(ctx.from)?.chatGPT?.conversationId) {

                let conversation = languaje_bot['promptShort'] + " " + ctx.body.trim()

                globalState.update(ctx.from, {
                    finishedAnswer: false
                })

                try {
                    let response = await queue.add(() => oraPromise(api.sendMessage(conversation, {
                        conversationId: globalState.get(ctx.from).chatGPT?.conversationId,
                        parentMessageId: globalState.get(ctx.from).chatGPT?.id
                    })));

                    globalState.update(ctx.from, {
                        name: ctx.pushName ?? ctx.from,
                        chatGPT: response,
                        conversationNumber: globalState.get(ctx.from).conversationNumber + 1,
                        finishedAnswer: true
                    });

                    await flowDynamic(response.text ?? languaje_bot['error']);


                    if (globalState.get(ctx.from)?.conversationNumber > 5) {
                        await flowDynamic(languaje_bot['restartMessage']);
                    }
                } catch (error) {
                    console.error(error);
                    globalState.update(ctx.from, { finishedAnswer: true });
                    await flowDynamic(languaje_bot['error']);
                }

                await simulateEndPause(ctx, provider);
                await fallBack()
                return


            }

            await fallBack()

        },
    )

const main = async () => {
    const adapterDB = new JsonFileAdapter()
    const adapterFlow = createFlow([flowChatGpt, flowChatGptImage, flowChatGptDoc, flowChatGptAudio, flowChatGptLocation])
    const adapterProvider = createProvider(BaileysProvider)

    createBot({
        flow: adapterFlow,
        provider: adapterProvider,
        database: adapterDB,
    })

}

main()
