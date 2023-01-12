import type { Config } from 'jest';

const config: Config = {
    preset: 'ts-jest',
    resolver: 'ts-jest-resolver',
    "transform": {
        ".(ts|tsx)": "ts-jest"
    },
    "testRegex": "(/__tests__/.*|\\.(test|spec))\\.(ts|tsx|js)$",
    "moduleFileExtensions": [
        "ts",
        "tsx",
        "js"
    ]
};

export default config;
