import React, { useCallback } from "react";
import { View, StyleSheet, Text, Linking } from "react-native";

const styles = StyleSheet.create({
    container: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        height: 56,
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
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
            <Text
                style={{ ...styles.text, ...styles.marginRight }}
                onPress={handleAboutPress}
            >
                About
            </Text>
            <Text
                style={{ ...styles.text, ...styles.marginRight }}
                onPress={handleDocsPress}
            >
                Docs
            </Text>
        </View>
    );
};
