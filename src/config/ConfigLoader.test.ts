import { describe, test } from "vitest"
import { ConfigLoader } from "."
import { ConfigType, ConfigSchema } from '@plugger/configuration-core'
import { idGenerator } from "@plugger/utils"

describe('ConfigLoader', () => {

    const kind: string = 'kind';
    const namespace: string = 'namespace';
    const name: string = 'name';

    const testID: string = idGenerator(namespace, name, kind);
    const extensionConfig: Object = {'test': 'config'};

    const extensionsObj: object = {[testID]: extensionConfig}

    class TestConfigLoader extends ConfigLoader {
        protected fetchConfig(): ConfigType {
            return ConfigSchema.parse({
                extensions: extensionsObj
            })
        }
    }

    test('getExtensionConfig', () => {

        const loader = new TestConfigLoader();
        loader.loadConfig();

        expect(loader.getExtensionConfig(namespace, name, kind)).toEqual(extensionConfig);



    })
})