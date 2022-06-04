const getElement = (selector) => new Promise ((resolve, reject) => {
    let count = 0;
    const timer = setInterval(() => {
        count++;
        const el = document.querySelector(selector);
        if (el) {
            clearInterval(timer);
            resolve(el);
        }
        if (count == 20000) {
            clearInterval(timer);
            reject('Timeout...'); 
        }
    }, 10);
});

const generalAppeal = async () => {
    const generalAppeal = await getElement('body > crm-app > div > clr-main-container > crm-app-header > clr-header > div.header-actions > a.nav-link.nav-text.add-comment');
    generalAppeal.addEventListener('click', prefAppeal);
}

const runSetup = async () => {
    const selector = await getElement('.ng-star-inserted > button');
    generalAppeal()
    if (selector) {
        return setup()
    }
};

setInterval(runSetup, 500);

async function prefAppeal() {
    const header = await getElement('div.modal-header');

    async function run() {
        await setChannel();
        await setOption('#issue_product_0', 'MOVIE');
        await actualIssue();
    }
    run();
     
    async function actualIssue() {
        const actualIssue = await getElement('label[for="is_actual_issue_0"]');
        actualIssue.parentNode.remove();

        const jiraTask = await getElement('label[for="jira_task"]');
        const inputText = await getElement('#jira_task');
        const btn = createElement('button', 'my-btn', '...');
        btn.classList.add('my-btn--payment');

        btn.addEventListener('click', (event) => {
            event.preventDefault();
            inputText.value = 'https://secure.usedesk.ru/tickets/НомерЗаявки';
        });

        jiraTask.parentNode.append(btn);
    }


    crtModalBtn('Возвр.БК', [['my-btn'], ['my-btn--payment']], [2, 44, 16, 25, 'ПЕРВЫЙ ВОЗВРАТ, ПОЛЬЗОВАТЕЛЯ ПРЕДУПРЕДИЛИ', '--']);
    crtModalBtn('Отмена.АП', [['my-btn'], ['my-btn--payment']], [7, 118, 68, 25, 'Отмена автопродления', '--']);
    crtModalBtn('Ош.При оплате с БК', [['my-btn'], ['my-btn--payment']], [3, 53, 27, 25, 'Смена ПС, Отвязка БК, Отмена транзации, Консультация', '--']);
    crtModalBtn('Изм.ПД', [['my-btn'], ['my-btn--data']], [1, 12, 4, 25, 'Изменение данных', '--']);
    crtModalBtn('Откл.Уст.', [['my-btn'], ['my-btn--data']], [1, 10, 10, 25, 'Отключение устройств', '--']);
    crtModalBtn('Удаление', [['my-btn'], ['my-btn--data']], [1, 14, 7, 25, 'Удаление', '--']);
    crtModalBtn('Мерж', [['my-btn'], ['my-btn--data']], [1, 13, 9, 25, 'Мерж профилей', '--']);
    crtModalBtn('Акции 306', [['my-btn']], [5, 80, 56, 25, '306 ошибка при активации промокода', '--']);
    crtModalBtn('Ош.Воспр.', [['my-btn']], [4, 64, 49, 25, 'Консультация', '--']);
    crtModalBtn('Клиент не ответил', [['my-btn']], [10, 132, 76, 25, 'Клиент не задал вопрос', '--']);
    crtModalBtn('Пожелание', [['my-btn']], [6, 100, 63, 25, '#Пожелание', 'WISH']);
    
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

const setup = async () => {
    const button = document.querySelectorAll('.ng-star-inserted button');
    const appeals = await getElement("#clr-tab-link-1");
    
    button[0].onclick = prefAppeal;
    appeals.onclick = setEventOnAppeals;
    button[1].onclick = createDeleteButton;
    
    
    async function createDeleteButton() {
        const element = await getElement('.modal-content-wrapper .modal-footer');
        const btn = createElement('div', 'delete-button', 'Удалить');
        btn.addEventListener('click', setupForDelete);
        element.prepend(btn);
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
            name: document.querySelector('#updateUser_dispalayName'),
            phone: document.querySelector('#updateUser_phone'),
            email: document.querySelector('#updateUser_mail'),
            gender: document.querySelector('#updateUser_gender'),
            birthDay: document.querySelector("#updateUser_birthday")
        },
        // buttons...
        buttons: {
            phone : document.querySelectorAll('.form-group button')[0],
            email : document.querySelectorAll('.form-group button')[1]
        }
    }

    const saveAdditionalInfo = (userValue) => { 
        let value, selector;
        
        if (userValue == user.phone) {
            value = 'phone',
            selector = 'div.form-group.ng-star-inserted > input[type="tel"]';
        } else {
            value = 'email',
            selector = 'div.form-group.ng-star-inserted > input[type="email"]';
        }
        
        user.buttons[value].click()
        const insertedInputs = document.querySelectorAll(selector)
        
        for (input of insertedInputs) {
            if (!input.value) {
                input.value = user[value];
                return 
            }
        }
    }
    const clearInputs = () => {
        try {
            document.querySelectorAll('.modal-dialog input')
            .forEach(item => {
                if (item.value && item.value == user.phone) {
                    saveAdditionalInfo(item.value)
                    dispatchEvent('input', item);
                }
                if (item.value && item.value == user.email) {
                    if (item.value.match(/delete/gi) != 'delete') {
                        saveAdditionalInfo(item.value)
                        
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
        channel.value = localStorage.getItem('appeal_channel');
        dispatchEvent('change', channel);
        channel.addEventListener('change', saveChannel);
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
    setTimeout(() => {
        const appeals = document.querySelectorAll('.btn.btn-sm.btn-link.ng-star-inserted');

        appeals.forEach(item => {
            item.addEventListener('click', prefAppeal);
        });
    }, 700);
}