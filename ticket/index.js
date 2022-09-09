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