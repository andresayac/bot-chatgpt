# Chatbot ChatGPT Free

Este chatbot utiliza la versión gratuita de ChatGPT a través de ingeniería inversa para proporcionar flujos de conversación automatizados. Puedes configurar respuestas automatizadas para preguntas frecuentes, recibir y responder mensajes de manera automatizada, y hacer un seguimiento de las interacciones con los clientes. Además, puedes configurar fácilmente disparadores que te ayudarán a expandir las funcionalidades sin límites.

## Instalación

1. Clona el repositorio en tu máquina local o servidor usando `git clone https://github.com/andresayac/bot-chatgpt.git`
2. Navega al directorio del proyecto clonado y ejecuta `npm install` para instalar todas las dependencias necesarias.
3. Copia el archivo `.env.example` y renómbralo a `.env`. Luego, completa las variables de entorno necesarias en el archivo `.env`.

## Idioma del Bot

Por defecto, el bot está configurado en inglés. Si deseas cambiar el idioma, puedes hacerlo modificando la variable `LANGUAGE_BOT` en el archivo `.env` a tu idioma deseado. Por ejemplo, para español, configurarías `LANGUAGE_BOT=es`.

## URL del Proxy Inverso

Antes de obtener el token de acceso, asegúrate de configurar la `URL_REVERSE_PROXY` en el archivo `.env`. Puedes usar los proxies inversos listados en la biblioteca utilizada como referencia: [default](https://github.com/transitive-bullshit/chatgpt-api#reverse-proxy)

## Obtención del Token de Acceso

Para completar el archivo `.env`, necesitarás obtener un token de acceso. Puedes obtener un token de acceso manualmente iniciando sesión en la aplicación web de ChatGPT y luego abriendo [https://chat.openai.com/api/auth/session](https://chat.openai.com/api/auth/session), que devolverá un objeto JSON que contiene tu cadena de token de acceso.

Los tokens de acceso duran días.

Nota: el uso de un proxy inverso expondrá tu token de acceso a un tercero. No debería haber posibles efectos adversos de esto, pero por favor considera los riesgos antes de usar este método.

## Ejecución del Bot

Una vez que hayas completado el archivo `.env`, puedes iniciar el bot ejecutando `npm start`.


## Contribución
Si deseas contribuir a este proyecto, no dudes en hacerlo. Cualquier tipo de mejora, corrección de errores o nuevas características son bienvenidas.

## Licencia
Este proyecto está licenciado bajo la [MIT](LICENSE).