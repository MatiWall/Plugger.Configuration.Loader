import { ZodType } from 'zod';
import { ConfigLoader } from '../ConfigLoader';
import { ConfigType, ConfigSchema } from '@plugger/configuration-core';

class EnvConfigLoader<TConfig> extends ConfigLoader<TConfig>  {

    envKey: string

    constructor(
        envKey: string,
        schema: ZodType = ConfigSchema
    ){
        super(schema);
        this.envKey = envKey;

        this.loadConfig();
    }

    protected fetchConfig(): TConfig {

        const appConfigString = process.env[this.envKey];

        if(appConfigString === undefined){
            throw new Error(`Invalid key ${this.envKey}, config does not exists`)
        }

        const appConfig = JSON.parse(appConfigString);


        return appConfig as TConfig
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