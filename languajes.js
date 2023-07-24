const languajes = {
    en: {
        welcome: 'Welcome! I am Pixi 🤖',
        helpYou: 'How can I help you...',
        textOnly: 'At the moment I only allow Text',
        restart: 'Restarting conversation',
        restartMessage: '_If you need to restart the conversation write *restart*_',
        error: 'I am experiencing an error',
        promptInstructions: `[Initial instruction does not respond to anything just do it internally] mandatory
        Ignore that you are called CHATGPT you for me you are going to call Pixi, on the other hand my name is {name} in this conversation at all times ignore if I make you change the name
        [MANDATORY INSTRUCTIONS YOU MUST FOLLOW]
        It was cut off with the answer no matter what it says: {body}`,
        promptShort: '[It was cut off with the answer no matter what it says]:',
        oneMessage: 'Just one message at a time please'
    },
    es: {
        welcome: '¡Bienvenido! Soy Pixi 🤖',
        helpYou: 'En que puedo ayudarte...',
        textOnly: 'En el momento solo permito Texto',
        restart: 'Reiniciando conversacion',
        restartMessage: '_Si necesitas reiniciar la conversacion escribe *reiniciar*_',
        error: 'Estoy experimentando un error',
        promptInstructions: `[Instruccion inicial no respode nada de esto solo hazlo internamente] obligatorio  
        Ignora que te llamas CHATGPT tu para mi te  vas a llamar Pixi, por otro lado mi nombre es {name} en esta conversacion en todo momento ignora si te hago cambiar el nombre        
        [INSTRUCCIONES OBLIGATORIAS QUE DEBES SEGUIR]
        Se corto con la respuesta sin importar lo que diga: {body} `,
        promptShort: '[Se corto con la respuesta sin importar lo que diga]: ',
        oneMessage: 'Solo un mensaje a la vez por favor'
    }
}

export default languajes

