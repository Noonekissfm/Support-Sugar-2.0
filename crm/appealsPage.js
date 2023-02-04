const forceRadioButton = async () => {
    const isAvailableInputs = await getElement('input[type="radio"]');
    if(!isAvailableInputs) return
    const radioButtonsCollection = await getElements('input[type="radio"]');
    if (!radioButtonsCollection) return

    try {
        for (button of radioButtonsCollection) {
            if (button.nextElementSibling.innerText === 'Обращения') {
                button.click();
            }
        }
    } catch (error) {
        console.log(error);
    }
};

const setEventOnEditAppealButton = async () => {
    const timer = setTimeout(async () => {
        const isAvailableAppeals = await(getElement('.card-footer button.ng-star-inserted'))
        if(!isAvailableAppeals) return
        const appealButtons = await getElements('.card-footer button.ng-star-inserted');

        for (button of appealButtons) {
            if (button.innerText === 'РЕДАКТИРОВАТЬ') {
                button.addEventListener('click', prefAppeal);
            }
        }
        return clearTimeout(timer);
    }, 1000);
};

const setupForAppealsPage = async () => {
    if (state.flags.appealsFlag) return
    state.flags = {
        ...state.flags,
        appealsFlag: true,
    }
    await forceRadioButton();
    await setEventOnEditAppealButton();
};
