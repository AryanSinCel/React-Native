const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');
const path = require('path');

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('@react-native/metro-config').MetroConfig}
 */
const config = {};

// Use a project-local cache directory to avoid permission issues
process.env.METRO_CACHE_DIR = path.join(__dirname, '.metro-cache');

module.exports = mergeConfig(getDefaultConfig(__dirname), config);
