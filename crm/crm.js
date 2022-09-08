const cssClasses = {
    TEXT_COMMENT: 'body > crm-app > div > clr-main-container > crm-users > div > crm-user-page > crm-user-detail > div > button:nth-child(1)'
}
const getElement = (selector) => new Promise ((resolve, reject) => {
    let count = 0;
    const timer = setInterval(() => {
        count++;
        const el = document.querySelector(selector);
        if (el) {
            clearInterval(timer);
            return resolve(el);
        }
        if (count == 1000) {
            clearInterval(timer);
            return 
        }
    }, 10);
});

// const generalAppeal = async () => {
//     const generalAppeal = await getElement(cssClasses.TEXT_COMMENT);
//     generalAppeal.addEventListener('click', prefAppeal);
// }

async function prefAppeal() {
    const header = await getElement('.modal-header--accessible .modal-title-wrapper');

    if (header.querySelector('h3').innerText !== 'Добавить обращение') {
        return
    }

    header.querySelector('h3').style.display = 'none';

    async function run() {
        await setChannel();
        await setOption('#issue_product_0', 'MOVIE');
        await actualIssue();
    }
    run();
     
    async function actualIssue() {
        const actualIssue = await getElement('#is_actual_issue_0');
        if (actualIssue.checked != true) {
            actualIssue.checked = true;
            dispatchEvent('change', actualIssue);    
        }


        const jiraTask = await getElement('label[for="jira_task"]');
        const inputText = await getElement('#jira_task');
        const btn = createElement('button', 'my-btn', '...');
        btn.classList.add('my-btn--payment');

        btn.addEventListener('click', (event) => {
            event.preventDefault();
            inputText.value = 'https://secure.usedesk.ru/tickets/НомерЗаявки';
        });

        inputText.parentNode.append(btn);
    }


    crtModalBtn('Возвр.БК', ['my-btn', 'my-btn--payment'], [2, 44, 16, 25, '', '--']);
    crtModalBtn('Возвр.ЛС', ['my-btn', 'my-btn--payment'], [2, 44, 17, 25, '', '--']);
    crtModalBtn('Неж.Списание', ['my-btn', 'my-btn--payment'], [2, 44, 25, 25, 'Консультация по списанию', '--']);
    crtModalBtn('Отмена.АП', ['my-btn', 'my-btn--payment'], [7, 118, 65, 25, '', '--']);
    crtModalBtn('Ош.При оплате с БК', ['my-btn', 'my-btn--payment'], [3, 53, 27, 25, '', '--']);
    crtModalBtn('Опл.Спасибо', ['my-btn', 'my-btn--payment'], [3, 49, 27, 25, '', 'SBER']);
    crtModalBtn('Изм.ПД', ['my-btn', 'my-btn--data'], [1, 142, 4, 25, '', '--']);
    crtModalBtn('Откл.Уст.', ['my-btn', 'my-btn--data'], [1, 143, 10, 25, '', '--']);
    crtModalBtn('Удаление', ['my-btn', 'my-btn--data'], [1, 14, 7, 25, 'Удаление', '--']);
    crtModalBtn('Мерж', ['my-btn', 'my-btn--data'], [1, 13, 9, 25, 'Мерж профилей', '--']);
    crtModalBtn('Акции 306', ['my-btn'], [5, 86, 56, 25, '', '--']);
    crtModalBtn('Ош.Воспр.', ['my-btn'], [4, 158, 49, 25, '', '--']);
    crtModalBtn('Клиент не ответил', ['my-btn'], [10, 132, 76, 25, '', '--']);
    crtModalBtn('Пожелание', ['my-btn'], [6, 100, 63, 25, '#Пожелание', 'WISH']);
    // crtModalBtn('Авария', ['my-btn', 'my-btn--accident'], [7, 117, 70, 25, '#Сбероптимум', 'SBER']);
    
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

async function fillAppeal(selectorPath) {
     try {
        await setOption('#issue_category_0', selectorPath[0]); // category..
        await setOption('#issue_root_cause_reason_0', selectorPath[1]); // reason..
        await setOption('#issue_actions_0', selectorPath[2]); // actions..
        await setOption('#issue_platform_0', selectorPath[3]); // platform..
        await setOption('#issue_description_0', selectorPath[4]); // description..
        await setOption('#issue_tags_0', selectorPath[5]); // description..
    } catch(err) {
        console.log(err)
    }
}
async function createDeleteButton() {
    const element = await getElement('.modal-content-wrapper .modal-footer');
    const btn = createElement('div', 'delete-button', 'Удалить');
    btn.addEventListener('click', setupForDelete);
    element.prepend(btn);
}

const appealsButton = () => {
    const el = document.querySelectorAll('a');

    if (el[15].innerText === 'Обращения') {
        return el[15]
    } else {
        throw new Error('item not found...')
    }
}

const setup = async () => {
    try {
        const button = document.querySelectorAll('.ng-star-inserted button');

        button[0].onclick = prefAppeal;
        button[1].onclick = createDeleteButton;

        const appeals = appealsButton();
        appeals.addEventListener('click', setEventOnAppeals);
        
    } catch (error) {
        console.log(error)
    }
}



function setupForDelete () {
    const user = {
        // values...
        ID: document.querySelector('.clr-col-lg-5 .table-vertical tr').children[1].innerText,
        phone: document.querySelector('#updateUser_phone').value,
        email: document.querySelector('#updateUser_mail').value,
        // inputs...
        inputs : {
            name: document.querySelector('#updateUser_displayName'),
            phone: document.querySelector('#updateUser_phone'),
            email: document.querySelector('#updateUser_mail'),
            gender: document.querySelector('#updateUser_gender'),
            birthDay: document.querySelector("#updateUser_birthday")
        },
        // buttons...
        buttons: {
            phone : document.querySelectorAll('.modal-content button')[2],
            email : document.querySelectorAll('.modal-content button')[3]
        }
    }

    const saveAdditionalInfo = (userValue) => { 
        let value, selector;
        
        if (userValue == user.phone) {
            value = 'phone',
            selector = '.clr-input-wrapper > input[type="tel"]';
        } else {
            value = 'email',
            selector = 'div.form-group.ng-star-inserted > input[type="email"]';
        }
        
        user.buttons[value].click()
        const insertedInputs = document.querySelectorAll(selector)
        
        for (input of insertedInputs) {
            if (!input.value) {
                input.value = user[value];
                dispatchEvent('input', input);
                return 
            }
        }
    }
    const clearInputs = () => {
        try {
            document.querySelectorAll('.modal-dialog input')
            .forEach(item => {
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
                    dispatchEvent('change', user.inputs.gender)
                }
                if (user.inputs.birthDay.value) {
                    user.inputs.birthDay.value = '';
                    dispatchEvent('dateChanged', user.inputs.birthDay)
                }
                item.value = '';
                dispatchEvent('input', item);
    
                
            })
        } catch(err) {
            console.log(err);
        }
    }
    clearInputs()
    
    user.inputs.name.value = `delete${user.ID}`;
    user.inputs.email.value = `delete${user.ID}@okko.ru`;
    dispatchEvent('input', user.inputs.name);
    dispatchEvent('input', user.inputs.email);
}

async function setOption(selectorPath, selector) {
    const el = await getElement(selectorPath);
    if(el) {
        el.value = selector;
        if (el.value == selector) {
            dispatchEvent('change', el);
            return
        } else {
            setOption(selectorPath, selector);
        }
    }
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
        }, 2000)
    } catch(err) {
        console.log(err)
    }
}

function createElement(tag, className, innerText) {
    const el = document.createElement(tag);
    el.classList.add(className);
    el.innerText = innerText;
    return el
}

function dispatchEvent(event, element) {
    const e = new Event(event);
    element.dispatchEvent(e);
}

function setEventOnAppeals() {
    const timer = setTimeout(() => {
        const appeals = document.querySelectorAll('.btn.btn-sm.btn-link.ng-star-inserted');

        if (!appeals) {
            clearTimeout(timer);
            setEventOnAppeals();
            return;
        }

        for (item of appeals) {
            item.addEventListener('click', prefAppeal);
            item.
        }

    }, 700);
}

const runSetup = async () => {
    const selector = await getElement('.ng-star-inserted > button');

    if (selector) {
        setup();
        return 
    }
};

setInterval(runSetup, 500);