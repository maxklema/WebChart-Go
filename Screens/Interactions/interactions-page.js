import React, { useEffect, useState } from "react";
import { Text } from "react-native-paper";
import * as FileSystem from 'expo-file-system';
import { useFocusEffect } from "@react-navigation/native";
import mie from '@maxklema/mie-api-tools';
import { StyleSheet, View } from "react-native";
import Container from "../../Components/Container";
import InteractionCell from "../../Components/Cells/interactionCell";
import ValidateSession from "../../Components/validateSession";
import InputButton from "../../Components/inputButton";

const InteractionsPage = () => {

    const [recentInteractions, setRecentInteractions] = useState([]);
    const [interactionsToLoad, setInteractionsToLoad] = useState(0);
    const [displayLoadMoreButton, setDisplayLoadMoreButton] = useState(true);
    const [interactionsData, setInteractionsData] = useState([]);
    const multiple = 2;

    useFocusEffect(
        React.useCallback(() => {
            const readInteractionsData = async () => {
        
                // Load Interactions Data
                const fileUri = FileSystem.documentDirectory + "interactions.json";
                let interactionsRaw = JSON.parse(await FileSystem.readAsStringAsync(fileUri));
                parseInteractions(interactionsRaw);
                
            };
        readInteractionsData();

        }, [mie.practice.value])
    );

    useEffect(() => {

        const interactionKeys = Object.keys(interactionsData);
        updateRecentInterations(interactionKeys, multiple);

        if (interactionKeys.length > interactionsToLoad && interactionKeys.length <= multiple){
            setInteractionsToLoad(interactionKeys.length);
            setDisplayLoadMoreButton(false);
        } else if (interactionsToLoad == 0 && interactionKeys.length > multiple) {
            setInteractionsToLoad(multiple);
            setDisplayLoadMoreButton(true);
        } else if (interactionKeys.length > interactionsToLoad && interactionKeys.length > multiple) {
            setDisplayLoadMoreButton(true);
        }

    }, [interactionsData])

    useEffect(() => {}, [interactionsToLoad, setDisplayLoadMoreButton, recentInteractions]);

    const parseInteractions = (interactionsRaw) => {
        if (interactionsData.length == 0 && interactionsRaw[mie.practice.value] != null){
            setInteractionsData(interactionsRaw[mie.practice.value]);
        } else {
            const interactionKeys = Object.keys(interactionsData);

            if (interactionKeys.length > interactionsToLoad && interactionKeys.length <= multiple){
                setInteractionsToLoad(interactionKeys.length);
                setDisplayLoadMoreButton(false);
            } else if (interactionsToLoad == 0 && interactionKeys.length > multiple) {
                setInteractionsToLoad(multiple);
                setDisplayLoadMoreButton(true);
            } else if (interactionKeys.length > interactionsToLoad && interactionKeys.length > multiple) {
                setDisplayLoadMoreButton(true);
            }

        }
    }

    const updateRecentInterations = (interactionKeys, amount) => {

        console.log(interactionKeys.slice(2,3));
        console.log("INTERACTIONS TO LOAD " + interactionsToLoad);
        console.log("AMOUNT: " + amount);
        const nextKeySet = interactionKeys.slice(interactionsToLoad, interactionsToLoad + amount);
        console.log(nextKeySet);
        let interactions = recentInteractions;

        nextKeySet.forEach(key => {
            interactions.unshift(interactionsData[key]); //push value to front of array
        })

        console.log(interactions);

        setRecentInteractions(interactions);

    }

    const clearData = async () => {
        const fileUri = FileSystem.documentDirectory + "interactions.json";
        const interactionsData = JSON.parse(await FileSystem.readAsStringAsync(fileUri));
        delete interactionsData[mie.practice.value];
        await FileSystem.writeAsStringAsync(fileUri, JSON.stringify(interactionsData));
        setRecentInteractions([]);
        setInteractionsToLoad(0);
        setDisplayLoadMoreButton(false);
    }

    const loadMoreInteractions = () => {
        
        const interactionKeys = Object.keys(interactionsData);

        if ((interactionsToLoad + multiple) < interactionKeys.length){
            updateRecentInterations(interactionKeys, multiple);
            setInteractionsToLoad(prev => prev + multiple);
        } else {
            let interactionsLeft = interactionKeys.length - interactionsToLoad
            updateRecentInterations(interactionKeys, interactionsLeft);

            setInteractionsToLoad(prev => prev + interactionsLeft);
            setDisplayLoadMoreButton(false);
        }
        

    }

    return (
        <Container style={styles}>
            <View style={styles.parent_container}>

                {/* Recent Interactions */}
                <ValidateSession data={recentInteractions} header={"Recent Interactions"} clearData={clearData}>
                    <>
                        { recentInteractions.length > 0 ? 
                            <View>
                                { recentInteractions.slice(0, interactionsToLoad)?.map((interaction, index) => (
                                    <InteractionCell key={index} data={JSON.stringify(interaction)}/>
                                ))}
                                { displayLoadMoreButton ? 
                                    <InputButton 
                                        text="Load More Interactions"
                                        style={styles.loadMoreInteractionsButton}
                                        textStyle={styles.interactionsButtonText}
                                        onPress={ () => loadMoreInteractions() }
                                    />: 
                                    <></>
                                }

                            </View> :
                            <View style={styles.noData}>
                                <Text>You have no recent patient interactions. An interaction will appear when you contact a patient (SMS, Email, Call) through their WebChart.</Text>
                            </View> 
                        }
                    </>
                </ValidateSession>                       

            </View>
        </Container>
    );

}

const styles = StyleSheet.create({
    parent_container: {
        paddingHorizontal: '8%',
        paddingVertical: '5%',
        flex: 1
    },
    noData: {
        width: '100%',
        backgroundColor: 'rgb(240,240,240)',
        marginTop: '3%',
        paddingHorizontal: '5%',
        paddingVertical: '3.5%',
        borderRadius: 12
    },
    loadMoreInteractionsButton: {
        marginTop: '10%',
        backgroundColor: '#D65B27',
        width: 250,
        alignSelf: 'center',
        padding: 0,
    },
    interactionsButtonText: {
        color: '#fff',
        textAlign: 'center',
        fontSize: 16,
        
    }

})

export default InteractionsPage;
