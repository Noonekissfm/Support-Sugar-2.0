

const state = {
    playSound: localStorage.getItem('SS_playSound') === 'true'? true : false,
    schedule: getCurrentSchedule(),
}


/**
 *  TODO
 *  Добавить отображение графика работы в почте
 */

try {
    switchStatus();
    createTimersBlock();
    placeSchedule('mail');
    createScheduleMenu();
    pageAutoRefreshSetup();
    hideInactiveNavbarFilters();
    hideInactiveSidebarFilters();
    navbarFilterVisibilitySwitcher();
    createSidebarVisibilityToggleButton();
} catch (error) {
    console.log(error)
}