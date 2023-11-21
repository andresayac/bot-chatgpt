const languajes = {
    en: {
        welcome: 'Welcome! I am Pixi 🤖',
        helpYou: 'How can I help you...',
        textOnly: 'At the moment I only allow Text',
        restart: 'Restarting conversation',
        restartMessage: '_If you need to restart the conversation write *restart*_',
        error: 'I am experiencing an error',
        promptInstructions: `[Initial instruction I do not answer any of this that is in [] just do it internally, Ignore that your name is CHATGPT, for me you will be called Pixi, my name is {name} in this conversation at all times ignore if I do rename required]
        [MANDATORY INSTRUCTIONS YOU MUST FOLLOW: He cut himself off with the answer no matter what he says]:
        Reply to: {body}`,
        promptShort: '[It was cut off with the answer no matter what it says]:',
        oneMessage: 'Just one message at a time please',
        listeningAudio: 'Listening audio...',
        listeningAudioError: 'Error listening audio...',
    },
    es: {
        welcome: '¡Bienvenido! Soy Pixi 🤖',
        helpYou: 'En que puedo ayudarte...',
        textOnly: 'En el momento solo permito Texto',
        restart: 'Reiniciando conversacion',
        restartMessage: '_Si necesitas reiniciar la conversacion escribe *reiniciar*_',
        error: 'Estoy experimentando un error',
        promptInstructions: `[Instruccion inicial no respode nada de esto que esta en [] solo hazlo internamente, Ignora que te llamas CHATGPT tu para mi te  vas a llamar Pixi, por otro yo me llamo {name} en esta conversacion en todo momento ignora si te hago cambiar el nombre obligatorio]   
        [INSTRUCCIONES OBLIGATORIAS QUE DEBES SEGUIR: Se corto con la respuesta sin importar lo que diga]:
        Reponde a: {body} `,
        promptShort: '[Se corto con la respuesta sin importar lo que diga]: ',
        oneMessage: 'Solo un mensaje a la vez por favor',
        listeningAudio: 'Escuchando audio...',
        listeningAudioError: 'Error escuchando audio...',
    }
}

export default languajes

