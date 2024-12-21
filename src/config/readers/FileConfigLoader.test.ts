import { ConfigType, ConfigSchema } from '@plugger/configuration-core';
import * as fs from 'fs';
import * as path from 'path';
import { parse as parseYaml } from 'yaml';
import {FileConfigLoader} from '..'
import { vi } from 'vitest';


vi.mock('fs');
vi.mock('path');
vi.mock('yaml', () => ({
  parse: vi.fn()
}));

describe('AppConfig', () => {
    afterEach(() => {
        vi.clearAllMocks();  // Reset mocks after each test
    });

    test('should load JSON config correctly', () => {
        const mockFilePath = 'config.json';
        const mockJsonData = { app: { title: 'test', url: 'https://test.com'} };
        (fs.existsSync as jest.Mock).mockReturnValue(true);  // Simulate file exists
        (fs.readFileSync as jest.Mock).mockReturnValue(JSON.stringify(mockJsonData));  // Simulate file content
        (path.extname as jest.Mock).mockReturnValue('.json');  // Simulate the file extension
        
        const appConfig = new FileConfigLoader(mockFilePath);

        expect(appConfig.getConfig()).toEqual(ConfigSchema.parse(mockJsonData));
    });

    test('should load YAML config correctly', () => {
        const mockFilePath = 'config.yaml';
        const mockYamlData = { app: { title: 'test', url: 'https://test.com'} };
        (fs.existsSync as jest.Mock).mockReturnValue(true);  // Simulate file exists
        (fs.readFileSync as jest.Mock).mockReturnValue('name: TestApp\nversion: 1.0.0\n');  // Simulate YAML content
        (path.extname as jest.Mock).mockReturnValue('.yaml');  // Simulate the file extension
        (parseYaml as jest.Mock).mockReturnValue(mockYamlData);  // Mock YAML parser
        
        const reader = new FileConfigLoader(mockFilePath);

        expect(reader.getConfig()).toEqual(ConfigSchema.parse(mockYamlData));
    });

    test('should throw an error if file does not exist', () => {
        const mockFilePath = 'nonexistent.json';
        (fs.existsSync as jest.Mock).mockReturnValue(false);  // Simulate file not existing
        
        expect(() => {
            new FileConfigLoader(mockFilePath);
        }).toThrow();
    });

    test('should throw an error if the file extension is unsupported', () => {
        const mockFilePath = 'config.txt';
        (fs.existsSync as jest.Mock).mockReturnValue(true);  // Simulate file exists
        (fs.readFileSync as jest.Mock).mockReturnValue('unsupported content');  // Mock file content
        (path.extname as jest.Mock).mockReturnValue('.txt');  // Simulate an unsupported file extension
        
        expect(() => {
            new FileConfigLoader(mockFilePath);
        }).toThrow();
    });

    test('should throw an error if the config does not match the schema', () => {
        const mockFilePath = 'config.json';
        const mockJsonData = { name: 'A' };  // This will fail the schema validation
        (fs.existsSync as jest.Mock).mockReturnValue(true);  // Simulate file exists
        (fs.readFileSync as jest.Mock).mockReturnValue(JSON.stringify(mockJsonData));  // Simulate file content
        (path.extname as jest.Mock).mockReturnValue('.json');  // Simulate the file extension

        expect(() => {
            new FileConfigLoader(mockFilePath);
        }).toThrow();
    });
});
