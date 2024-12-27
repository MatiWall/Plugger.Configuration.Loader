import { z, ZodType } from 'zod';
import type { ConfigType } from '@plugger/configuration-core'
import {ConfigSchema} from '@plugger/configuration-core'
import { idGenerator } from '@plugger/utils';
import { UnknownExtensionConfig } from './errors';


abstract class ConfigLoader<TConfig = ConfigType> {
    protected config: TConfig
    protected schema: ZodType

    constructor(
        schema: ZodType = ConfigSchema,
    ){
        this.schema = schema;
    }

    loadConfig(): TConfig {
        const config = this.fetchConfig();
        this.config = this.validateConfig(config);;
        return this.config; 
    }

    protected abstract fetchConfig(): TConfig;


    protected validateConfig(config: TConfig): TConfig {
        return this.schema.parse(config);
    }

    isValid(config: TConfig): boolean {
        try {
            this.validateConfig(config);
            return true;
        } catch {
            return false;
        }
    }

    getConfig(): TConfig{
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
