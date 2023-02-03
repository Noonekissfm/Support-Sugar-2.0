const state = {
    userId: null,
    location: null,
    flags: {},
};

const getElementFromCrmTable = async (fieldText) => {
    const tdNodeCollection = await getElements('td');
    const tdArr = Object.values(tdNodeCollection);
    let targetElement = null;

    tdArr.map((item) => {
        if (item.innerText === fieldText) {
            return (targetElement = item.nextElementSibling);
        }
    });
    return targetElement;
};

const setEventOnAddAppealButton = async () => {
    const addAppealButton = await getElement('.nav-link.nav-text.add-comment');

    if (addAppealButton.innerText !== 'Добавить обращение') {
        return;
    }
    addAppealButton.addEventListener('click', prefAppeal);
};

const setBaseSetup = async () => {
    try {
        await setAppealChannel();
        await setOption('#issue_product_0', 1);
        await createJiraTaskTemplateButton();
    } catch (err) {
        console.log(err);
    }
};

const prefAppeal = async () => {
    const header = await getElement('.modal-header--accessible .modal-title-wrapper');

    if (!document.querySelector('h3').innerText === 'Добавить обращение' || !document.querySelector('h3').innerText === 'Редактировать обращение')
        return;

    header.querySelector('h3').style.display = 'none';
    setBaseSetup();
    wrapperButtonsCreator(header);
    if (!!state.user?.devices?.length) {
        unlinkedDevicesButton();
    }
};

const getAppealsButton = () => {
    const elementsArr = Object.values(document.querySelectorAll('a'));
    const targetElement = elementsArr.filter((item) => item.innerText === 'Обращения и Автокомментарии');
    if (targetElement.length) {
        return targetElement[0];
    } else {
        throw new Error('there is no buttons');
    }
};

const setEventOnButtons = async () => {
    if (state.flags.buttonsFlag) return;
    state.flags = {
        ...state.flags,
        buttonsFlag: true,
    };
    try {
        const buttons = await getElements('.ng-star-inserted button');
        for (button of buttons) {
            switch (button.innerText) {
                case 'ДОБАВИТЬ ОБРАЩЕНИЕ':
                    if (!button.parentElement.classList.contains('modal-footer')) {
                        button.addEventListener('click', prefAppeal);
                    }
                    break;
                case 'РЕДАКТИРОВАТЬ ДАННЫЕ':
                    button.addEventListener('click', createDeleteButton);
                    break;
                default:
                    break;
            }
        }
    } catch (error) {
        console.log(error);
    }
};

const runSetup = async () => {
    const location = window.location.pathname;
    const parsedLocation = location.split('/');

    if (parsedLocation.length === 4) {
        if (parsedLocation[parsedLocation.length - 1] === 'info') {
            setupForInfoPage();
        } else {
            state.flags.infoFlag = false;
        }
        if (parsedLocation[parsedLocation.length - 1] === 'appeals') {
            setupForAppealsPage();
        } else {
            state.flags.appealsFlag = false;
        }
        if (parsedLocation[parsedLocation.length - 1] === 'devices') {
            unlinkedDevicesDataBuilder();
        } else {
            state.flags.deviceFlag = false;
        }
        if (parsedLocation[1] === 'users' && !!Number(parsedLocation[2])) {
            setEventOnButtons();
        } else {
            state.flags.buttonsFlag = false;
        }
    }
    if (parsedLocation.length === 3 && parsedLocation[2] === 'search') {
        state.flags = {};
        state.user = {};
    }
};
setEventOnAddAppealButton();
setInterval(runSetup, 500);
