window.addEventListener('load', injectFonts);


function injectFonts() {
    const head = document.querySelector('head');

    head.innerHTML += `
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link href="https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap" rel="stylesheet">
    `
    return;
}

const getElement = async (path) => {
    return new Promise((resolve, reject) => {
        const count = 0;

        const intervalId = setInterval(() => {
            if (count === 50) {
                clearInterval(intervalId)
                return reject(new Error('getElement timeOut...'))
            }

            const element = document.querySelector(path)

            if (!element) {
                count++
                return
            }
            clearInterval(intervalId)
            return resolve(element)

        }, 50)
    })
}

const createToggleButton = async () => {
    const SECONDS = 10;
    const sidebarMenu = await getElement('.sidebar-menu');

    const toggleButton = document.createElement('button');
    toggleButton.className = 'toggleButton';

    sidebarMenu.append(toggleButton);

    toggleButton.addEventListener('click', () => {
        sidebarMenu.classList.toggle('toggle-menu');
        if (sidebarMenu.classList.contains('toggle-menu')) {
            const timer = setTimeout(() => {
                sidebarMenu.classList.remove('toggle-menu')
                clearTimeout(timer)
            }, 1000 * SECONDS)
        }
        return
    })
}
createToggleButton();