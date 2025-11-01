const config = {
    preset: "ts-jest/presets/default-esm",
    testEnvironment: "node",
    testMatch: ["**/src/**/*.test.ts"],
    extensionsToTreatAsEsm: [".ts"],
    moduleNameMapper: {
        "^@/(.*)$": "<rootDir>/src/$1",
    },
    transform: {
        "^.+\\.tsx?$": [
            "ts-jest",
            { useESM: true, tsconfig: "tsconfig.jest.json" },
        ],
    },
    // transformIgnorePatterns: ['/node_modules/(?!your-esm-dep)/'],
};
export default config;
//# sourceMappingURL=jest.config.js.map