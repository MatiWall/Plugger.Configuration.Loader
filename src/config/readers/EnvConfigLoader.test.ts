import { EnvConfigLoader } from "./EnvConfigLoader"
import { z, ZodType } from 'zod';

describe('EnvConfigLoader', () =>{

    const envKey: string = 'key'
    const mockConfig = {
        'app': {'title': 'test'},
    };

    const schema: ZodType = z.object({
        'app': z.object({
            'title': z.string()
        })
    });

    beforeEach(() => {
        delete process.env[envKey];
    })

    test('Read config from env var', () =>{
        
        process.env[envKey] = JSON.stringify(mockConfig);

        const loader = new EnvConfigLoader(envKey, schema);

        expect(mockConfig).toEqual(loader.loadConfig());
    })

    test('Config does not exists', ()=>{
        const loader = new EnvConfigLoader(envKey, schema);

        expect(()=> {
            loader.loadConfig()
        }).toThrow(Error);
    })
})