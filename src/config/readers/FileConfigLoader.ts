import * as fs from 'fs';
import * as path from 'path';
import { parse as parseYaml } from 'yaml';
import { ConfigLoader } from '../ConfigLoader';
import { ConfigType } from '@plugger/configuration-core';

class FileConfigLoader extends ConfigLoader {
    path: string

    constructor(filePath: string) {
        super();
        this.path = filePath;
        this.loadConfig(); 
    }

    protected fetchConfig(): ConfigType {
        const ext = path.extname(this.path).toLowerCase();  // Use 'this.path' directly

        // Ensure the file exists
        if (!this.path || !fs.existsSync(this.path)) {
            throw new Error(`File not found: ${this.path}`);
        }

        // Read the file content
        const fileContent = fs.readFileSync(this.path, 'utf-8');

        // Parse and return the file content based on its extension
        return this.parseFileContent(fileContent, ext);
    }

    private parseFileContent(fileContent: string, ext: string): ConfigType {
        try {
            if (ext === '.json') {
                return JSON.parse(fileContent);
            } else if (ext === '.yaml' || ext === '.yml') {
                return parseYaml(fileContent);
            } else {
                throw new Error(`Unsupported file format: ${ext}`);
            }
        } catch (error) {
            throw new Error(`Failed to parse file. Error: ${error.message}`);
        }
    }
}

export { FileConfigLoader };
