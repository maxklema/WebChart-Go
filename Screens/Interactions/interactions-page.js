import React, { useState, useEffect } from "react";
import { Button, Text } from "react-native-paper";
import * as FileSystem from 'expo-file-system';
import { useFocusEffect } from "@react-navigation/native";
import mie from '@maxklema/mie-api-tools';
import { StyleSheet, View, ActivityIndicator } from "react-native";
import Container from "../../Components/Container";
import InputButton from "../../Components/inputButton";
import InteractionCell from "../../Components/interactionCell";

const InteractionsPage = () => {

    const [recentInteractions, setRecentInteractions] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useFocusEffect(
        React.useCallback(() => {
            const readInteractionsData = async () => {
                try {
                    console.log("HERE??");
                    setIsLoading(true);
                    const fileUri = FileSystem.documentDirectory + "interactions.json";

                    const fileInfo = await FileSystem.getInfoAsync(fileUri);
                        if (!fileInfo.exists) {
                        const initialContent = JSON.stringify({ });
                        await FileSystem.writeAsStringAsync(fileUri, initialContent);
                    } else {
                        let interactionsData = JSON.parse(await FileSystem.readAsStringAsync(fileUri));
                        parseInteractions(interactionsData);
                    }
                } catch (error) {
                    console.error('Error handling interactions file:', error);
                }
            };
        readInteractionsData();

        }, [mie.practice.value])
    );

    const parseInteractions = (interactionsData) => {
        interactionsData = interactionsData[mie.practice.value];

        // add file contents to state varaible
        let interactions = [];
        for (const interaction in interactionsData){
            interactions.push(interactionsData[interaction]);
        }

        setRecentInteractions(interactions.reverse());
    }

    useEffect(() => {
        if (recentInteractions){            
            
            // 10ms wait to load potential new interactions
            setTimeout(() => {
                setIsLoading(false);
            }, 10);
            
        }
    })

    const clearData = async () => {
        const fileUri = FileSystem.documentDirectory + "interactions.json";
        const interactionsData = JSON.parse(await FileSystem.readAsStringAsync(fileUri));
        delete interactionsData[mie.practice.value];
        await FileSystem.writeAsStringAsync(fileUri, JSON.stringify(interactionsData));
        setRecentInteractions([]);
    }

    if (isLoading){
        return (
            <View style={[styles.container, styles.horizontal]}>
                <ActivityIndicator/>
            </View>
        )
    } else {
        return (
            <Container style={styles}>
                <View style={styles.parent_container}>
    
                    {/* Recent Interactions */}
                    <View>
                        <View style={styles.recent_interactions_header}>
                            <Text style={styles.headerInteractions}>Recent Interactions</Text>
                            { recentInteractions.length > 0 ?
                                <InputButton onPress={clearData} text="Remove All" textStyle={ styles.removeAllButtonText} style={styles.removeAllButton}/>
                            : <></>}
                        </View>
                        <Text>{mie.practice.value}</Text>
                        { recentInteractions.length > 0 ? 
                            <View>
                                { recentInteractions?.map((interaction, index) => (
                                    <InteractionCell key={index} data={JSON.stringify(interaction)}/>
                                ))}
                            </View> :
                            <View style={styles.noData}>
                                <Text>You have no recent patient interactions. An interaction will appear when you contact a patient (SMS, Email, Call) through their WebChart.</Text>
                            </View> 
                        }
                    </View>
    
                </View>
            </Container>
        );
    }

    
};

const styles = StyleSheet.create({

    parent_container: {
        paddingHorizontal: '8%',
        paddingVertical: '5%',
    },
    headerInteractions: {
        fontSize: 19,
        fontWeight: '600',
        color: 'rgb(50,50,50)',
        marginTop: '2%'
    },
    recent_interactions_header: {
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'row',
    },
    removeAllButton: {
        backgroundColor: 'transparent',
        paddingVertical: 0,
        paddingHorizontal: 0,
        marginLeft: '3%',
        alignSelf: 'center',
    },
    removeAllButtonText: {
        color: 'rgb(100,100,100)',
        fontSize: 13,
        fontWeight: '400',
        textDecorationLine: 'underline'
    },
    noData: {
        width: '100%',
        backgroundColor: 'rgb(240,240,240)',
        marginTop: '3%',
        paddingHorizontal: '5%',
        paddingVertical: '3.5%',
        borderRadius: 12
    },
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

export default InteractionsPage;
