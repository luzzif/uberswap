import React from "react";
import PropTypes from "prop-types";
import { StyleSheet, Text, TouchableOpacity } from "react-native";

const styles = StyleSheet.create({
    container: {
        display: "flex",
        alignItems: "center",
        backgroundColor: "#dc6be5",
        paddingHorizontal: 32,
        paddingVertical: 16,
        borderRadius: 32,
    },
    text: {
        color: "#fff",
        fontFamily: "Inter",
        fontSize: 16,
    },
});

export const Button = ({ title, onPress, disabled }) => (
    <TouchableOpacity
        disabled={disabled}
        onPress={onPress}
        style={styles.container}
    >
        <Text style={styles.text} numberOfLines={1}>
            {title}
        </Text>
    </TouchableOpacity>
);

Button.propTypes = {
    title: PropTypes.string.isRequired,
    onPress: PropTypes.func,
    disabled: PropTypes.bool,
};
