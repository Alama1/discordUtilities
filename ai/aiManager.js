const CharacterAI = require('node_characterai');
const characterAI = new CharacterAI();

class aiManager {
    constructor(app) {
        this.app = app
    }
    async init() {
        await characterAI.authenticateWithToken(this.app.config.properties.ai.token);
    }
    async getMessageFromAi(message) {
        const characterId = this.app.config.properties.ai.characterId
        const chat = await characterAI.createOrContinueChat(characterId);
        return await chat.sendAndAwaitResponse(message, true)
    }
}

module.exports = aiManager