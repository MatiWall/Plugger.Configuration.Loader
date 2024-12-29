import { ZodType } from "zod";
import { ConfigLoader } from "../ConfigLoader";
import { ConfigType, ConfigSchema } from "@plugger/configuration-core";


class InlineConfigLoader<TConfig> extends ConfigLoader<TConfig> {
    
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

function createInlineConfigLoader({
    config = ConfigSchema.parse({}),
    schema = ConfigSchema
}: {
    config?: ConfigType,
    schema?: ZodType
}){


    return new InlineConfigLoader(
        config,
        schema 
    );
}

export {
    InlineConfigLoader,
    createInlineConfigLoader
}