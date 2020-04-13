const { getDefaultConfig } = require("metro-config");
const extraNodeModules = require("node-libs-react-native");

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
                ...extraNodeModules,
                vm: require.resolve("node-libs-react-native/mock/vm"),
            },
        },
    };
})();
