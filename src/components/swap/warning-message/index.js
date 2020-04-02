import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Text, StyleSheet, View } from "react-native";

const styles = StyleSheet.create({
    outerContainer: {
        display: "flex",
        alignItems: "center",
    },
    text: {
        fontFamily: "Inter",
    },
});

export const WarningMessage = ({
    originToken,
    destinationToken,
    originAmount,
    destinationAmount,
}) => {
    const [warningMessage, setWarningMessage] = useState("");
    const [error, setError] = useState(false);

    useEffect(() => {
        if (!originToken || !destinationToken) {
            setWarningMessage("Select a token to continue");
            setError(false);
            return;
        }
        if (
            !originAmount ||
            originAmount === "0" ||
            !destinationAmount ||
            destinationAmount === "0"
        ) {
            setWarningMessage("Enter a value to continue");
            setError(false);
            return;
        }
        setWarningMessage("No Ethereum wallet found");
        setError(true);
    }, [originToken, originAmount, destinationToken, destinationAmount]);

    return (
        <View style={styles.outerContainer}>
            <Text
                style={{
                    ...styles.text,
                    color: error ? "rgb(255, 104, 113)" : "rgb(196, 196, 196)",
                }}
            >
                {warningMessage}
            </Text>
        </View>
    );
};

WarningMessage.propTypes = {
    originToken: PropTypes.object,
    destinationToken: PropTypes.object,
    originAmount: PropTypes.string,
    destinationAmount: PropTypes.string,
};
