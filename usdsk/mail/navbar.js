const hideInactiveNavbarFilters = async () => {
    const lists = await getElements('li[class="dropdown "]');
    for (item of lists) {
        item.classList.add('hide');
    }
}

const navbarFilterVisibilitySwitcher = () => {
    let flag = false;
    const button = document.createElement('button')
    button.innerText = 'Все фильтры';
    button.className = 'showListsButton';

    document.querySelector('.navbar-nav').append(button);

    button.addEventListener('click', () => {
        if (!flag) {
            const lists = document.querySelectorAll('li[class="dropdown hide"]');
            button.innerText = 'Скрыть';
            flag = true;
            for (item of lists) {
                item.classList.remove('hide');
            }
            return;
        }
        if (flag) {
            const lists = document.querySelectorAll('li[class="dropdown"]');
            button.innerText = 'Все фильтры';
            flag = false;
            for (item of lists) {
                item.classList.add('hide');
            }
        }
    })
}