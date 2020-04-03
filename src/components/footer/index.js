import React, { useCallback } from "react";
import {
    View,
    StyleSheet,
    Text,
    Linking,
    TouchableOpacity,
} from "react-native";

const styles = StyleSheet.create({
    container: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        height: 56,
    },
    text: {
        fontFamily: "Inter",
        color: "#dc6be5",
        fontSize: 16,
    },
    marginRight: {
        marginRight: 12,
    },
});

export const Footer = () => {
    const handleAboutPress = useCallback(() => {
        Linking.openURL("https://uniswap.org/");
    }, []);

    const handleDocsPress = useCallback(() => {
        Linking.openURL("https://docs.uniswap.io/");
    }, []);

    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={handleAboutPress}>
                <Text style={{ ...styles.text, ...styles.marginRight }}>
                    About
                </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleDocsPress}>
                <Text style={styles.text}>Docs</Text>
            </TouchableOpacity>
        </View>
    );
};
