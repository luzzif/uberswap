import React, { useLayoutEffect, useState } from "react";
import PropTypes from "prop-types";
import { View, StyleSheet, Text } from "react-native";

const styles = StyleSheet.create({
    container: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
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
    addressContainer: {
        paddingHorizontal: 12,
        paddingVertical: 4,
        backgroundColor: "rgb(32, 33, 36)",
        borderRadius: 24,
    },
    address: {
        fontFamily: "Inter",
        fontSize: 16,
        color: "#fff",
    },
});

export const Toolbar = ({ address }) => {
    const [parsedAddress, setParsedAddress] = useState("");

    useLayoutEffect(() => {
        if (address) {
            setParsedAddress(
                `${address.substring(0, 5)}...${address.substring(
                    address.length - 4
                )}`
            );
        }
    }, [address]);

    return (
        <View style={styles.container}>
            <Text style={styles.logo}>🦄 Uberswap</Text>
            {address && (
                <View style={styles.addressContainer}>
                    <Text style={styles.address}>{parsedAddress}</Text>
                </View>
            )}
        </View>
    );
};

Toolbar.propTypes = {
    address: PropTypes.string,
};
