import * as Contacts from 'expo-contacts';

const formatContacts = async (patInfo, contact_id) => {
    
    let contact = {};
    let emails = [];
    let phones = [];
    let addresses = [];
    const contact_fields = {
        "first_name": [Contacts.Fields.FirstName],
        "last_name": [Contacts.Fields.LastName],
        "middle_name": [Contacts.Fields.MiddleName],
        "title": [Contacts.Fields.Prefix],
        "suffix": [Contacts.Fields.Suffix],
        "email": [],
        "home_phone": [],
        "cell_phone": [],
        "emergency_phone": [],
        "work_phone": [],
        "birth_date": "",
        "address1": "",
        "address2": "",
        "address3": ""
    }

    for (const key in contact_fields){
        switch(true) {
            case key == "email":
                let email = {
                    email: patInfo[0][key],
                    label: "Email"
                }
                if (patInfo[0][key] != "")
                    emails.push(email)
                contact[Contacts.Fields.Emails] = emails;
                continue;
            case key.endsWith("phone"):
                let phone = {
                    number: patInfo[0][key],
                    "label": key.substring(0,key.indexOf("_"))
                }
                if (patInfo[0][key] != "")
                    phones.push(phone);
                contact[Contacts.Fields.PhoneNumbers] = phones;
                continue;
            case key == "birth_date":
                let raw_birthday = patInfo[0][key];
                const birth_year = parseInt(raw_birthday.substring(0,4));
                const birth_month = parseInt(raw_birthday.substring(5,7));
                const birth_day = parseInt(raw_birthday.substring(8,10));

                contact[Contacts.Fields.Birthday] =  { 
                    day: birth_day,
                    month: birth_month-1, 
                    year: birth_year 
                }
                continue;
            case key.startsWith("address"):
                let address = {
                    label: key,
                    street: patInfo[0][key]
                }

                if (patInfo[0][key] != "")
                    addresses.push(address);
                contact[Contacts.Fields.Addresses] = addresses;
                continue;
            default:
                contact[contact_fields[key]] = patInfo[0][key];
                continue;
        }
    }

    // contact[[Contacts.Fields.JobTitle]] = "Unknown Position";

    if (contact_id != ''){
        const contact_exists = await Contacts.getContactByIdAsync(contact_id);
        if (contact_exists) {
            contact['id'] = contact_id;
            await Contacts.presentFormAsync(contact_id);
            return contact_id;
        } else {
            const contactID = await Contacts.addContactAsync(contact);
            return contactID;
        }
    } else {
        const contactId = await Contacts.addContactAsync(contact);
        return contactId;
    }
}

export default formatContacts;