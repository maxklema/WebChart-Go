import { Camera } from 'expo-camera';
import { logError } from '../../../Components/logError';

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
            logError(`ERROR: ${e}`)
            const { canAskAgain } = await Camera.requestPermissionsAsync();
            if (canAskAgain)
                Linking.openSettings();
        }
    })();
}

export default requestTelehealthPermissions;