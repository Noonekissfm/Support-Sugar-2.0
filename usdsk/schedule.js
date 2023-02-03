const saveSchedule = (modal) => {
    const workTimeInput = modal.querySelector('#workTime');
    const firstBreakInput = modal.querySelector('#firstBreak');
    const dinnerInput = modal.querySelector('#dinner');
    const secondBreakInput = modal.querySelector('#secondBreak');
    const lastBreakInput = modal.querySelector('#lastBreak');
    const breaks = [`${firstBreakInput.value} - 15`, `${dinnerInput.value} - 45`, `${secondBreakInput.value} - 15`, `${lastBreakInput.value} - 15`];
    const workTime = workTimeInput.value;
    const schedule = {
        breaks: breaks,
        workTime: workTime,
    };
    localStorage.setItem('SS_schedule', JSON.stringify(schedule));
};

const createScheduleModal = () => {
    const schedule = JSON.parse(localStorage.getItem('SS_schedule'))
    const modalBackdrop = createElement('div', ['scheduleModal_backdrop']);
    const modal = createElement('div', ['scheduleModal']);
    const saveScheduleButton = createElement('button', ['saveScheduleButton'], 'Сохранить');

    modal.addEventListener('click', (e) => e.stopPropagation());

    const html = `
        <h2>Настройка отображения перерывов</h2>
        <ul>
            <li>
                <span>Время работы: </span>
                <input type="text" id="workTime" value="${!!schedule && schedule.workTime}" placeholder="чч-чч">
            </li>
            <li>
                <span>Начало 1 перерыва в: </span>
                <input type="text" id="firstBreak" value="${!!schedule && schedule.breaks[0].split(' - ')[0]}" placeholder="чч:мм">
            </li>
            <li>
                <span>Начало обеда в: </span>
                <input type="text" id="dinner" value="${!!schedule && schedule.breaks[1].split(' - ')[0]}" placeholder="чч:мм">
            </li>
            <li>
                <span>Начало 2 перерыва в: </span>
                <input type="text" id="secondBreak" value="${!!schedule && schedule.breaks[2].split(' - ')[0]}" placeholder="чч:мм">
            </li>
            <li>
                <span>Начало 3 перерыва в: </span>
                <input type="text" id="lastBreak" value="${!!schedule && schedule.breaks[3].split(' - ')[0]}" placeholder="чч:мм">
            </li>
        </ul>
    `;
    modal.innerHTML = html;
    modalBackdrop.addEventListener('click', () => {
        modalBackdrop.remove();
    });

    saveScheduleButton.addEventListener('click', () => {
        saveSchedule(modal);
        modalBackdrop.remove();
        window.location.reload();
    });

    modal.append(saveScheduleButton);
    modalBackdrop.append(modal);
    return modalBackdrop;
};

const createScheduleMenu = async () => {
    const sidebar = await getElement('#main-menu');
    const scheduleButton = createElement('button', ['scheduleSettings'], 'SS');
    sidebar.append(scheduleButton);

    scheduleButton.addEventListener('click', () => {
        const modal = createScheduleModal();
        document.querySelector('body').append(modal);
    });
};

const updateSchedule = () => {
    const date = new Date();
    const hour = date.getHours();
    const el = document.querySelector('.schedule > span');

    const startWork = state.schedule.workTime.split('-')[0];
    const endWork = state.schedule.workTime.split('-')[1];

    if (hour < startWork || hour >= endWork) {
        if (ticker) {
            clearInterval(ticker);
        }
        return;
    }

    for (let i = 0; i < state.schedule.breaks.length; i++) {
        const breakHour = state.schedule.breaks[i].split(':')[0];
        const difference = Number(breakHour) - Number(hour);
        if (difference <= 2 && difference >= 1) {
            el.innerText = state.schedule.breaks[i];
            el.classList.add('next');
        }
        if (+hour == Number(breakHour)) {
            el.classList.remove('next');
            el.classList.add('current');
            return el.innerText = state.schedule.breaks[i];
        }
    }
};

const placeSchedule = async (type) => {
    let place = null;

    if(type === 'chat') {
        const parentElement = await getElement('#id__chat__actions-wrapper');
        place = parentElement.children[0];
    }
    if(type === 'mail') {
        place = await getElement('.mail-sidebar-button-wrapper');
    }

    const el = document.createElement('div');
    el.classList.add('schedule');

    const span = document.createElement('span');
    span.setAttribute('index', '1');

    el.appendChild(span);

    place.append(el);
    updateSchedule();
};

const ticker = setInterval(updateSchedule, 5 * 60000);