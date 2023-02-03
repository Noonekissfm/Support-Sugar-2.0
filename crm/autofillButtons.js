const setOption = async (selectorPath, selector) => {
    const el = await getElement(selectorPath);
    if (el && selector >= 1) {
        el.selectedIndex = selector;
        dispatchEvent('change', el);
        return;
    }
};

const setDescription = async (selectorPath, description) => {
    try {
        const el = await getElement(selectorPath);
        if (!el) {
            return;
        }
        el.value = description;
        return dispatchEvent('change', el);
    } catch (err) {
        console.log(err);
    }
};

const delay = (ms) =>
    new Promise((res) => {
        setTimeout(() => {
            return res();
        }, ms);
    });

const fillAppeal = async (selectors) => {
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
};

const createAutofillAppealButton = (parent, object) => {
    const btn = createElement('button', object.classList, object.title);

    btn.addEventListener('click', (e) => {
        e.preventDefault();
        fillAppeal(object.selector);
    });

    parent.appendChild(btn);
};

const wrapperButtonsCreator = (parent) => {
    const buttonsConfig = [
        {
            title: 'Возвр.БК',
            classList: ['my-btn', 'my-btn--payment'],
            selector: [2, 6, 1, 26],
        },
        {
            title: 'Возвр.ЛС',
            classList: ['my-btn', 'my-btn--payment'],
            selector: [2, 6, 2, 26],
        },
        {
            title: 'Неж.Спис.Конс',
            classList: ['my-btn', 'my-btn--payment'],
            selector: [2, 5, 9, 26, 'Консультация по списанию'],
        },
        {
            title: 'Неж.Спис.Мерж',
            classList: ['my-btn', 'my-btn--payment'],
            selector: [2, 7, 10, 26],
        },
        {
            title: 'Отмена.АП',
            classList: ['my-btn', 'my-btn--payment'],
            selector: [7, 3, 1, 26],
        },
        {
            title: 'Ош.Оплата БК',
            classList: ['my-btn', 'my-btn--payment'],
            selector: [3, 1, 2, 26],
        },
        {
            title: 'Опл.Спасибо',
            classList: ['my-btn', 'my-btn--payment'],
            selector: [3, 2, 2, 26],
        },
        {
            title: 'Изм.ПД',
            classList: ['my-btn', 'my-btn--data'],
            selector: [1, 19, 3, 26],
        },
        {
            title: 'Откл.Уст.',
            classList: ['my-btn', 'my-btn--data'],
            selector: [1, 20, 2, 26],
        },
        {
            title: 'Удаление',
            classList: ['my-btn', 'my-btn--data'],
            selector: [1, 3, 6, 26],
        },
        {
            title: 'Мерж',
            classList: ['my-btn', 'my-btn--data'],
            selector: [1, 2, 8, 26],
        },
        {
            title: 'Акции 306',
            classList: ['my-btn'],
            selector: [5, 5, 2, 26],
        },
        {
            title: 'Ош.Воспр.',
            classList: ['my-btn'],
            selector: [4, 10, 12, 26],
        },
        {
            title: 'Кл.Не ответил',
            classList: ['my-btn'],
            selector: [10, 1, 1, 26],
        },
        {
            title: 'Пожелание',
            classList: ['my-btn'],
            selector: [6, 6, 3, 26],
        },
    ];
    buttonsConfig.map((config) => createAutofillAppealButton(parent, config));
};
