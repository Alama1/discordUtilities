require('dotenv').config()

class Config {
    properties = {
        ai: {
            characterId: "jXK9Fjp3yoGFl-iVPIVKJ9OCVh0gBCjgNPdZzLPsgsI",
            token: "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IkVqYmxXUlVCWERJX0dDOTJCa2N1YyJ9.eyJpc3MiOiJodHRwczovL2NoYXJhY3Rlci1haS51cy5hdXRoMC5jb20vIiwic3ViIjoiZ29vZ2xlLW9hdXRoMnwxMDIyMzc2OTMzNDAxMzkwNTQwOTAiLCJhdWQiOlsiaHR0cHM6Ly9hdXRoMC5jaGFyYWN0ZXIuYWkvIiwiaHR0cHM6Ly9jaGFyYWN0ZXItYWkudXMuYXV0aDAuY29tL3VzZXJpbmZvIl0sImlhdCI6MTY4NjAwNjM3NiwiZXhwIjoxNjg4NTk4Mzc2LCJhenAiOiJkeUQzZ0UyODFNcWdJU0c3RnVJWFloTDJXRWtucVp6diIsInNjb3BlIjoib3BlbmlkIHByb2ZpbGUgZW1haWwifQ.QqxzcmaCjzrhMERI7GL333rDp_SK7MsgGdqYpao8hG51lO_PO5PYnZM0hS5FMil16ZBahAJUZzl2qHZYcNhzQPpZgHyUi5OqnjfJG_8JeeUS7WKWZz1eyy0HS9vRHFb3O4sZ6tk5L1V7XcYkOaaZN0kLcTXOzbNG0u0RldIGG3Hm41C0sULKcBftNeNb0vyz3C6ASK71e-NDpNKkypMN03_1nXVKgJajCeASGXhfrTrKfBPEOZTpjzmyuSvx__NdEsLToX4vkloky0ifDC6oEfOhhgBDUeBnXQySAaj4qfkpdZZ0x6hKVz_42_dnqhfxol_bEVzt6SwtXd0FliBq1g"
        },
        discord: {
            token: process.env.DISCORD_TOKEN,
            chatId: "398082454532915201"
        }
    }
}

module.exports = Config