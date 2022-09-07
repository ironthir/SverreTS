declare global {
    namespace NodeJS {
        interface ProcessEnv {
            botToken: string,
            guildId: string,
            environment: "dev" | "debug" | "prod"
        }
    }
}
export {}