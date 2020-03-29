import React from "react";
import { View, StyleSheet, Text } from "react-native";

const styles = StyleSheet.create({
    container: {
        display: "flex",
        justifyContent: "center",
        width: "100%",
        height: 56,
        paddingHorizontal: 16,
        paddingVertical: 16,
    },
    logo: {
        fontFamily: "Inter",
        color: "#dc6be5",
        fontSize: 16,
    },
});

export const Toolbar = () => (
    <View style={styles.container}>
        <Text style={styles.logo}>🦄 Uberswap</Text>
    </View>
);
