const getCurrentSchedule = () => {
    return JSON.parse(localStorage.getItem('SS_schedule'));
};

const getElement = async (path) => {
    return new Promise((resolve, reject) => {
        let count = 0;

        const intervalId = setInterval(() => {
            if (count === 50) {
                clearInterval(intervalId)
                return reject(new Error(`element with selector ${path} not found...`))
            }

            const element = document.querySelector(path)

            if (!element) {
                return count++
            }
            clearInterval(intervalId)
            return resolve(element)
        }, 50)
    })
}

const getElements = async (path) => {
    return new Promise((resolve, reject) => {
        let count = 0;

        const intervalId = setInterval(() => {
            if (count === 50) {
                clearInterval(intervalId)
                return reject(new Error(`no elements with selector ${path}`))
            }

            const elements = document.querySelectorAll(path)

            if (!elements.length) {
                return count++
            }
            clearInterval(intervalId)
            return resolve(elements)
        }, 50)
    })
}

const clearTimer = (timerName, el, className) => {
    clearTimeout(state[timerName]);
    delete state[timerName];
    el.classList.remove(className)
}

// Перебрать создание элементов под эту функцию в файлах chat/index.js && crm/index.js && mail/index.js

const createElement = (htmlTag, classNamesArr, innerText = '') => {
    const element = document.createElement(htmlTag);
    element.classList.add(...classNamesArr);
    element.innerText = innerText;
    return element;
}

const dispatchEvent = (event, element) => {
    const e = new Event(event);
    element.dispatchEvent(e);
}