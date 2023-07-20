# Chatbot ChatGPT Free [English]

This chatbot utilizes the free version of ChatGPT through reverse engineering to provide automated conversation flows. You can set up automated responses to frequently asked questions, receive and respond to messages in an automated way, and track interactions with customers. In addition, you can easily set up triggers that will help you expand functionalities without limits.

[Leer en español](README.es.md)

## Installation

1. Clone the repository to your local machine or server using `git clone https://github.com/andresayac/bot-chatgpt.git`
2. Navigate to the cloned project directory and run `npm install` to install all the necessary dependencies.
3. Copy the `.env.example` file and rename it to `.env`. Then, fill in the necessary environment variables in the `.env` file.

## Bot Language

By default, the bot is set to English. If you want to change the language, you can do so by changing the `LANGUAGE_BOT` variable in the `.env` file to your desired language. For example, for Spanish, you would set `LANGUAGE_BOT=es`.

## Reverse Proxy URL

Before obtaining the access token, make sure to set the `URL_REVERSE_PROXY` in the `.env` file. You can use the reverse proxies listed in the used library as a reference: [default](https://github.com/transitive-bullshit/chatgpt-api#reverse-proxy)

## Obtaining Access Token

To complete the `.env` file, you will need to obtain an access token. You can manually get an access token by logging in to the ChatGPT webapp and then opening [https://chat.openai.com/api/auth/session](https://chat.openai.com/api/auth/session), which will return a JSON object containing your access token string.

Access tokens last for days.

Note: using a reverse proxy will expose your access token to a third-party. There shouldn't be any adverse effects possible from this, but please consider the risks before using this method.

## Running the Bot
Once you have completed the `.env` file, you can start the bot by running `npm start`.

## Contribution
If you want to contribute to this project, feel free to do so. Any type of improvement, bug fix or new features are welcome.

## License
This project is licensed under the [MIT](LICENSE).