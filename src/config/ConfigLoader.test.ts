import { z, ZodType } from "zod";
import { InlineConfigLoader } from "./readers/DefaultConfigLoader";
import { idGenerator } from "@plugger/utils";

describe("ConfigLoader", () => {
    const kind: string = "kind";
    const namespace: string = "namespace";
    const name: string = "name";

    const testID: string = idGenerator(namespace, name, kind);
    const extensionConfig: object = { test: "config" };

    const extensionsObj: object = { [testID]: extensionConfig };

    const schema: ZodType = z.object({
        extensions: z.record(z.string(), z.object({
            test: z.string(),
        })),
    });

    const loader = new InlineConfigLoader(
        {
            extensions: extensionsObj,
        },
        schema
    );

    test("getExtensionConfig should return the correct extension config", () => {
        expect(loader.getExtensionConfig(namespace, name, kind)).toEqual(extensionConfig);
    });

    test("getExtensionConfig should throw an error for a non-existent extension", () => {
        expect(() => loader.getExtensionConfig("invalid", "invalid", "invalid"))
            .toThrowError(/does not exist/);
    });

    test("getExtensionConfig should throw an error if extensions are empty", () => {
        const emptyLoader = new InlineConfigLoader(
            {
                extensions: {},
            },
            schema
        );

        expect(() => emptyLoader.getExtensionConfig(namespace, name, kind))
            .toThrowError(/does not exist/);
    });
});
