import "node-libs-react-native/globals";
import { encode, decode } from "base-64";

if (!global.btoa) {
    global.btoa = encode;
}

if (!global.atob) {
    global.atob = decode;
}
