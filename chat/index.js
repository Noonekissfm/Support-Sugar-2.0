window.addEventListener('load', checkTheme);
// window.addEventListener('load', injectFonts);
window.setTimeout(createStatusesBlock, 1);
window.setTimeout(switchStatus, 1000);
window.addEventListener('keydown', (e) => {
    hotKeys(e);
});

const createBookmarkPanelButton = (url, text, target) => {
    const button = document.createElement('div')
    button.classList.add('bookmark__panel__button__container')
    button.innerHTML = `<a href='${url}' target='${target}'><button class='bookmark__panel__button'>${text}</button></a>`;
    return button
}

const dataForBookmarkPanel = [
    {
        url: 'https://ip.cdnvideo.ru/',
        target: '_blank',
        text: 'CDN Video',
    },
    {
        url: 'https://www.maxmind.com/en/geoip2-precision-demo',
        target: '_blank',
        text: 'MaxMind',
    },
    {
        url: 'https://docs.google.com/forms/d/e/1FAIpQLSdCXcneagBUCpCk52wVIZy0vQcveOU_gotoZ__9HjrO0nzZUQ/viewform',
        target: '_blank',
        text: 'Добавить контент',
    },
    {
        url: 'https://www.kinopoisk.ru/',
        target: '_blank',
        text: 'КиноПоиск',
    },
]

const bookmarkPanel = () => {
    const panel = document.createElement('div');
    panel.classList.add('bookmark__panel');

    const buttons = dataForBookmarkPanel.map(item => {
        return createBookmarkPanelButton(item.url, item.text, item.target)
    })

    panel.append(...buttons);

    document.querySelector('body').append(panel)
}

bookmarkPanel();


function injectFonts() {
    const head = document.querySelector('head');

    head.innerHTML += `
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link href="https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap" rel="stylesheet">
    `;
    return;
}

const state = {
    chats: [],
    chatsFlag: true,
};

function checkTheme() {
    const theme = localStorage.getItem('usdk-theme'),
        bodyClassList = document.querySelector('body').classList;
    if (theme == null) {
        return;
    }

    if (theme == 'dark') {
        bodyClassList.add('dark');
    } else {
        if (bodyClassList.contains('dark')) {
            bodyClassList.remove('dark');
        }
    }
}

const getElement = async (path) => {
    return new Promise((resolve, reject) => {
        const count = 0;

        const interval = setInterval(() => {
            if (count === 50) {
                clearInterval(interval);
                return reject(new Error('getElement timeout...'));
            }

            const element = document.querySelector(path);

            if (!element) {
                count++;
                return;
            }
            clearInterval(interval);
            return resolve(element);
        }, 50);
    });
};

const createElement = (element, className, id = '', innerText = '') => {
    const el = document.createElement(element);
    el.className = className;
    el.id = id;
    el.innerText = innerText;
    return el;
};

const removeCreateChatButton = async () => {
    const chatButton = await getElement('a[data-target="#create-chat-modal"]');
    chatButton.remove();
};

removeCreateChatButton();

const createAwaitButton = async () => {
    const rightButton = await getElement('.btn-group.btn-reply.close-dialog-bar');
    const INNER_TEXT = 'В ожидании';
    const ID = 'awaitButton';

    rightButton.insertAdjacentHTML(
        'beforebegin',
        `<button class="btn btn-green--await" id="${ID}" value="default" onclick="return closeDialog(this)" data-status-id="6" type="submit">${INNER_TEXT}</button>`
    );
};
createAwaitButton();

function createStatusesBlock() {
    const statusSwitcher = document.querySelector('#online-status-switch');

    function createTimerPanel() {
        const panel = document.createElement('div');
        panel.className = 'timerPanel';
        return panel;
    }

    const panel = createTimerPanel();
    statusSwitcher.parentNode.appendChild(panel);

    function createTimerButton(element, className, id, innerText, time) {
        const button = createElement(element, className, id, innerText);
        button.addEventListener('click', (e) => {
            const target = e.target;
            if (!localStorage.getItem('breakTimer')) {
                localStorage.setItem('breakTimer', Date.now() + 60000 * time);
                switchStatus();
                e.target.classList.add('timerButton_active');
                localStorage.setItem('activeButtonID', e.target.id);
                return;
            }
            clearTimer('breakTimer', target, 'timerButton_active');
            localStorage.removeItem('breakTimer');
            localStorage.removeItem('activeButtonID');
        });
        panel.appendChild(button);
    }

    createTimerButton('button', 'timerButton', 'timer5', 'WC', 5);
    createTimerButton('button', 'timerButton', 'timer15', '15', 15);
    createTimerButton('button', 'timerButton', 'timer45', '45', 45);
}

function switchStatus() {
    const breakEnd = localStorage.getItem('breakTimer');
    if (!breakEnd) {
        return;
    }

    const buttonId = localStorage.getItem('activeButtonID');
    const switcher = document.querySelector('.chat-status');

    if (buttonId) {
        document.querySelector(`#${buttonId}`).classList.add('timerButton_active');
    }

    if (switcher.hasAttribute('checked')) {
        switcher.click();
    }

    state.breakTimer = setInterval(() => {
        if (Date.now() >= breakEnd) {
            if (!switcher.checked) {
                switcher.click();
            }
            clearInterval(state.breakTimer);
            delete state.breakTimer;
            document.querySelector('.timerButton_active').classList.remove('timerButton_active');
            localStorage.removeItem('breakTimer');
            localStorage.removeItem('activeButtonID');
            return;
        }
    }, 1000);
}

const getModalSiteInputAsync = async () => {
    const INTERVAL_MS = 50;
    const MAX_TIME_SEC = 10;

    return new Promise((resolve, reject) => {
        let count = 1;

        const timerId = setInterval(() => {
            const isLimitExceeded = (INTERVAL_MS * count) / 1000 > MAX_TIME_SEC;

            if (isLimitExceeded) {
                clearInterval(timerId);
                reject(new Error('Limit exceeded - getModalSiteInputAsync'));
            }

            const modalIFrame = document.querySelector('.fancybox-iframe');

            if (!modalIFrame) {
                return;
            }

            const input = modalIFrame.contentWindow.document.querySelector('input[name="sites[url][]"]');

            if (input) {
                resolve(input);
                clearInterval(timerId);
            }
            count++;
        }, INTERVAL_MS);
    });
};

const getModalElement = async (modal, selectorPath) => {
    return new Promise((resolve, reject) => {
        let count = 0;

        const interval = setInterval(() => {
            if (count === 100) {
                clearInterval(interval);
                reject(new Error('timeout: element not found'));
            }
            const documentModal = document.querySelector(modal);

            if (!documentModal) {
                return;
            }

            const modalElement = documentModal.contentWindow.document.querySelector(selectorPath);

            if (modalElement) {
                clearInterval(interval);
                resolve(modalElement);
                return;
            }
            count++;
        }, 50);
    });
};

const getFancyboxContent = async () => {
    const fancybox = document.querySelector('.fancybox-iframe');

    const responseArr = await Promise.all([
        getModalElement('.fancybox-iframe', 'h3'),
        getModalElement('.fancybox-iframe', '#group_avatar'),
        getModalElement('.fancybox-iframe', 'div:nth-child(3)'),
        getModalElement('.fancybox-iframe', 'div:nth-child(4)'),
        getModalElement('.fancybox-iframe', 'div:nth-child(6)'),
        getModalElement('.fancybox-iframe', 'div:nth-child(9)'),
        getModalElement('.fancybox-iframe', '#form .row:nth-child(8)'),
        getModalElement('.fancybox-iframe', '#form .row:nth-child(9)'),
    ]);

    const helpBlocks = fancybox.contentWindow.document.querySelectorAll('.help-block');

    responseArr.forEach((item) => {
        if (item) {
            item.remove();
        }
    });

    helpBlocks.forEach((item) => {
        item.remove();
    });

    const divs = fancybox.contentWindow.document.querySelectorAll('#form > div.form-horizontal div');

    for (item of divs) {
        item.style.marginBottom = '0';
    }

    fancybox.style.height = '650px';
};

const generateLink = async () => {
    const name = String(document.querySelector('h3[class="client-h3"]').innerText).trim();
    return `http://crm.spb.play.dc/users/${name}/info`;
};

const insertLinkToModalInput = async () => {
    try {
        const input = await getModalSiteInputAsync();
        const link = await generateLink();
        if (!input.value) {
            input.value = link;
        }
    } catch (error) {
        console.log(error);
    }
};

async function hotKeys(key) {
    switch (key.code) {
        case 'F2':
            const pencil = document.querySelector('.entypo-pencil').parentElement;

            pencil.click();
            await getFancyboxContent();
            await insertLinkToModalInput();
            break;

        case 'F4':
            const name = String(document.querySelector('h3[class="client-h3"]').innerText).trim();
            window.open(`http://crm.spb.play.dc/users/${name}/info`);
            break;
    }

    if (key.code === 'Digit1' && key.altKey === true) {
        document.querySelector('#awaitButton').click();
    }
    if (key.code === 'Digit2' && key.altKey === true) {
        const names = document.querySelectorAll('.chat-message__name-of-responder');
        for (item of names) {
            item.classList.toggle('blur');
        }
    }
}

const clearTimer = (timerName, el, className) => {
    clearTimeout(state[timerName]);
    delete state[timerName];
    el.classList.remove(className);
};

const createToggleButton = async () => {
    const SECONDS = 10;
    const SIDEBAR = await getElement('.sidebar-menu');

    const toggleButton = createElement('button', 'toggleButton');

    SIDEBAR.append(toggleButton);

    toggleButton.addEventListener('click', () => {
        if (!SIDEBAR.classList.contains('toggle-menu')) {
            SIDEBAR.classList.add('toggle-menu');
            state.toggleTimer = setTimeout(() => {
                clearTimer('toggleTimer', SIDEBAR, 'toggle-menu');
                return;
            }, 1000 * SECONDS);
            return;
        }
        clearTimer('toggleTimer', SIDEBAR, 'toggle-menu');
        return;
    });
};
createToggleButton();

const getChatId = async () => {
    const chats = document.querySelectorAll('#collapseOne-3 > div > ul > li');
    const arr = [];
    for (item of chats) {
        arr.push(item.dataset.chat);
    }
    return arr;
};

const createUrl = (key) => {
    return `https://secure.usedesk.ru/v1/chat/getMessagesByChat?chat=${key}&skip=0&take=25`;
};

const getChats = async () => {
    const chatIdsArr = await getChatId();

    const responseArr = await Promise.all(await Promise.all(chatIdsArr.map((item) => fetch(createUrl(item)).then((res) => res.json()))));

    return responseArr;
};

const createModal = () => {
    const modal_backdrop = document.createElement('div');
    modal_backdrop.classList.add('modal_backdrop')
    modal_backdrop.addEventListener('click', (e)=>{
        if (e.currentTarget === modal_backdrop) {
            clearInterval(state.renewalDataTimer)
            delete state.renewalDataTimer;
            modal_backdrop.remove();
        } 
    })

    const modal_chats = document.createElement('div');
    modal_chats.classList.add('chats_modal');
    modal_chats.innerHTML = `
    <span class=chats_modal_loading>Загрузка данных...</span>
    `;
    modal_chats.addEventListener('click', (e) => e.stopPropagation())

    modal_backdrop.append(modal_chats)
    document.body.append(modal_backdrop);
};

const formateData = async () => {
    const modal = document.querySelector('.chats_modal');

    const data = await getChats();

    const names = new Set(data.map((item) => item.assignee_name));
    const namesArr = Array.from(names).sort();

    let newState = '<span class=chats_modal_loading>Нет активных чатов...</span>';

    if(namesArr.length > 0) {
        newState = '';
        for (let i = 0; i < namesArr.length; i++) {
            let chatsHTML = '';
            for (let j = 0; j < data.length; j++) {
                if (namesArr[i] === data[j].assignee_name) {
                    chatsHTML += `<a href="https://secure.usedesk.ru/tickets/${data[j].ticket_id}" target="_blank">
                        <button id=chat_id>
                            <span>${data[j].ticket_id}</span>
                        </button>
                    </a>`;
                }
            }
            const html = `
            <div class=operator_card>
                <div class=card_container>
                    <div class=operator_name>${namesArr[i]}</div>
                    <div class=operator_chats>${chatsHTML}</div>
                </div>
            </div>
            `;
    
            newState += html;
        }
    } 

    return modal.innerHTML = newState;
};

const createCheckChatsButton = async () => {
    const place = await getElement('#button_assign_next_chat');

    const button = document.createElement('button');
    button.className = 'checkChatsButton';
    button.innerText = 'Чаты операторов';
    place.parentElement.append(button);

    button.addEventListener('click', () => {
        const modal = document.querySelector('.chats_modal');

        if (!modal) {
            createModal();
            formateData();
            state.renewalDataTimer = setInterval(() => {
                formateData();
            }, 3000);
            return;
        }
        modal.remove();
    });
};

createCheckChatsButton();