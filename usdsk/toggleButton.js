const createSidebarVisibilityToggleButton = async () => {
    const seconds = 10;
    const sidebar = await getElement('.sidebar-menu');

    const toggleButton = createElement('button', ['toggleButton']);

    sidebar.append(toggleButton);

    toggleButton.addEventListener('click', () => {
        const isActive = sidebar.classList.contains('toggle-menu')
        if (!isActive) {
            sidebar.classList.add('toggle-menu');
            state.toggleTimer = setTimeout(() => {
                clearTimer('toggleTimer', sidebar, 'toggle-menu');
                return;
            }, 1000 * seconds);
            return;
        }
        return clearTimer('toggleTimer', sidebar, 'toggle-menu');
    });
};
