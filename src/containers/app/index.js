import React, { useState, useEffect } from "react";
import { View, StyleSheet } from "react-native";
import { Toolbar } from "../../components/toolbar";
import { Footer } from "../../components/footer";
import { useDispatch } from "react-redux";
import { initializeWeb3 } from "../../actions/eth";
import { Swap } from "../../components/swap";
import { BottomTabs } from "../../components/bottom-tabs";

const styles = StyleSheet.create({
    outerContainer: {
        display: "flex",
        width: "100%",
        height: "100%",
        backgroundColor: "#333639",
    },
    contentContainer: { display: "flex", flex: 1 },
    tabContainer: {
        flex: 1,
        marginHorizontal: 16,
        marginTop: 16,
    },
    bottomTabsContainer: {
        marginBottom: 16,
        marginHorizontal: 16,
    },
});

export const App = () => {
    const dispatch = useDispatch();
    const [tabIndex, setTabIndex] = useState(0);

    useEffect(() => {
        dispatch(initializeWeb3());
    }, []);

    return (
        <View style={styles.outerContainer}>
            <Toolbar />
            <View style={styles.contentContainer}>
                <View style={styles.tabContainer}>
                    {tabIndex === 0 && <Swap />}
                </View>
                <Footer />
                <View style={styles.bottomTabsContainer}>
                    <BottomTabs
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
            </View>
        </View>
    );
};
