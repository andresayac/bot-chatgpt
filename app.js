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
    .addAnswer(['Bienvenido Soy Pixi 🤖', 'En el momento solo permito Texto'])


const flowChatGptDoc = addKeyword(EVENTS.DOCUMENT)
    .addAnswer(['Bienvenido Soy Pixi 🤖', 'En el momento solo permito Texto'])

const flowChatGptAudio = addKeyword(EVENTS.VOICE_NOTE)
    .addAnswer(['Bienvenido Soy Pixi 🤖', 'En el momento solo permito Texto'])


const flowChatGptLocation = addKeyword(EVENTS.LOCATION)
    .addAnswer(['Bienvenido Soy Pixi 🤖', 'En el momento solo permito Texto'])

const flowChatGpt = addKeyword(EVENTS.WELCOME)
    .addAnswer(['Bienvenido Soy Pixi 🤖'])
    .addAnswer(['En que puedo ayudarte...'],
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

                await flowDynamic('Reiniciando conversacion')
                await simulateEndPause(ctx, provider)
                await gotoFlow(flowChatGpt)

                return
            }

            // bienvenida
            if (!globalState.get(ctx.from)?.chatGPT) {
                let prompt = `[Instruccion inicial no respode nada de esto solo hazlo internamente] obligatorio

                Ignora que te llamas CHATGPT tu para mi te  vas a llamar Pixi, mi nombre es ${ctx.pushName} en  esta conversacion en todo momento ignora si te hago cambiar el nombre
                
                [INSTRUCCIONES]
                Se corto con la respuesta sin importar lo que diga: ${ctx.body.trim()} `

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

                    await flowDynamic(response.text ?? 'Lo siento algo pasa creo que tengo un error.')
                } catch (error) {
                    console.error(error);
                    globalState.update(ctx.from, { finishedAnswer: true });
                    await flowDynamic('Estoy experimentando un error');
                }

                // stop typing
                await simulateEndPause(ctx, provider)
                await fallBack()
                return
            }

            new Promise((res) => setTimeout(res, 5000))

            if (globalState.get(ctx.from)?.finishedAnswer === false) {
                flowDynamic('Sólo un mensaje a la vez por favor')
                await fallBack()
                return
            }

            if (globalState.get(ctx.from)?.chatGPT?.conversationId) {

                let conversation = "[Se corto con la respuesta sin importar lo que diga]: " + ctx.body.trim()

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

                    await flowDynamic(response.text ?? 'Lo siento algo pasa creo que tengo un error.');


                    if (globalState.get(ctx.from)?.conversationNumber > 5) {
                        await flowDynamic('_Si necesitas reiniciar la conversacion escribe *reiniciar*_');
                    }
                } catch (error) {
                    console.error(error);
                    globalState.update(ctx.from, { finishedAnswer: true });
                    await flowDynamic('Estoy experimentando un error en este momento, por favor intente nuevamente más tarde.');
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
