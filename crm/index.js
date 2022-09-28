const state = {
    counter: 0,
};

const getElement = (selector) =>
    new Promise((resolve) => {
        let count = 0;

        const timer = setInterval(() => {
            if (count == 1000) {
                clearInterval(timer);
                return;
            }

            const el = document.querySelector(selector);

            if (el && el === document.querySelector(selector)) {
                clearInterval(timer);
                return resolve(el);
            }

            count++;
        }, 10);
    });

const getMultiLevelThreeElement = (selector) =>
    new Promise((resolve) => {
        let count = 0;

        const timer = setInterval(() => {
            if (count == 1000) {
                clearInterval(timer);
                return;
            }

            const el = document.querySelector(selector);

            if (el && el.children.length > 1) {
                clearInterval(timer);
                return resolve(el);
            }

            count++;
        }, 10);
    });

const getElements = async (selector) => {
    return new Promise((resolve, reject) => {
        const count = 0;

        const intervalId = setInterval(() => {
            if (count === 1000) {
                clearInterval(intervalId);
                return reject(new Error('getElements timeOut...'));
            }

            const elements = document.querySelectorAll(selector);

            if (!elements) {
                count++;
                return;
            }
            clearInterval(intervalId);
            return resolve(elements);
        }, 10);
    });
};

const generalAppeal = async () => {
    const addAppealButton = await getElement('.nav-link.nav-text.add-comment');

    if (addAppealButton.innerText !== 'Добавить обращение') {
        return;
    }

    addAppealButton.addEventListener('click', prefAppeal);
};

generalAppeal();

async function prefAppeal() {
    const header = await getElement('.modal-header--accessible .modal-title-wrapper');

    if (!document.querySelector('h3').innerText === 'Добавить обращение' || !document.querySelector('h3').innerText === 'Редактировать обращение') {
        return;
    }

    header.querySelector('h3').style.display = 'none';

    async function run() {
        await setChannel();
        await setOption('#issue_product_0', 1);
        await actualIssue();
    }
    run();

    async function actualIssue() {
        const actualIssue = await getElement('#is_actual_issue_0');
        if (actualIssue.checked != true) {
            actualIssue.checked = true;
            dispatchEvent('change', actualIssue);
        }

        const inputText = await getElement('#jira_task');
        const btn = createElement('button', 'my-btn', '...');
        btn.classList.add('my-btn--payment');

        btn.addEventListener('click', (event) => {
            event.preventDefault();
            inputText.value = 'https://secure.usedesk.ru/tickets/НомерЗаявки';
        });

        inputText.parentNode.append(btn);
    }

    crtModalBtn('Возвр.БК', ['my-btn', 'my-btn--payment'], [2, 5, 1, 26]);
    crtModalBtn('Возвр.ЛС', ['my-btn', 'my-btn--payment'], [2, 5, 2, 26]);
    crtModalBtn('Неж.Спис.Конс', ['my-btn', 'my-btn--payment'], [2, 5, 9, 26]);
    crtModalBtn('Неж.Спис.Мерж', ['my-btn', 'my-btn--payment'], [2, 7, 10, 26]);
    crtModalBtn('Отмена.АП', ['my-btn', 'my-btn--payment'], [7, 3, 3, 26]);
    crtModalBtn('Ош.Оплата БК', ['my-btn', 'my-btn--payment'], [3, 1, 2, 26]);
    crtModalBtn('Опл.Спасибо', ['my-btn', 'my-btn--payment'], [3, 2, 2, 26]);

    crtModalBtn('Изм.ПД', ['my-btn', 'my-btn--data'], [1, 19, 3, 26]);
    crtModalBtn('Откл.Уст.', ['my-btn', 'my-btn--data'], [1, 20, 2, 26]);
    crtModalBtn('Удаление', ['my-btn', 'my-btn--data'], [1, 3, 6, 26]);
    crtModalBtn('Мерж', ['my-btn', 'my-btn--data'], [1, 2, 8, 26]);

    crtModalBtn('Акции 306', ['my-btn'], [5, 5, 2, 26]);
    crtModalBtn('Ош.Воспр.', ['my-btn'], [4, 10, 12, 26]);
    crtModalBtn('Кл.Не ответил', ['my-btn'], [10, 1, 1, 26]);
    crtModalBtn('Пожелание', ['my-btn'], [6, 6, 3, 26]);

    // crtModalBtn('Авария', ['my-btn', 'my-btn--accident'], [7, 117, 70, 26, '#Сбероптимум', 'SBER']);

    function crtModalBtn(value, [first, second = 'no-extra'], selectorPath) {
        const btn = createElement('button', first, value);
        btn.classList.add(second);

        btn.addEventListener('click', (event) => {
            event.preventDefault();
            fillAppeal(selectorPath);
        });

        header.appendChild(btn);
    }
}

async function createDeleteButton() {
    const element = await getElement('.modal-content-wrapper .modal-footer');
    const btn = createElement('div', 'delete-button', 'Удалить');
    btn.addEventListener('click', setupForDelete);
    element.prepend(btn);
}

async function setOption(selectorPath, selector) {
    const el = await getMultiLevelThreeElement(selectorPath);
    if (el && selector >= 1) {
        el.selectedIndex = selector;
        dispatchEvent('change', el);
        return;
    }
}

async function fillAppeal(selectorPath) {
    const time = 100;
    const delay = (ms) => {
        return new Promise(res => {
            setTimeout(()=>{
                res()
            }, ms)
        })

    }

    try {
        await setOption('#issue_category_0', selectorPath[0]); // category..
        await delay(time)
        await setOption('#issue_root_cause_reason_0', selectorPath[1]); // reason..
        await delay(time)
        await setOption('#issue_actions_0', selectorPath[2]); // actions..
        await setOption('#issue_platform_0', selectorPath[3]); // platform..
        await setOption('#issue_description_0', selectorPath[4] = ''); // description..

        //setOption('#issue_tags_0', (selectorPath[5] = 0)), // tag..
    } catch (err) {
        console.log(err);
    }
}
const appealsButton = () => {
    const el = document.querySelectorAll('a');

    if (el[15].innerText === 'Обращения и Автокомментарии') {
        return el[15];
    } else {
        throw new Error('item not found...');
    }
};

const setup = async () => {
    try {
        const buttons = document.querySelectorAll('.ng-star-inserted button');

        for (item of buttons) {
            switch (item.innerText) {
                case 'ДОБАВИТЬ ОБРАЩЕНИЕ':
                    item.addEventListener('click', prefAppeal);
                    break;
                case 'РЕДАКТИРОВАТЬ ДАННЫЕ':
                    item.addEventListener('click', createDeleteButton);
                    break;
                default:
                    break;
            }
        }

        const appeals = appealsButton();
        appeals.addEventListener('click', setEventOnAppeals);
    } catch (error) {
        console.log('Something went wrong...');
    }
};

function setupForDelete() {
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

    const id = document.querySelector('.clr-col-lg-5 .table-vertical tr');

    if (!id) {
        user.ID = prompt('Не удалось найти номер счёта на странице, пожалуйста введи его: ');
    } else {
        user.ID = id.children[1].innerText;
    }

    user.inputs.name.value = `delete${user.ID}`;
    user.inputs.email.value = `delete${user.ID}@okko.ru`;
    dispatchEvent('input', user.inputs.name);
    dispatchEvent('input', user.inputs.email);
}

async function setChannel() {
    const channel = await getElement('#appeal_channel');
    if (channel) {
        if (!channel.value) {
            channel.value = localStorage.getItem('appeal_channel');
            dispatchEvent('change', channel);
            channel.addEventListener('change', saveChannel);
        }
    } else {
        setChannel();
    }
}

async function saveChannel() {
    try {
        const channel = await getElement('#appeal_channel');
        localStorage.setItem('appeal_channel', channel.value);

        const element = createElement('span', 'channel-save', 'Канал сохранен..');
        channel.parentNode.parentNode.append(element);
        setTimeout(() => {
            element.remove();
        }, 2000);
    } catch (err) {
        console.log(err);
    }
}

function createElement(tag, className, innerText) {
    const el = document.createElement(tag);
    el.classList.add(className);
    el.innerText = innerText;
    return el;
}

function dispatchEvent(event, element) {
    const e = new Event(event);
    element.dispatchEvent(e);
}

async function setEventOnAppeals() {
    const radio = await getElements('input[type="radio"]');

    if (radio) {
        if (radio[1].nextElementSibling.innerText === 'Обращения') {
            radio[1].click();
        }
    }

    const timer = setTimeout(() => {
        const appeals = document.querySelectorAll('.card-footer button.ng-star-inserted');
        if (appeals.length === 0) {
            return;
        }

        for (item of appeals) {
            if (item.innerText === 'РЕДАКТИРОВАТЬ') {
                item.addEventListener('click', prefAppeal);
            }
        }
        clearTimeout(timer);
        return;
    }, 1000);
}

const runSetup = async () => {
    state.selector = await getElement('.ng-star-inserted > button');

    if (state.selector.innerText === 'ДОБАВИТЬ ОБРАЩЕНИЕ') {
        delete state.selector;
        setup();
        return;
    }
};

setInterval(runSetup, 500);
