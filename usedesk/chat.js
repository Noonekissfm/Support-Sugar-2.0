window.setTimeout(createStatusesBlock, 1);
window.addEventListener('load', checkTheme)
window.setTimeout(switchStatus, 1000)
window.addEventListener('keydown', (e) => {
    hotKeys(e)
});




const state = {
    chats: [],
};

function checkTheme() {
    const theme = localStorage.getItem('usdk-theme'),
        bodyClassList = document.querySelector('body').classList;
    if (theme != null) {
        if (theme == 'dark') {
            bodyClassList.add('dark')
        } else {
            if (bodyClassList.contains('dark')) {
                bodyClassList.remove('dark')
            }
        }
    }
}

const getElement = async (path) => {
    return new Promise((resolve, reject) => {
        const count = 0;

        const intervalId = setInterval(() => {
            if (count === 50) {
                clearInterval(intervalId)
                return reject(new Error('getElement timeOut...'))
            }

            const element = document.querySelector(path)

            if (!element) {
                count++
                return
            }
            clearInterval(intervalId)
            return resolve(element)

        }, 50)
    })
}

const createElement = (element, className, id = '', innerText = '') => {
    const el = document.createElement(element);
    el.className = className;
    el.id = id;
    el.innerText = innerText;
    return el;
}

const removeCreateChatButton = async () => {
    const chatButton = await getElement('a[data-target="#create-chat-modal"]')
    chatButton.remove();
}

removeCreateChatButton()

const createAwaitButton = async () => {
    const rightButton = await getElement('.btn-group.btn-reply.close-dialog-bar');
    const INNER_TEXT = 'В ожидании';

    rightButton.insertAdjacentHTML('beforebegin', `<button class="btn btn-green--await" id="awaitButton" value="default" onclick="return closeDialog(this)" data-status-id="6" type="submit">${INNER_TEXT}</button>`);
}
createAwaitButton();

function createStatusesBlock() {
    const place = document.querySelector("#id__chat__actions-wrapper > div.mail-sidebar-row.hidden-xs.chat__checkbox-wrapper.ta-c.display-none")

    function createTimerPanel() {
        const panel = document.createElement('div');
        panel.className = 'timerPanel';
        return panel;
    }

    const panel = createTimerPanel()
    place.appendChild(panel)

    function createTimerButton(element, className, id, innerText, time) {
        const button = createElement(element, className, id, innerText)
        button.addEventListener('click', (e) => {
            const target = e.target;
            if (!localStorage.getItem('breakTimer')) {
                localStorage.setItem('breakTimer', Date.now() + (60000 * time))
                switchStatus();
                e.target.classList.add('timerButton_active');
                localStorage.setItem('activeButtonID', e.target.id)
                return
            }
            clearTimer('breakTimer', target, 'timerButton_active');
            localStorage.removeItem('breakTimer');
            localStorage.removeItem('activeButtonID');
        });
        panel.appendChild(button);
    }

    createTimerButton('button', 'timerButton', 'timer5', 'WC', 5)
    createTimerButton('button', 'timerButton', 'timer15', '15', 15)
    createTimerButton('button', 'timerButton', 'timer45', '45', 45)
}

function switchStatus() {
    const breakEnd = localStorage.getItem('breakTimer');
    if (!breakEnd) {
        return
    }

    const buttonId = localStorage.getItem('activeButtonID');
    const switcher = document.querySelector('.chat-status');

    if (buttonId) {
        document.querySelector(`#${buttonId}`).classList.add('timerButton_active')
    }

    if (switcher.hasAttribute('checked')) {
        switcher.click();
    }



    state.breakTimer = setInterval(() => {
        if (Date.now() >= breakEnd) {
            switcher.click();
            clearInterval(state.breakTimer)
            delete state.breakTimer
            document.querySelector('.timerButton_active').classList.remove('timerButton_active');
            localStorage.removeItem('breakTimer')
            localStorage.removeItem('activeButtonID')
            return
        }

    }, 1000)
    return
}

const getModalSiteInputAsync = async () => {
    const INTERVAL_MS = 50;
    const MAX_TIME_SEC = 10;

    return new Promise((resolve, reject) => {
        let count = 1;

        const timerId = setInterval(() => {
            const isLimitExceeded = (INTERVAL_MS * count) / 1000 > MAX_TIME_SEC

            if (isLimitExceeded) {
                clearInterval(timerId);
                reject(new Error('Limit exceeded - getModalSiteInputAsync'));
            }

            const modalIFrame = document.querySelector('.fancybox__iframe');

            if (!modalIFrame) {
                return;
            }

            const input = modalIFrame.contentWindow.document.querySelector('input[name="sites[url][]"]');

            if (input) {
                resolve(input);
                clearInterval(timerId);
            }
            count++;
        }, INTERVAL_MS)
    })
}

const generateLink = async () => {
    const name = String(document.querySelector('h3[class="client-h3"]').innerText).trim()
    return `http://crm.spb.play.dc/users/${name}/info`;
}

const insertLinkToModalInput = async () => {
    try {
        const input = await getModalSiteInputAsync();
        const link = await generateLink();
        input.value = link;
    } catch (error) {
        console.log(error);
    }
}

async function hotKeys(key) {

    if (key.code === 'F2') {

        const pencil = document.querySelector("#right_resize_container > div.panel.panel-primary.chat__client > div:nth-child(1) > div.text-center > h3 > a:nth-child(2)");
        pencil.click();
        insertLinkToModalInput();

    }

    if (key.code === 'F4') {
        const link = String(window.location.href)
        navigator.clipboard.writeText(`${link}`); //почему-то не вставляется ссылка в новой вкладке

        const name = String(document.querySelector('h3[class="client-h3"]').innerText).trim()
        window.open(`http://crm.spb.play.dc/users/${name}/info`);

    }

    if (key.code === 'Digit1' && key.altKey === true) {
        document.querySelector('#awaitButton').click();
    }
    if (key.code === 'Digit2' && key.altKey === true) {
        const names = document.querySelectorAll('.chat-message__name-of-responder')
        for (item of names) {
            item.classList.toggle('blur');
        }
    }
}

const clearTimer = (timerName, el, className) => {
    clearTimeout(state[timerName]);
    delete state[timerName];
    el.classList.remove(className)
}

const createToggleButton = async () => {
    const SECONDS = 10;
    const SIDEBAR = await getElement('.sidebar-menu');

    const toggleButton = createElement('button', 'toggleButton')

    SIDEBAR.append(toggleButton);

    toggleButton.addEventListener('click', () => {
        if (!SIDEBAR.classList.contains('toggle-menu')) {
            SIDEBAR.classList.add('toggle-menu');
            state.toggleTimer = setTimeout(() => {
                clearTimer('toggleTimer', SIDEBAR, 'toggle-menu')
                return;
            }, 1000 * SECONDS)
            return;
        }
        clearTimer('toggleTimer', SIDEBAR, 'toggle-menu')
        return;
    })
}
createToggleButton();

const getChatId = async () => {
    const chats = document.querySelectorAll("#collapseOne-3 > div > ul > li");
    state.chatId = [];
    for (item of chats) {
        state.chatId.push(item.dataset.chat);
    }
    
}

const getChats = async() => {
    for (let i = 0; i < state.chatId.length; i++) {
        fetch(`https://secure.usedesk.ru/v1/chat/getMessagesByChat?chat=${state.chatId[i]}`)
        .then(data => data.json())
        .then(resp => state.chats.push(resp));
    }
}

const run = async () => {
    await getChatId();
    await getChats();
}

const createCheckChatsButton = async () => {
    const place = await getElement('.mail-sidebar');
    const button = document.createElement('button');
    button.className = 'checkChatsButton';
    button.innerText = 'Чаты операторов';
    place.append(button);
}

createCheckChatsButton();

const createModal = () => {
    const modal = document.createElement('div');
    modal.innerHTML = `
    <div class=chats_modal>
        <div class=operator_card>
            <div class=card_container>
                <div class=operator_name></div>
                <div class=operator_chats>
                    <button id=chat_id>28745612</button>
                </div>
            </div>
        </div>
    </div>
    `
    document.body.append(modal);
}