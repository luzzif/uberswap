const { getDefaultConfig } = require("metro-config");

module.exports = (async () => {
    const {
        resolver: { sourceExts, assetExts },
    } = await getDefaultConfig();
    return {
        transformer: {
            babelTransformerPath: require.resolve(
                "react-native-svg-transformer"
            ),
        },
        resolver: {
            assetExts: assetExts.filter((ext) => ext !== "svg"),
            sourceExts: [...sourceExts, "svg"],
            extraNodeModules: {
                ...require("node-libs-react-native"),
                vm: require.resolve("vm-browserify"),
            },
        },
    };
})();
