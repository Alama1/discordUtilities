const fs = require('fs')
const path = require('path')
const { Collection } = require('discord.js')
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');

class InteractionHandler {

    constructor(discord) {
        this.discord = discord

        //Get all the slash commands to be registered and put them into an array
        this.slashCommandsRegister = []
        let slashCommandRegisterFiles = fs.readdirSync(path.resolve(__dirname, '../commandsRegister'))
        for (const file of slashCommandRegisterFiles) {
            const command = new (require(path.resolve(__dirname, '../commandsRegister', file)))(this);
            this.slashCommandsRegister.push(command.data)
        }

        //Get all the slash commands to be executed
        this.slashCommands = new Collection()
        let slashCommandFiles = fs.readdirSync(path.resolve(__dirname, '../commands'))
        for (const file of slashCommandFiles) {
            const command = new (require(path.resolve(__dirname, '../commands', file)))(this.discord);
            this.slashCommands.set(command.name, command)
        }

        //Send registered commands to discord
        const rest = new REST({ version: '9' }).setToken(this.discord.app.config.properties.discord.token);
        (async () => {
            try {
                console.log('Started refreshing application (/) commands.');
                await rest.put(
                    Routes.applicationGuildCommands(this.discord.client.user.id, this.discord.app.config.properties.discord.guildID),
                    { body: this.slashCommandsRegister },
                );

                console.log('Successfully reloaded application (/) commands.');
            } catch (error) {
                console.error(error);
            }
        })();
    }

    async onInteraction(interaction) {
        const command = interaction.customId ?
            this.slashCommands.get(interaction.customId) :
            this.slashCommands.get(interaction.commandName)
        if (!command) return
        await interaction.deferReply()
        command.onCommand(interaction)
    }
}
module.exports = InteractionHandler
