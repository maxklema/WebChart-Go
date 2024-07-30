import React from 'react';
import { View, Text, StyleSheet, Dimensions, Image, ImageBackground } from 'react-native';
import SwiperFlatList from 'react-native-swiper-flatlist';
import InputButton from '../../Components/Inputs/inputButton';

import handWaveGraphic from '../../Assets/Landing Graphics/handWave-graphic.png';
import contactsGraphic from '../../Assets/Landing Graphics/contacts-graphic.png';
import cameraGraphic from '../../Assets/Landing Graphics/camera-graphic.png';
import saveGraphic from '../../Assets/Landing Graphics/save-graphic.png';
import readyGraphic from '../../Assets/Landing Graphics/ready-graphic.png';

const Orientation = ({ navigation }) => {

    const goToLanding = () => {
        navigation.navigate("Back");
    }

    const screenGraphics = [handWaveGraphic, contactsGraphic, cameraGraphic, saveGraphic, readyGraphic];
    const screenHeaders = ["Welcome to WebChart Go", "Contact Patients with Ease", "Enjoy WebChart TeleHealth™", "Save Labs and Documents", "Ready to get Started?"];
    const screenSubHeaders = ["We're glad you are here", "No more memorizing phone numbers", "Video calls without your computer", "To anywhere on your device", "Enter your WebChart handle next"];
    const regularText = ["WebChart Go leverages mobile capabilities to enhance your user experience.", "With WebChart Go, you can add patients to your contacts in one click. There are also options in a patient's chart for calling, messaging, and emailing them.", "WebChart Go brings a clean WebChart TeleHealth™ experience, a low-cost simple way for providers to connect with patients without having to install any software.", "Need to save an important document or lab? WebChart Go lets you save these files right to your device.", ""];

    return (
        <View style={styles.container}>
            <SwiperFlatList
                loop
                showPagination
                paginationStyle={styles.dotContainer}
                paginationStyleItem={styles.dot}
                paginationStyleItemActive={styles.dotActive}
            >
                {screenGraphics.map((graphic, index) => (
                    <ImageBackground key={index} style={styles.child} source={require("../../Assets/Landing Graphics/background-graphic.png")}>
                        <View style={styles.contentContainer}>
                            <Image style={styles.graphic} source={graphic} />
                            <View style={styles.textContent}>
                                <Text style={styles.header}>{screenHeaders[index]}</Text>
                                <Text style={styles.subHeader}>{screenSubHeaders[index]}</Text>
                                <Text style={[styles.regular, { marginTop: '10%' }]}>{regularText[index]}</Text>
                            </View>
                            { index != screenGraphics.length - 1 ?
                                <InputButton onPress={goToLanding} style={styles.button} text="Skip" /> : 
                                <InputButton onPress={goToLanding} style={styles.button} text="Let's Go!" />
                            }
                            
                        </View>
                    </ImageBackground>
                ))}
            </SwiperFlatList>
        </View>
    );
};

const { width } = Dimensions.get('window');
const styles = StyleSheet.create({
    container: { 
        flex: 1, 
        backgroundColor: 'white',
    },
    regular: {
        fontSize: 16,
        fontWeight: '500',
        textAlign: 'center',
        justifyContent: 'center',
        alignItems: 'center',
    },
    header: {
        fontSize: 24,
        fontWeight: '700',
        textAlign: 'center',
        justifyContent: 'center',
        alignItems: 'center',
    },
    subHeader: {
        fontSize: 18,
        fontWeight: '500',
        textAlign: 'center',
        justifyContent: 'center',
        alignItems: 'center',
    },
    child: { 
        width, 
        paddingHorizontal: '8%',
        display: 'flex',
        alignContent: 'center',
        justifyContent: 'center'
    },
    text: { 
        fontSize: width * 0.5, 
        textAlign: 'center' 
    },
    dotContainer: {
        bottom: '5%'
        
    },
    dot: {
        backgroundColor: '#fff',
        width: 10,
        height: 10,
    },
    dotActive: {
        backgroundColor: '#D65B27'
    },
    button: {
        maxWidths: '40%',
        alignSelf: 'center',
    },
    continueButton: {
        width: '37%',
        alignSelf: 'center',
    },
    graphic: {
        alignSelf: 'center',
        marginBottom: '5%',
        height: 140,
        width: 140,
        borderRadius: 10,
    },
    textContent: {
        backgroundColor: '#fff',
        padding: '3%',
        borderRadius: 20
    },
    contentContainer: {
        height: '72%',
        display: 'flex',
        alignContent: 'center',
        justifyContent: 'space-between'
    }
});

export default Orientation;
