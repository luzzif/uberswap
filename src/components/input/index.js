import React from "react";
import PropTypes from "prop-types";
import { TextInput, View, Text, StyleSheet } from "react-native";

const styles = StyleSheet.create({
    root: {
        height: 36,
        display: "flex",
        justifyContent: "center",
        paddingLeft: 16,
        borderWidth: 1,
        borderColor: "rgb(51, 51, 51)",
        borderRadius: 24,
    },
    text: {
        fontFamily: "Inter",
        fontSize: 12,
        color: "#FFF",
        padding: 0,
    },
    label: {
        fontFamily: "Inter",
        fontSize: 12,
        color: "#FFF",
        marginBottom: 8,
    },
});

export const Input = ({ label, ...rest }) => (
    <>
        {label && <Text style={styles.label}>{label}</Text>}
        <View style={styles.root}>
            <TextInput
                {...rest}
                style={styles.text}
                placeholderTextColor="#808080"
            />
        </View>
    </>
);

Input.propTypes = {
    label: PropTypes.string,
};
