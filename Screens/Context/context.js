import React, { createContext, useState, useEffect } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { View, ActivityIndicator, StyleSheet} from "react-native";

export const SettingsContext = createContext();

export const SettingsProvider = ({children}) => {

    const [toggleWCLaunch, setToggleWCLaunch] = useState('');
    const [toggleWVNav, setToggleWVNav] = useState('');
    const [isToggled, setIsToggled] = useState({
        'automatic_wc_launch': toggleWCLaunch,
        'webview_bottom_navbar': toggleWVNav
    });

    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {

        async function getSettings() {

            const toggleAutomaticWCLaunch = await AsyncStorage.getItem('automatic_wc_launch');
            const toggleWebViewBottomNav = await AsyncStorage.getItem('webview_bottom_navbar');

            if (toggleAutomaticWCLaunch) {
                var isTrueSet = (toggleAutomaticWCLaunch === 'true');
                setToggleWCLaunch(isTrueSet);
    
            } else {
                await AsyncStorage.setItem('automatic_wc_launch', 'true')
                setToggleWCLaunch(true);
            }

            if (toggleWebViewBottomNav) {
                var isTrueSet = (toggleWebViewBottomNav === 'true');
                setToggleWVNav(isTrueSet);
            } else {
                await AsyncStorage.setItem('webview_bottom_navbar', 'true')
                setToggleWVNav(true);
            }

            setIsLoading(false);
        }
    
        getSettings();

    }, []);

    useEffect(() => {
        if (toggleWCLaunch !== '' && toggleWVNav !== '') {
            setIsToggled((prevSettings) => ({
                ...prevSettings,
                'automatic_wc_launch': toggleWCLaunch,
                'webview_bottom_navbar': toggleWVNav
            }));
        }
    }, [toggleWCLaunch, toggleWVNav]);

    if (isLoading) {
        return (
            <View style={[styles.container, styles.horizontal]}>
                <ActivityIndicator/>
            </View>
        )
    }

    return (
        <SettingsContext.Provider value={{ isToggled, setIsToggled }}>
            { children }
        </SettingsContext.Provider>
    )
    
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center'
    },
    horizontal: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        padding: 10,
    },
})