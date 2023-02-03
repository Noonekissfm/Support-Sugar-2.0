const createNotice = (text) => {
    const notice = createElement('span', ['SS_notice'], text);
    document.querySelector('body').append(notice);
    return notice;
};

const showNotice = (callback, seconds) => {
    const notice = callback;
    setTimeout(()=>{
        notice.remove();
    }, seconds * 1000)
}