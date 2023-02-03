const switchStatus = async () => {
    const breakEnd = localStorage.getItem('breakTimer');
    if (!breakEnd) return

    const buttonId = localStorage.getItem('activeButtonID');
    const switcher = await getElement('.chat-status');

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

const createTimerButton = (element, className, id, innerText, time) => {
    const button = createElement(element, className, innerText);
    button.id = id;
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

    return button
}

const createTimersBlock = async () => {
    const statusSwitcher = await getElement('#online-status-switch');
    if(!statusSwitcher) return

    const panel = createElement('div', ['timerPanel'])
    statusSwitcher.parentNode.appendChild(panel)

    const btnData = [
        {
            htmlTag: 'button',
            classNames: ['timerButton'],
            id: 'timer5',
            innerText: 'WC',
            time: 5,
        },
        {
            htmlTag: 'button',
            classNames: ['timerButton'],
            id: 'timer15',
            innerText: '15',
            time: 15,
        },
        {
            htmlTag: 'button',
            classNames: ['timerButton'],
            id: 'timer45',
            innerText: '45',
            time: 45,
        }
    ]
    const buttons = btnData.map(btn => createTimerButton(btn.htmlTag, btn.classNames, btn.id, btn.innerText, btn.time))
    panel.append(...buttons)
}