let audioURL = 'https://djlunatique.com/wp-admin/admin-ajax.php?action=useyourdrive-stream&account_id=116134506342930495504&id=1hzNgvBXdFV9UZbqqNaiRjsekBUZYc39L&dl=1&listtoken=a7e54566abe6cf2afe51d5ae01570a2e'
const audio = new Audio(audioURL)

const pageAutoRefresh = async () => {
    const MINUTES = 3;
    if (localStorage.getItem('autoUpdate') != 'true') {
        return;
    }

    const button = await getElement('.autoUpdateButton');
    button.classList.add('autoUpdateButton_active');

    setTimeout(() => {
        if (!!state.playSound) audio.play();
    }, 59700 * MINUTES);

    setTimeout(() => {
        location.reload();
    }, 60000 * MINUTES);
};

const createSoundFXCheckbox = () => {
    const label = document.createElement('label');
    label.classList.add('playSoundSwitcher');

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';

    checkbox.checked = state.playSound;
    if (state.playSound) label.classList.add('active');

    label.addEventListener('change', () => {
        label.classList.toggle('active');
        if (!!checkbox.checked) {
            localStorage.setItem('SS_playSound', 'true');
            state.playSound = true;
        } else {
            localStorage.setItem('SS_playSound', 'false');
            state.playSound = false;
        }
    });
    label.append(checkbox);
    return label;
};

const createPageAutoRefreshButton = () => {
    const place = document.querySelector('.mail-sidebar-row');

    const block = createElement('div', ['autoUpdateButton__wrapper']);
    const button = createElement('button', ['autoUpdateButton'], 'Автообновление');

    button.addEventListener('click', () => {
        if (localStorage.getItem('autoUpdate') != 'true') {
            localStorage.setItem('autoUpdate', 'true');
            button.classList.add('autoUpdateButton_active');
            autoUpdate();
            return;
        }
        localStorage.setItem('autoUpdate', 'false');
        button.classList.remove('autoUpdateButton_active');
        location.reload();
        return;
    });

    block.append(button);
    block.append(createSoundFXCheckbox());
    place.append(block);
};

const pageAutoRefreshSetup = () => {
    pageAutoRefresh();
    createPageAutoRefreshButton();
    return
}

