const CharacterAI = require('node_characterai');
const characterAI = new CharacterAI();

class aiManager {
    constructor(app) {
        this.app = app
        this.inProcess = false
    }
    async init() {
        await characterAI.authenticateWithToken(this.app.config.properties.ai.token);
    }
    async getMessageFromAi(message) {
        if(this.inProcess) return { text: 'Работаю над другим вопросом, подожди.' }
        this.inProcess = true
        const characterId = this.app.config.properties.ai.characterId
        const chat = await characterAI.createOrContinueChat(characterId);
        const reply = await chat.sendAndAwaitResponse(message, true)
        this.inProcess = false
        return reply
    }
}

module.exports = aiManager