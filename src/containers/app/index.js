import React, { useState, useEffect } from "react";
import { View, StyleSheet } from "react-native";
import { Toolbar } from "../../components/toolbar";
import { useDispatch, useSelector } from "react-redux";
import { initializeWeb3, getTokenBalances } from "../../actions/eth";
import { Swap } from "../../components/swap";
import { Tabs } from "../../components/tabs";

const styles = StyleSheet.create({
    outerContainer: {
        display: "flex",
        width: "100%",
        height: "100%",
        backgroundColor: "rgb(51, 54, 57)",
    },
    contentContainer: {
        display: "flex",
        justifyContent: "center",
        flex: 1,
    },
    tabContainer: {
        marginHorizontal: 16,
        display: "flex",
    },
    bottomTabsContainer: {
        marginHorizontal: 16,
        marginBottom: 16,
    },
    toolbarContainer: {
        position: "absolute",
        width: "100%",
    },
});

export const App = () => {
    const dispatch = useDispatch();
    const selectedAddress = useSelector((state) => state.eth.selectedAddress);

    const [tabIndex, setTabIndex] = useState(0);

    useEffect(() => {
        dispatch(initializeWeb3());
    }, []);

    useEffect(() => {
        if (selectedAddress) {
            dispatch(getTokenBalances(selectedAddress));
        }
    }, [selectedAddress]);

    return (
        <View style={styles.outerContainer}>
            <View style={styles.toolbarContainer}>
                <Toolbar address={selectedAddress} />
            </View>
            <View style={styles.contentContainer}>
                <View style={styles.bottomTabsContainer}>
                    <Tabs
                        items={[
                            {
                                key: "swap",
                                title: "Swap",
                            },
                            {
                                key: "send",
                                title: "Send",
                                disabled: true,
                            },
                            {
                                key: "pool",
                                title: "Pool",
                                disabled: true,
                            },
                        ]}
                        index={tabIndex}
                        onChange={setTabIndex}
                    />
                </View>
                <View style={styles.tabContainer}>
                    {tabIndex === 0 && <Swap />}
                </View>
            </View>
            <View style={styles.bottomSpacer} />
        </View>
    );
};
