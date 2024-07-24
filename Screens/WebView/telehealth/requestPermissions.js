import { Camera } from 'expo-camera';

const requestTelehealthPermissions = () => {
    (async () => {
        try {
            const { status } = await Camera.requestCameraPermissionsAsync();
            if (status === "granted"){
                //do nothing
            } else {
                alert('Telehealth does not have video and audio permissions.');
            }
        } catch (e) {
            const { canAskAgain } = await Camera.requestPermissionsAsync();
            if (canAskAgain)
                Linking.openSettings();
        }
    })();
}

export default requestTelehealthPermissions;