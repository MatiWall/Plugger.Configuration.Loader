import { ZodType } from 'zod';
import { ConfigLoader } from '../ConfigLoader';
import { ConfigType, ConfigSchema } from '@plugger/configuration-core';

class EnvConfigLoader extends ConfigLoader {

    envKey: string

    constructor(
        envKey: string,
        schema: ZodType
    ){
        super(schema);
        this.envKey = envKey;

        this.loadConfig();
    }

    protected fetchConfig(): ConfigType {

        const appConfigString = process.env[this.envKey];

        if(appConfigString === undefined){
            throw new Error(`Invalid key ${this.envKey}, config does not exists`)
        }

        const appConfig = JSON.parse(appConfigString);


        return appConfig
    }

}

function createEnvConfigLoader({
    envKey = 'APP_CONFIG',
    schema = ConfigSchema
}: {
    envKey: string,
    schema: ZodType
}){

    return new EnvConfigLoader(
        envKey,
        schema
    )
}



export {
    EnvConfigLoader,
    createEnvConfigLoader
}