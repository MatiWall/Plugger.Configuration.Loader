import { ZodType } from "zod";
import { ConfigLoader } from "../ConfigLoader";
import { ConfigType, ConfigSchema } from "@plugger/configuration-core";


class DefaultConfigLoader<TConfig = ConfigType> extends ConfigLoader {
    
    appConfig: TConfig

    constructor(appConfig: TConfig, schema: ZodType){
        super(schema);
        
        this.appConfig = appConfig;
        
        this.loadConfig();
    }

    fetchConfig(): TConfig{

        return this.appConfig;
    }

}

function createDefaultConfigLoader({
    config = ConfigSchema.parse({}),
    schema = ConfigSchema
}: {
    config?: object,
    schema?: ZodType
}){


    return new DefaultConfigLoader(
        config,
        schema 
    );
}

export {
    DefaultConfigLoader,
    createDefaultConfigLoader
}