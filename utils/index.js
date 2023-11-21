const isImage = (msg) => {
    return msg?.message?.imageMessage ? true : false
}

const isAudio = (msg) => {
    return msg?.message?.audioMessage ? true : false
}

export { isAudio, isImage }