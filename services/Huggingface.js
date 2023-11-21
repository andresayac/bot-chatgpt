import dotenv from 'dotenv-safe'
import WebSocket from 'ws'

dotenv.config()

const processImage = async (imageBuffer) => {
    const base64Image = imageBuffer.toString('base64');

    const ws = new WebSocket('wss://zerocommand-microsoft-trocr-large-printed.hf.space/queue/join', {
        origin: 'https://zerocommand-microsoft-trocr-large-printed.hf.space',
        host: 'zerocommand-microsoft-trocr-large-printed.hf.space',
        headers: {
            'Sec-Websocket-Extensions': 'permessage-deflate; client_max_window_bits',
            'Sec-WebSocket-Version': '13',
        }
    });

    ws.on('open', () => {
        const session_hash = Math.random().toString(36).substring(2);
        ws.send(JSON.stringify({ session_hash: session_hash, fn_index: 0 }));
        ws.send(JSON.stringify({ fn_index: 0, data: ["data:image/jpeg;base64," + base64Image], session_hash: session_hash }));
    });

    try {
        const wsImageReceive = new Promise((resolve, reject) => {
            ws.on('message', function incoming(data) {
                const messageText = data.toString();
                if (messageText.includes('process_completed')) {
                    resolve(messageText);
                }
            });
        });

        const response = await wsImageReceive;
        ws.close();

        return JSON.parse(response);
    } catch (error) {
        ws.close();
        return { msg: 'Error al procesar la respuesta del WebSocket', success: false }
    }

}

const processAudio = async (audioBuffer, name) => {
    const base64Audio = audioBuffer.toString('base64');

    const ws = new WebSocket('wss://hf-audio-whisper-large-v3.hf.space/queue/join', {
        origin: 'https://hf-audio-whisper-large-v3.hf.space',
        host: 'hf-audio-whisper-large-v3.hf.space',
        headers: {
            'Sec-Websocket-Extensions': 'permessage-deflate; client_max_window_bits',
            'Sec-WebSocket-Version': '13',
        }
    });

    ws.on('open', () => {
        const session_hash = Math.random().toString(36).substring(2);
        ws.send(JSON.stringify({ session_hash: session_hash, fn_index: 0 }));
        ws.send(JSON.stringify({ fn_index: 0, data: [{ data: "data:audio/ogg;base64," + base64Audio, name: name }, "transcribe"], session_hash: session_hash }));

    });

    try {
        const wsAudioReceive = new Promise((resolve, reject) => {
            ws.on('message', function incoming(data) {
                const messageText = data.toString();
                console.log(messageText)
                if (messageText.includes('process_completed')) {
                    resolve(messageText);
                }
            });
        });

        const response = await wsAudioReceive;
        console.log('response', response)
        ws.close();

        return JSON.parse(response);
    } catch (error) {
        ws.close();
        return { msg: 'Error al procesar la respuesta del WebSocket', success: false }
    }
}

export { processImage, processAudio }