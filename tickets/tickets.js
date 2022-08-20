

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

function createTimerPanel() {
    const switcher = document.querySelector('#online-status')
    const place = document.querySelector('#online-status')

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
        if (switcher.hasAttribute('checked')) {
            switcher.click();
        }

        setTimeout(() => {
            switcher.click();
            document.querySelector('.timerButton_active').classList.remove('timerButton_active');
        }, time * 60000)
    }

}

createTimerPanel();

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
        

        if(!flag) {
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
    console.log(localStorage.getItem('autoUpdate'))
    if (localStorage.getItem('autoUpdate') != 'true') {
        return
    }

    const button = await getElement('.autoUpdateButton');
    button.classList.add('autoUpdateButton_active')

    setTimeout(() => {
        location.reload();
    }, 5000)
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