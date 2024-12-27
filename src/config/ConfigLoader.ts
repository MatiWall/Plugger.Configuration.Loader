import { z, ZodType } from 'zod';
import type { ConfigType } from '@plugger/configuration-core'
import {ConfigSchema} from '@plugger/configuration-core'
import { idGenerator } from '@plugger/utils';
import { UnknownExtensionConfig } from './errors';

UnknownExtensionConfig

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
        this.config = this.validateConfig(config);;
        return this.config;
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

    getExtensionConfig(namespace: string, name: string, kind: string){
        const id = idGenerator(namespace, name, kind);

        const extensionConfig = this.config['extensions'][id];

        if (extensionConfig === undefined){
            throw new UnknownExtensionConfig(`Extension with id ${id} does not exists`);
        }

        return extensionConfig;
        
    }
}



export {ConfigLoader}
