const createBookmarkPanelButton = (url, text, target) => {
    const button = createElement('div', ['bookmark__panel__button__container'])
    button.innerHTML = `<a href='${url}' target='${target}'><button class='bookmark__panel__button'>${text}</button></a>`;
    return button;
};

const createBookmarkPanel = () => {
    const bookmarks = [
        {
            url: 'https://ip.cdnvideo.ru/',
            target: '_blank',
            text: 'CDN Video',
        },
        {
            url: 'https://www.maxmind.com/en/geoip2-precision-demo',
            target: '_blank',
            text: 'MaxMind',
        },
        {
            url: 'https://docs.google.com/forms/d/e/1FAIpQLSdCXcneagBUCpCk52wVIZy0vQcveOU_gotoZ__9HjrO0nzZUQ/viewform',
            target: '_blank',
            text: 'Добавить контент',
        },
        {
            url: 'https://www.kinopoisk.ru/',
            target: '_blank',
            text: 'КиноПоиск',
        },
    ];

    const panel = createElement('div', ['bookmark__panel'])
    const buttons = bookmarks.map((bookmark) => {
        return createBookmarkPanelButton(bookmark.url, bookmark.text, bookmark.target);
    });

    panel.append(...buttons);
    document.querySelector('body').append(panel);
};