import React, { useState, useCallback } from "react";
import PropTypes from "prop-types";
import {
    Animated,
    TouchableWithoutFeedback,
    StyleSheet,
    Text,
} from "react-native";

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

export const Button = ({ title, onPress, disabled }) => {
    const [active, setActive] = useState(false);

    const handlePressIn = useCallback(() => {
        if (disabled) {
            return;
        }
        setActive(true);
    }, []);

    const handlePressOut = useCallback(() => {
        if (disabled) {
            return;
        }
        setActive(false);
    }, []);

    return (
        <TouchableWithoutFeedback
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            onPress={!disabled && onPress}
        >
            <Animated.View
                style={{
                    ...styles.container,
                    backgroundColor: active ? "#d240dd" : "#dc6be5",
                }}
            >
                <Text style={styles.text} numberOfLines={1}>
                    {title}
                </Text>
            </Animated.View>
        </TouchableWithoutFeedback>
    );
};

Button.propTypes = {
    title: PropTypes.string.isRequired,
    onPress: PropTypes.func,
    disabled: PropTypes.bool,
};
