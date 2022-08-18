window.setTimeout(createTimerPanel, 1);
window.addEventListener('load', checkTheme)
window.addEventListener('keydown', (e) => {
    hotKeys(e)
});

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

const addElements = async () => {
    const createNewChatBtn = await getElement('a[data-target="#create-chat-modal"]')
    createNewChatBtn.remove();
}

addElements()

const createAwaitButton = async () => {
    const rightButton = await getElement('.btn-group.btn-reply.close-dialog-bar');

    const innerText = 'В ожидании';
    rightButton.insertAdjacentHTML('beforebegin', `<button class="btn btn-green--await" id="awaitButton" value="default" onclick="return closeDialog(this)" data-status-id="6" type="submit">${innerText}</button>`);
}
createAwaitButton();

function createTimerPanel() {
    const switcher = document.querySelector('.chat-status')
    const place = document.querySelector("#id__chat__actions-wrapper > div.mail-sidebar-row.hidden-xs.chat__checkbox-wrapper.ta-c.display-none")

    const panel = document.createElement('div');
    panel.className = 'timerPanel';
    place.appendChild(panel)

    function createTimerButton(id, innerText, time) {
        const button = document.createElement('button');
        button.className = 'timerButton';
        button.id = id;
        button.innerText = innerText;
        button.addEventListener('click', (e) => {
            switchStatus(time);
            e.target.classList.add('timerButton_active');
        });
        panel.appendChild(button);
    }

    createTimerButton('timer_5', 'WC', 5)
    createTimerButton('timer_15', '15', 15)
    createTimerButton('timer_45', '45', 45)


    function switchStatus(time) {
        switcher.click();

        setTimeout(() => {
            switcher.click();
            document.querySelector('.timerButton_active').classList.remove('timerButton_active');
        }, time * 60000)
    }

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

const createToggleButton = async () => {
    const SECONDS = 10;
    const sidebarMenu = await getElement('.sidebar-menu');

    const toggleButton = document.createElement('button');
    toggleButton.className = 'toggleButton';

    sidebarMenu.append(toggleButton);

    toggleButton.addEventListener('click', () => {
        sidebarMenu.classList.toggle('toggle-menu');
        if (sidebarMenu.classList.contains('toggle-menu')) {
            const timer = setTimeout(()=>{
                sidebarMenu.classList.remove('toggle-menu')
                clearTimeout(timer)
            }, 1000 * SECONDS)
        }
        return
    })
}
createToggleButton();

const autoDeployMyChats = async () => {
    const CHATS = await getElement('.member-my-title');

    const timer = setTimeout(() => {
        if (CHATS.classList.contains('collapsed')) {
            clearTimeout(timer);
            CHATS.click();
            return
        }
        clearTimeout(timer);
        return
    }, 2000)
}
autoDeployMyChats();
