import React, { createContext, useState, useEffect } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { View, ActivityIndicator, StyleSheet} from "react-native";

export const SettingsContext = createContext();

export const SettingsProvider = ({children}) => {

    const [toggleWCLaunch, setToggleWCLaunch] = useState('');
    const [isToggled, setIsToggled] = useState(toggleWCLaunch);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {

        async function getSettings() {

            const toggleAutomaticWCLaunch = await AsyncStorage.getItem('wc-automatic-launch');
    
            if (toggleAutomaticWCLaunch) {
                let option = await AsyncStorage.getItem('wc-automatic-launch')
                var isTrueSet = (option === 'true');
                setToggleWCLaunch(isTrueSet);
    
            } else {
                await AsyncStorage.setItem('wc-automatic-launch', 'true')
                setToggleWCLaunch(true);
            }
            setIsLoading(false);
        }
    
        getSettings();

    }, []);

    useEffect(() => {
        if (toggleWCLaunch !== '') {
            setIsToggled(toggleWCLaunch);
        }
    }, [toggleWCLaunch]);

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