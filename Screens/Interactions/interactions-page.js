import React from "react";
import { Button, Text } from "react-native-paper";
import * as FileSystem from 'expo-file-system';
import { useFocusEffect } from "@react-navigation/native";
import mie from '@maxklema/mie-api-tools';

const InteractionsPage = () => {
    useFocusEffect(
        React.useCallback(() => {
        const readInteractionsData = async () => {
                try {
                    const fileUri = FileSystem.documentDirectory + "interactions.json";
                    //console.log(fileUri);

                    // await FileSystem.deleteAsync(fileUri);

                    const fileInfo = await FileSystem.getInfoAsync(fileUri);
                        if (!fileInfo.exists) {
                        const initialContent = JSON.stringify({ });
                        await FileSystem.writeAsStringAsync(fileUri, initialContent);
                        console.log('Interactions.JSON created and written successfully');
                    } else {
                        const interactionsData = await FileSystem.readAsStringAsync(fileUri);
                        console.log("File Contents " + interactionsData);
                    }
            } catch (error) {
                console.error('Error handling interactions file:', error);
            }
        };

        readInteractionsData();

        }, [])
    );

    const clearData = async () => {
        const fileUri = FileSystem.documentDirectory + "interactions.json";
        const interactionsData = JSON.parse(await FileSystem.readAsStringAsync(fileUri));
        delete interactionsData[mie.practice.value];
        await FileSystem.writeAsStringAsync(fileUri, JSON.stringify(interactionsData));
    }

    return (
        <>
            <Text>Interactions</Text>
            <Button onPress={() => clearData()}>Clear Data</Button>
        </>
    );
};

export default InteractionsPage;
