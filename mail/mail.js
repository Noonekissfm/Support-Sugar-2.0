window.setTimeout(createStatusesBlock, 1);
window.setTimeout(switchStatus, 1000)

const state = {};

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
const getElements = async (path) => {
    return new Promise((resolve, reject) => {
        const count = 0;

        const intervalId = setInterval(() => {
            if (count === 50) {
                clearInterval(intervalId)
                return reject(new Error('getElements timeOut...'))
            }

            const elements = document.querySelectorAll(path)

            if (!elements) {
                count++
                return
            }
            clearInterval(intervalId)
            return resolve(elements)

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

const clearTimer = (timerName, el, className) => {
    clearTimeout(state[timerName]);
    delete state[timerName];
    el.classList.remove(className)
}

function createStatusesBlock() {
    const place = document.querySelector("#online-status")

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
    const switcher = document.querySelector('.ticket-online-status');

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

const createToggleButton = async () => {
    const SECONDS = 10;
    const sidebarMenu = await getElement('.sidebar-menu');

    const toggleButton = document.createElement('button');
    toggleButton.className = 'toggleButton';

    sidebarMenu.append(toggleButton);

    toggleButton.addEventListener('click', () => {
        sidebarMenu.classList.toggle('toggle-menu');
        if (sidebarMenu.classList.contains('toggle-menu')) {
            const timer = setTimeout(() => {
                sidebarMenu.classList.remove('toggle-menu')
                clearTimeout(timer)
            }, 1000 * SECONDS)
        }
        return
    })
}
createToggleButton();

const deleteFilters = async () => {
    const filters = await getElements('li[data-id]')

    for (item of filters) {
        if (item.dataset.id != '41522') {
            item.remove();
        }

    }
}

deleteFilters();

const deleteLists = async () => {
    const lists = await getElements('li[class="dropdown "]');
    for (item of lists) {
        item.classList.add('hide');
    }
}

deleteLists();

const showLists = () => {
    let flag = false;
    const button = document.createElement('button')
    button.innerText = 'Все фильтры';
    button.className = 'showListsButton';

    document.querySelector('.navbar-nav').append(button);

    button.addEventListener('click', () => {


        if (!flag) {
            const lists = document.querySelectorAll('li[class="dropdown hide"]');
            button.innerText = 'Скрыть';
            flag = true;
            for (item of lists) {
                item.classList.remove('hide');
            }
            return;
        }
        if (flag) {
            const lists = document.querySelectorAll('li[class="dropdown"]');
            button.innerText = 'Все фильтры';
            flag = false;
            for (item of lists) {
                item.classList.add('hide');
            }
        }

    })


}

showLists();

async function autoUpdate() {
    const MINUTES = 3;
    if (localStorage.getItem('autoUpdate') != 'true') {
        return
    }

    const button = await getElement('.autoUpdateButton');
    button.classList.add('autoUpdateButton_active')

    setTimeout(() => {
        location.reload();
    }, 60000 * MINUTES);
}

autoUpdate()

const createButton = () => {
    const place = document.querySelectorAll('.mail-sidebar-row')[1];
    const button = document.createElement('button');
    button.className = 'autoUpdateButton';
    button.innerText = 'Автообновление';
    button.addEventListener('click', () => {
        if (localStorage.getItem('autoUpdate') != 'true') {
            localStorage.setItem('autoUpdate', 'true')
            button.classList.add('autoUpdateButton_active')
            autoUpdate();
            return

        }
        localStorage.setItem('autoUpdate', 'false');
        button.classList.remove('autoUpdateButton_active');
        location.reload();
        return
    });

    place.append(button)
}

createButton();