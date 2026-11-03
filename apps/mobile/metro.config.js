const { getDefaultConfig } = require('expo/metro-config');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// Bundle @pantry-mate/types from its TypeScript source, as the other dev tools do
config.resolver.unstable_conditionNames = [
    ...config.resolver.unstable_conditionNames,
    '@pantry-mate/source',
];

module.exports = config;
