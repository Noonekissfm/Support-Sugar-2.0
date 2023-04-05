const setOption = async (selectorPath, selector) => {
    const el = await getElement(selectorPath);
    if (el && selector >= 1) {
        el.selectedIndex = selector;
        dispatchEvent('change', el);
        return;
    }
};

const getSelectorPathForDebug = () => {
    const category = document.querySelector('#issue_category_0')
    const reason = document.querySelector('#issue_root_cause_reason_0')
    const actions = document.querySelector('#issue_actions_0')
    const platform = document.querySelector('#issue_platform_0')
    
    const pathArray = [
        category.selectedIndex,
        reason.selectedIndex,
        actions.selectedIndex,
        platform.selectedIndex,
    ]

    return console.log(pathArray)
}

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

const fillAppeal = async (selectors, tag) => {
    try {
        tag? await setOption('#issue_tags_0', tag) : undefined; // tag..
        await setOption('#issue_category_0', selectors[0]); // category..
        await setOption('#issue_root_cause_reason_0', selectors[1]); // reason..
        await setOption('#issue_actions_0', selectors[2]); // actions..
        // await setOption('#issue_platform_0', selectors[3]); // platform..
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
        fillAppeal(object.selector, object.tag);
        // getSelectorPathForDebug();
    });

    parent.appendChild(btn);
};

const wrapperButtonsCreator = (parent) => {
    const buttonsConfig = [
        {
            title: 'Возвр.БК',
            classList: ['my-btn', 'my-btn--payment'],
            selector: [1, 1, 4, 0],
        },
        {
            title: 'Возвр.ЛС',
            classList: ['my-btn', 'my-btn--payment'],
            selector: [1, 1, 7, 0],
        },
        {
            title: 'Неж.Спис.Конс',
            classList: ['my-btn', 'my-btn--payment'],
            selector: [1, 1, 1, 0],
        },
        {
            title: 'Неж.Спис.Мерж',
            classList: ['my-btn', 'my-btn--payment'],
            selector: [1, 1, 3, 0],
        },
        {
            title: 'Отмена.АП',
            classList: ['my-btn', 'my-btn--payment'],
            selector: [4, 1, 1, 0],
        },
        {
            title: 'Ош.Оплата БК',
            classList: ['my-btn', 'my-btn--payment'],
            selector: [10, 2, 1, 0],
        },
        {
            title: 'Опл.Спасибо',
            classList: ['my-btn', 'my-btn--payment'],
            selector: [10, 4, 1, 0],
            tag: 1,
        },
        {
            title: 'Изм.ПД',
            classList: ['my-btn', 'my-btn--data'],
            selector: [2, 1, 1, 0],
        },
        {
            title: 'Откл.Уст.',
            classList: ['my-btn', 'my-btn--data'],
            selector: [2, 12, 1, 0],
        },
        {
            title: 'Удаление',
            classList: ['my-btn', 'my-btn--data'],
            selector: [2, 14, 3, 0],
        },
        {
            title: 'Мерж(Креды)',
            classList: ['my-btn', 'my-btn--data'],
            selector: [2, 3, 4, 0],
        },
        {
            title: 'Мерж(DID)',
            classList: ['my-btn', 'my-btn--data'],
            selector: [2, 4, 4, 0],
        },
        {
            title: 'Акции',
            classList: ['my-btn'],
            selector: [6, 2, 1, 0],
        },
        {
            title: 'Ош.Воспр.',
            classList: ['my-btn'],
            selector: [7, 1, 1, 0],
        },
        {
            title: 'Кл.Не ответил',
            classList: ['my-btn'],
            selector: [13, 7, 1, 0],
        },
        {
            title: 'Пожелание по контенту',
            classList: ['my-btn'],
            selector: [12, 1, 2, 0],
            tag: 2,
        },
        {
            title: 'Контент вышел',
            classList: ['my-btn'],
            selector: [12, 2, 1, 0],
        },
    ];
    buttonsConfig.map((config) => createAutofillAppealButton(parent, config));
};
