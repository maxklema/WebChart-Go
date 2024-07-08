import React, { useCallback, useState } from "react";
import { 
    StyleSheet,
    RefreshControl,
    ScrollView,
    View,
    Image,
    Text
} from "react-native";
import { useFocusEffect } from '@react-navigation/native';
import DataTable from "../../Components/table/table";
import mie from '@maxklema/mie-api-tools';


const Profile = ({navigation}) => {

    let basic_demographics;

    let tableData = [];

    const [refreshing, setRefreshing] = useState(false);
    const [loading, setLoading] = useState(true);
    const [patName, setPatName] = useState([]);
    const [demographicData, setDemographicData] = useState([]);
    const [basicData, setBasicData] = useState([]);
    const [locationData, setLocationData] = useState([]);
    const [userData, setUserData] = useState([]);

    useFocusEffect(
        React.useCallback(() => {
            console.log('Details screen is focused');

            getPatientInfo();

        }, [])
    );

    const getPatientInfo = async () => {
        await getData();
        basic_demographics = await mie.retrieveRecord('patients', [], {pat_id: mie.User_PatID.value})
        DemographicData(basic_demographics);
    }

    const DemographicData = (basic_demographics) => {
        if (basic_demographics){

            setDemographicData([
                ['Sex', `${basic_demographics['db'][0]['sex']}`],
                ['Marital Status', `${basic_demographics['db'][0]['marital_status']}`],
                ['Spouse Name', `${basic_demographics['db'][0]['spouse_name']}`],
                ['Spouse Birth Date', `${basic_demographics['db'][0]['spouse_birthdate']}`],
                ['Emergency Contact', `${basic_demographics['db'][0]['emergency_contact']}`],
                ['Emergency Phone', `${basic_demographics['db'][0]['emergency_phone']}`],
            ]);

            setBasicData([
                ['Email', `${basic_demographics['db'][0]['email']}`],
                ['Cell Phone', `${basic_demographics['db'][0]['cell_phone']}`],
                ['Fax Number', `${basic_demographics['db'][0]['fax_number']}`],
            ]);

            setLocationData([
                ['Address One', `${basic_demographics['db'][0]['address1']}`],
                ['Address Two', `${basic_demographics['db'][0]['address2']}`],
                ['Address Three', `${basic_demographics['db'][0]['address3']}`],
                ['Zip Code', `${basic_demographics['db'][0]['zip_code']}`],
                ['City', `${basic_demographics['db'][0]['city']}`],
                ['County', `${basic_demographics['db'][0]['county']}`],
                ['State', `${basic_demographics['db'][0]['state']}`],
                ['Country', `${basic_demographics['db'][0]['country']}`],                    
            ]);

            setUserData([
                ['Status', basic_demographics['db'][0]['active'] == 1 ? 'Active' : 'Inactive'],
                ['Username', `${basic_demographics['db'][0]['username']}`],
                ['Patient ID', `${basic_demographics['db'][0]['pat_id']}`],
                ['Last Edit', `${basic_demographics['db'][0]['edit_date']}`],
            ]);
            
            const nameParts = [];
            basic_demographics['db'][0]['title'] != '' ? nameParts.push(basic_demographics['db'][0]['title']) : {} ;
            nameParts.push(basic_demographics['db'][0]['first_name']);
            nameParts.push(basic_demographics['db'][0]['last_name'])
            basic_demographics['db'][0]['title'] != '' ? nameParts.push(basic_demographics['db'][0]['suffix']) : {} ;

            setPatName(nameParts);

            setLoading(false);
        }
    }

    async function getData(){
        
        let JSON_data;
        JSON_data = await mie.retrieveRecord("patients", ["pat_id"], { username: mie.username.value });
        console.log("COokie: " + mie.Cookie.value);
        console.log("Pat_ID " + mie.User_PatID.value);
        mie.User_PatID.value = `${JSON_data['0']['pat_id']}`;

    }

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        
    }, []);

    const MainContainer = ({ children }) => {
        return (
            <ScrollView 
                style={styles.kbContainer}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={getPatientInfo}/>
                }
            >
                {React.Children.map(children, (child) => 
                    React.cloneElement(child, {
                        style: [styles.child, child.props.style],
                    })
                )}
            </ScrollView>
        );
    }


    return (
        <MainContainer>
            <Image 
                source={require('./../../assets/profile-default.jpg')}
                style={ styles.wc_pic }
            />
            <View style={ styles.wc_name }>
                {patName.map((text, index) => (
                    <Text key={index} style={styles.wc_name_text}>{text}</Text>
                ))}
            </View>
            <DataTable data={demographicData} style={styles.child}></DataTable>
            <View />
            <DataTable data={basicData} style={styles.child}></DataTable>
            <View />
            <DataTable data={locationData}></DataTable>
            <View />
            <DataTable data={userData}></DataTable>
            <View />
        </MainContainer>
    );
}

const styles = StyleSheet.create({
    kbContainer: {
      flex: 1,
      paddingHorizontal: '7%',
      paddingVertical: '5%',
      
    },
    child: {
        marginBottom: '8%',
    },
    wc_pic: {
        alignSelf: 'center',
        height: 70,
        width: 70,
        borderRadius: '100%',
        resizeMode: 'contain'
    },
    wc_name: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        fontSize: 30,
        flexWrap: 'wrap',
    },
    wc_name_text: {
        fontSize: 30,
        fontWeight: '600',
        marginRight: '2%'
    }
   
  });

export default Profile;