window.addEventListener('load', checkTheme);
window.setTimeout(switchStatus, 1000);
window.addEventListener('keydown', (e) => {
    hotKeys(e);
});

function checkTheme() {
    const theme = localStorage.getItem('usdk-theme');
    if (!theme) return;
    const body = document.querySelector('body')
    const isDark = body.classList.contains('dark');

    if (theme === 'dark' && !isDark) {
        body.classList.add('dark');
    }
}

const state = {
    chats: [],
    chatsFlag: true,
    schedule: getCurrentSchedule(),
};

const removeCreateChatButton = async () => {
    const chatButton = await getElement('a[data-target="#create-chat-modal"]');
    chatButton.remove();
};

const createAwaitButton = async () => {
    const rightButton = await getElement('.btn-group.btn-reply.close-dialog-bar');
    const INNER_TEXT = 'В ожидании';
    const ID = 'awaitButton';

    rightButton.insertAdjacentHTML(
        'beforebegin',
        `<button class="btn btn-green--await" id="${ID}" value="default" onclick="return closeDialog(this)" data-status-id="6" type="submit">${INNER_TEXT}</button>`
    );
};

try {
    createBookmarkPanel();
    createSidebarVisibilityToggleButton();
    createTimersBlock();
    createScheduleMenu();
    placeSchedule('chat');
    removeCreateChatButton();
    createAwaitButton();
} catch (error) {
    console.log(error)
}