const setupForDelete = () => {
    const user = {
        // values...
        phone: document.querySelector('#updateUser_phone').value,
        email: document.querySelector('#updateUser_mail').value,
        // inputs...
        inputs: {
            name: document.querySelector('#updateUser_displayName'),
            phone: document.querySelector('#updateUser_phone'),
            email: document.querySelector('#updateUser_mail'),
            gender: document.querySelector('#updateUser_gender'),
            birthDay: document.querySelector('#updateUser_birthday'),
        },
        // buttons...
        buttons: {
            phone: document.querySelectorAll('.modal-content button')[2],
            email: document.querySelectorAll('.modal-content button')[3],
        },
    };

    const saveAdditionalInfo = (userValue) => {
        let value, selector;

        if (userValue == user.phone) {
            (value = 'phone'), (selector = '.clr-input-wrapper > input[type="tel"]');
        } else {
            (value = 'email'), (selector = '.clr-input-wrapper input[type="email"]');
        }

        user.buttons[value].click();
        const insertedInputs = document.querySelectorAll(selector);

        for (input of insertedInputs) {
            if (!input.value) {
                input.value = user[value];
                dispatchEvent('input', input);
                return;
            }
        }
    };
    const clearInputs = () => {
        try {
            document.querySelectorAll('.modal-dialog input').forEach((item) => {
                if (item.value && item.value == user.phone) {
                    saveAdditionalInfo(item.value);
                }
                if (item.value && item.value == user.email) {
                    if (item.value.match(/delete/gi) != 'delete') {
                        saveAdditionalInfo(item.value);
                    }
                }
                if (user.inputs.gender.value) {
                    user.inputs.gender.value = 'Не указан'; // it's a "select", set to '' if it exists
                    dispatchEvent('change', user.inputs.gender);
                }
                if (user.inputs.birthDay.value) {
                    user.inputs.birthDay.value = '';
                    dispatchEvent('dateChanged', user.inputs.birthDay);
                }
                item.value = '';
                dispatchEvent('input', item);
            });
        } catch (err) {
            console.log(err);
        }
    };
    clearInputs();

    if (!!state.user?.id) {
        user.inputs.name.value = `delete${state.user.id}`;
        user.inputs.email.value = `delete${state.user.id}@okko.ru`;
    } else {
        showNotice(createNotice('Не найден номер счёта на странице'), 3);
    }

    dispatchEvent('input', user.inputs.name);
    dispatchEvent('input', user.inputs.email);
};

const createDeleteButton = async () => {
    if (document.querySelector('button.delete-button')) return;

    const place = await getElement('.modal-content-wrapper .modal-footer');
    const btn = createElement('button', ['delete-button'], 'Удалить');
    btn.addEventListener('click', (e) => {
        e.preventDefault();
        setupForDelete();
        e.target.disabled = true;
    });
    place.prepend(btn);
};
