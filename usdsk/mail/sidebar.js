const hideInactiveSidebarFilters = async () => {
    const firstLi = document.querySelector('#triggersFiltersMenu > li')
    const isFirstLiMail = firstLi.attributes['data-id'].value === '41522'
    if(!isFirstLiMail) return

    let flag = false;

    const button = createElement('button', ['showSidebarListsButton'], 'Все разделы');
    document.querySelector('#triggersFiltersMenu').prepend(button)

    const sectionList = document.querySelectorAll('li[data-id]');

    for (item of sectionList) {
        if(item.dataset.id != '41522') {
            item.classList.add('hide');
        }
    }

    button.addEventListener('click', () => {
        if (!flag) {
            const lists = document.querySelectorAll('#triggersFiltersMenu li.hide');
            button.innerText = 'Скрыть';
            flag = true;
            for (item of lists) {
                item.classList.remove('hide');
            }
            return;
        }
        if (flag) {
            const lists = document.querySelectorAll('li[data-id]');
            button.innerText = 'Все разделы';
            flag = false;
            for (item of lists) {
                if(item.dataset.id !== '41522') {
                    item.classList.add('hide');
                }
            }
        }
    })
}