import env, { setInputSource } from "@mondora/env";
import config from "react-native-config";

setInputSource(config);

export const PROVIDER_URL = env("PROVIDER_URL", { required: true });

export const NETWORK_ID = env("NETWORK_ID", {
    required: true,
    parse: parseInt,
});
