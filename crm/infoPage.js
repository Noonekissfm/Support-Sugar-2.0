const hideContactByMask = (contact, type) => {
    let text;

    if (type === 'email') {
        const emailName = contact.split('@')[0];
        const maskedContact = [];

        if (emailName.length >= 6) {
            for (let i = 0; i < 2; i++) {
                maskedContact.push(emailName[i]);
            }
            for (let i = 0; i < 3; i++) {
                maskedContact.push('*');
            }
            for (let i = emailName.length - 2; i < emailName.length; i++) {
                maskedContact.push(emailName[i]);
            }
        }

        if (emailName.length < 6) {
            for (let i = 0; i < 1; i++) {
                maskedContact.push(emailName[i]);
            }
            for (let i = 0; i < 3; i++) {
                maskedContact.push('*');
            }
            for (let i = emailName.length - 1; i < emailName.length; i++) {
                maskedContact.push(emailName[i]);
            }
        }
        text = maskedContact.join('') + `@${contact.split('@')[1]}`;
    }

    if (type === 'phone') {
        const phone = contact.split('');
        const maskedPhone = [];

        for (let i = 0; i < 4; i++) {
            maskedPhone.push(phone[i]);
        }
        for (let i = 0; i < 5; i++) {
            maskedPhone.push('*');
        }
        for (let i = phone.length - 2; i < phone.length; i++) {
            maskedPhone.push(phone[i]);
        }
        text = maskedPhone.join('');
    }

    return text;
};

const placeMaskedContactToContactField = async (type) => {
    const text = type === 'phone' ? 'Телефон' : 'Email';
    let targetField = await getElementFromCrmTable(text);
    const contactText = targetField.innerText;

    if (contactText === '') return;

    const maskedContact = hideContactByMask(contactText, type);

    const className = [`${type}--masked`]

    const el = createElement('p', className, maskedContact)
    targetField.appendChild(el);
}

const saveAccountIdToState = async () => {
    const accountIdField = await getElementFromCrmTable('Номер счета');
    const accountId = accountIdField.innerText;
    state.user = {
        ...state.user,
        id: accountId,
    }
}

const setupForInfoPage = async () => {
    if (state.flags.infoFlag) return
    state.flags = {
        ...state.flags,
        infoFlag: true,
    };

    try {
        await Promise.all([
            placeMaskedContactToContactField('phone'),
            placeMaskedContactToContactField('email'),
            saveAccountIdToState(),
        ])
    } catch (error) {
        console.log(error);
    }
};