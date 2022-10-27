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

            if (el) {
                clearInterval(timer);
                return resolve(el);
            }
            count++;
        }, 10);
    });

const getElements = async (selector) => {
    return new Promise((resolve, reject) => {
        let count = 0;

        const interval = setInterval(() => {
            if (count === 1000) {
                clearInterval(interval);
                return reject(new Error('getElements timeOut...'));
            }

            const elements = document.querySelectorAll(selector);

            if (!elements) {
                count++;
                return;
            }
            clearInterval(interval);
            return resolve(elements);
        }, 10);
    });
};

const setEventOnAddAppealButton = async () => {
    // set event on 'add appeal' button in main crm window
    const addAppealButton = await getElement('.nav-link.nav-text.add-comment');

    if (addAppealButton.innerText !== 'Добавить обращение') {
        return;
    }
    addAppealButton.addEventListener('click', prefAppeal);
};

setEventOnAddAppealButton();

async function createJiraTaskTemplateButton() {
    const jiraInput = await getElement('#jira_task');
    const btn = createElement('button', ['my-btn', 'my-btn--payment'], 'Шаблон ссылки');

    btn.addEventListener('click', (event) => {
        event.preventDefault();
        jiraInput.value = 'https://secure.usedesk.ru/tickets/НомерЗаявки';
    });

    jiraInput.parentNode.append(btn);
}

async function forceActualIssueCheckbox() {
    const actualIssue = await getElement('#is_actual_issue_0');
    if (!actualIssue.selectedIndex) {
        actualIssue.selectedIndex = 0;
        dispatchEvent('change', actualIssue);
    }
}

async function setCompleteStatusToIssue(isComplete) {
    const actualIssue = await getElement('#is_actual_issue_0');

    if(!actualIssue) return

    /**
     * There is yes === 0 and no === 1, that's why is boolean reversed below
     */

    actualIssue.selectedIndex = !+isComplete

    dispatchEvent('change', actualIssue)
}

async function setBaseSetup() {
    state.counter++
    try {
        await setAppealChannel();
        // set 'product' option to 'film'
        await setOption('#issue_product_0', 1);
        await forceActualIssueCheckbox();
        await createJiraTaskTemplateButton();
    } catch (err) {
        console.log(err);
    }
}

function createAutofillAppealButton(parent, value, classes, selectors, isComplete) {
    const btn = createElement('button', classes, value);

    btn.addEventListener('click', () => {
        fillAppeal(selectors);
        setCompleteStatusToIssue(isComplete);
    });

    parent.appendChild(btn);
}

function wrapperButtonsCreator(parent) {
    const buttonsConfig = [
        ['Возвр.БК', ['my-btn', 'my-btn--payment'], [2, 6, 1, 26], true],
        ['Возвр.ЛС', ['my-btn', 'my-btn--payment'], [2, 6, 2, 26], true],
        ['Неж.Спис.Конс', ['my-btn', 'my-btn--payment'], [2, 5, 9, 26, 'Консультация по списанию'], true],
        ['Неж.Спис.Мерж', ['my-btn', 'my-btn--payment'], [2, 7, 10, 26], true],
        ['Отмена.АП', ['my-btn', 'my-btn--payment'], [7, 3, 1, 26], true],
        ['Ош.Оплата БК', ['my-btn', 'my-btn--payment'], [3, 1, 2, 26], true],
        ['Опл.Спасибо', ['my-btn', 'my-btn--payment'], [3, 2, 2, 26], true],
        ['Изм.ПД', ['my-btn', 'my-btn--data'], [1, 19, 3, 26], true],
        ['Откл.Уст.', ['my-btn', 'my-btn--data'], [1, 20, 2, 26], true],
        ['Удаление', ['my-btn', 'my-btn--data'], [1, 3, 6, 26], true],
        ['Мерж', ['my-btn', 'my-btn--data'], [1, 2, 8, 26], true],
        ['Акции 306', ['my-btn'], [5, 5, 2, 26], true],
        ['Ош.Воспр.', ['my-btn'], [4, 10, 12, 26], true],
        ['Кл.Не ответил', ['my-btn'], [10, 1, 1, 26], false],
        ['Пожелание', ['my-btn'], [6, 6, 3, 26], true],
    ];

    for (item of buttonsConfig) {
        createAutofillAppealButton(parent, ...item);
    }
}

async function prefAppeal() {
    const header = await getElement('.modal-header--accessible .modal-title-wrapper');

    if (!document.querySelector('h3').innerText === 'Добавить обращение' || !document.querySelector('h3').innerText === 'Редактировать обращение') {
        return;
    }

    header.querySelector('h3').style.display = 'none';
    setBaseSetup();
    wrapperButtonsCreator(header);
}

async function createDeleteButton() {
    if(document.querySelector('button.delete-button')) {
        return
    }
    const element = await getElement('.modal-content-wrapper .modal-footer');
    const btn = createElement('button', ['delete-button'], 'Удалить');
    btn.addEventListener('click', setupForDelete);
    element.prepend(btn);
}

async function setOption(selectorPath, selector) {
    const el = await getElement(selectorPath);
    if (el && selector >= 1) {
        el.selectedIndex = selector;
        dispatchEvent('change', el);
        return;
    }
}
async function setDescription(selectorPath, selector) {
    try {
        const el = await getElement(selectorPath);
        if (!el) return

        el.value = selector;

        dispatchEvent('change', el)
    
        return 
    } catch (err) {
        console.log(err)
    }

}

const delay = (ms) => {
    return new Promise((res) => {
        setTimeout(() => {
            res();
        }, ms);
    });
};

async function fillAppeal(selectors) {
    try {
        await setOption('#issue_category_0', selectors[0]); // category..
        await delay(100);
        await setOption('#issue_root_cause_reason_0', selectors[1]); // reason..
        await delay(100);
        await setOption('#issue_actions_0', selectors[2]); // actions..
        await setOption('#issue_platform_0', selectors[3]); // platform..
        if (selectors[4]) {
            await setDescription('#issue_description_0', selectors[4]); // description..
        } 
    } catch (err) {
        console.log(err);
    }
}

const getAppealsButton = () => {
    const el = document.querySelectorAll('a');

    if (el[15].innerText === 'Обращения и Автокомментарии') {
        return el[15];
    } else {
        throw new Error('item not found...');
    }
};

async function setEventOnButtons() {
    const buttons = document.querySelectorAll('.ng-star-inserted button');
    for (item of buttons) {
        switch (item.innerText) {
            case 'ДОБАВИТЬ ОБРАЩЕНИЕ':
                if (!item.parentElement.classList.contains('modal-footer')) {
                    item.addEventListener('click', prefAppeal);
                }
                break;
            case 'РЕДАКТИРОВАТЬ ДАННЫЕ':
                item.addEventListener('click', createDeleteButton);
                break;
            default:
                break;
        }
    }
}

const setup = async () => {
    try {
        setEventOnButtons();
        const appealsButton = getAppealsButton();
        appealsButton.addEventListener('click', setupForAppealsPage);
    } catch (error) {
        console.log('Something went wrong...');
    }
};

async function setupForAppealsPage() {
    await forceRadioButton();
    await setEventOnEditAppealButton();
}

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
        user.ID = prompt('Не удалось найти номер счёта на странице, пожалуйста, введи его: ');
    } else {
        user.ID = id.children[1].innerText;
    }

    user.inputs.name.value = `delete${user.ID}`;
    user.inputs.email.value = `delete${user.ID}@okko.ru`;
    dispatchEvent('input', user.inputs.name);
    dispatchEvent('input', user.inputs.email);
}

async function setAppealChannel() {
    const channel = await getElement('#appeal_channel');
    if (channel) {
        if (!channel.value) {
            channel.value = localStorage.getItem('appeal_channel');
            dispatchEvent('change', channel);
            channel.addEventListener('change', saveAppealChannel);
        }
    } else {
        setAppealChannel();
    }
}

async function saveAppealChannel() {
    try {
        const channel = await getElement('#appeal_channel');
        localStorage.setItem('appeal_channel', channel.value);

        const element = createElement('span', ['channel-save'], 'Канал сохранен..');
        channel.parentNode.parentNode.append(element);
        setTimeout(() => {
            element.remove();
        }, 2000);
    } catch (err) {
        console.log(err);
    }
}

function createElement(htmlTag, classes, innerText) {
    const el = document.createElement(htmlTag);
    el.classList.add(...classes);
    el.innerText = innerText;

    if(el.tagName === 'BUTTON') {
        el.addEventListener('click', (event)=>{
            event.preventDefault();
        })
    }
    return el;
}

function dispatchEvent(event, element) {
    const e = new Event(event);
    element.dispatchEvent(e);
}

async function forceRadioButton() {
    const radioButtonsCollection = await getElements('input[type="radio"]');
    if (!radioButtonsCollection) {
        return
    }

    try {
        for(button of radioButtonsCollection) {
            if(button.nextElementSibling.innerText === 'Обращения') {
                button.click();
            }
        }
    } catch (error) {
        console.log(error)
    }
}

async function setEventOnEditAppealButton() {
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

    if (state.selector.innerText === 'ДОБАВИТЬ ОБРАЩЕНИЕ' && !state.selector.classList.contains('add-comment')) {
        delete state.selector;
        setup();
        return;
    }
};

setInterval(runSetup, 500);