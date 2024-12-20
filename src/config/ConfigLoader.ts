import { z, ZodType } from 'zod';
import type { ConfigType } from '@plugger/configuration-core'
import {ConfigSchema} from '@plugger/configuration-core'


abstract class ConfigLoader {
    protected config: ConfigType
    protected schema: ZodType

    constructor(
        schema: ZodType = ConfigSchema
    ){
        this.schema = schema;
    }

    loadConfig(): ConfigType {
        const config = this.fetchConfig();
        
        return this.validateConfig(config);
    }

    protected abstract fetchConfig(): ConfigType;


    protected validateConfig(config: object): ConfigType {
        return this.schema.parse(config);
    }

    isValid(config: object): boolean {
        try {
            this.schema.parse(config);  // Try parsing
            return true;
        } catch (e) {
            return false;
        }
    }

    getConfig(){
        return this.config;
    }
}



export {ConfigLoader}
