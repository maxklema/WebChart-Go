import mie from '@maxklema/mie-api-tools-lite';

const getPhoneNumbers = async (patID) => {

    const fields = ["work_phone", "home_phone", "cell_phone", "emergency_phone"]
    const numbers = await mie.retrieveRecord("patients", fields, { pat_id: patID })
    
    delete numbers['0']['pat_id'];

    //parses numbers for only ones that are not blank
    for (number in numbers['0']){
        if (numbers['0'][number] == "")
            delete numbers['0'][number];
    }
    
    return numbers['0'];
}

export default getPhoneNumbers;