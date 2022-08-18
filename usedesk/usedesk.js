window.setTimeout(addElements, 1);
window.setTimeout(createTimerPanel, 1);
window.addEventListener('load', checkTheme)
window.addEventListener('keydown', (e) => {

    hotKeys(e)
});
window.setTimeout(createToggler, 10);

// window.addEventListener('hashchange', ()=> {
//     //const UID = document.querySelector("#right_resize_container > div.panel.panel-primary.chat__client > div > div.text-center > h3 > a:nth-child(1)")
//     console.log('changed');
// })

function checkTheme() {
    const theme = localStorage.getItem('usdk-theme'),
        bodyClassList = document.querySelector('body').classList;
    if (theme != null) {
        if (theme == 'dark') {
            bodyClassList.add('dark')
        } else {
            if (bodyClassList.contains('dark')) {
                bodyClassList.remove('dark')
            }
        }
    }
}

function addElements() {
    let rootBarBtn = document.querySelector(".btn.btn-success").parentNode;
    while (rootBarBtn.hasChildNodes()) {
        rootBarBtn.removeChild(rootBarBtn.lastChild)
    }
    /* ---- chat-button ---- */
    createButton('topmenu root-level', 'm-chat', 'https://secure.usedesk.ru/chat', 'fas fa-comment-dots red-icon');
    /* ---- ticket-button ---- */
    createButton('root-level', 'm-tickets', 'https://secure.usedesk.ru/tickets', 'entypo-mail red-icon');
    /* ---- Button-in-await ---- */
    createAwaitButton();

    function createButton(div_class, div_id, div_link, div_icoClass) {
        //create div...
        const elem = document.createElement('div');
        elem.className = div_class;
        elem.id = div_id;
        rootBarBtn.appendChild(elem);
        //add link to div...
        const elem_link = document.createElement('a');
        elem_link.href = div_link;
        elem.appendChild(elem_link);
        //add ico to div...
        const elem_ico = document.createElement('i');
        elem_ico.className = div_icoClass;
        elem_link.appendChild(elem_ico);
    }
    function createAwaitButton() {
        const rightButton = document.querySelector('.btn-group.btn-reply.close-dialog-bar');

        const innerText = 'В ожидании';
        rightButton.insertAdjacentHTML('beforebegin', `<button class="btn btn-green--await" id="awaitButton" value="default" onclick="return closeDialog(this)" data-status-id="6" type="submit">${innerText}</button>`);
    }
}

function createTimerPanel() {
    const switcher = document.querySelector('.chat-status')
    const place = document.querySelector("#id__chat__actions-wrapper > div.mail-sidebar-row.hidden-xs.chat__checkbox-wrapper.ta-c.display-none")

    const panel = document.createElement('div');
    panel.className = 'timerPanel';
    place.appendChild(panel)

    function createTimerButton(id, innerText, time) {
        const button = document.createElement('button');
        button.className = 'timerButton';
        button.id = id;
        button.innerText = innerText;
        button.addEventListener('click', (e) => {
            switchStatus(time);
            e.target.classList.add('timerButton_active');
        });
        panel.appendChild(button);
    }

    createTimerButton('timer_5', 'WC', 5)
    createTimerButton('timer_15', '15', 15)
    createTimerButton('timer_45', '45', 45)


    function switchStatus(time) {
        switcher.click();
        console.log(`Таймер установлен на ${time} минуту.`);

        setTimeout(() => {
            switcher.click();
            document.querySelector('.timerButton_active').classList.remove('timerButton_active');
            console.log(`Поставлен онлайн.`)
        }, time * 60000)
    }

}

const getModalSiteInputAsync = async () => {
    const INTERVAL_MS = 50;
    const MAX_TIME_SEC = 10;

    return new Promise((resolve, reject) => {
        let count = 1;

        const timerId = setInterval(() => {
            const isLimitExceeded = (INTERVAL_MS * count) / 1000 > MAX_TIME_SEC

            if (isLimitExceeded) {
                clearInterval(timerId);
                reject(new Error('Limit exceeded - getModalSiteInputAsunc'));
            }

            const modalIFrame = document.querySelector('.fancybox__iframe');


            if (!modalIFrame) {
                return;
            }


            const input = modalIFrame.contentWindow.document.querySelector('input[name="sites[url][]"]');

            if (input) {
                resolve(input);
                clearInterval(timerId);
            }

            count++;
        }, INTERVAL_MS)
    })
}

const generateLink = async () => {
    const name = String(document.querySelector('h3[class="client-h3"]').innerText).trim()
    return `http://crm.spb.play.dc/users/${name}/info`;
}

const insertLinkToModalInput = async () => {
    try {
        const input = await getModalSiteInputAsync();
        const link = await generateLink();
        input.value = link;
    } catch (error) {
        console.log(error);
    }
}

async function hotKeys(key) {

    if (key.code === 'F2') {

        const pencil = document.querySelector("#right_resize_container > div.panel.panel-primary.chat__client > div:nth-child(1) > div.text-center > h3 > a:nth-child(2)");
        pencil.click();
        insertLinkToModalInput();

    }

    if (key.code === 'F4') {
        const link = String(window.location.href)
        navigator.clipboard.writeText(`${link}`); //почему-то не вставляется ссылка в новой вкладке

        const name = String(document.querySelector('h3[class="client-h3"]').innerText).trim()
        window.open(`http://crm.spb.play.dc/users/${name}/info`);

    }

    if (key.code === 'Space' && key.shiftKey === true) {
        document.querySelector("i[class='fa-unlock']").click();
    }
    if (key.code === 'Digit1' && key.altKey === true) {
        document.querySelector('#awaitButton').click();
    }
    if (key.code === 'Digit2' && key.altKey === true) {
        const names = document.querySelectorAll('.chat-message__name-of-responder')
        for (item of names) {
            item.classList.toggle('blur');
        }
    }
}

function createToggler() {
    const menu = document.querySelector('.sidebar-menu');

    const toggler = document.createElement('button');
    toggler.className = 'toggler';

    menu.append(toggler);
    toggler.addEventListener('click', () => {
        menu.classList.toggle('toggle-menu');
        setTimeout(() => {
            menu.classList.toggle('toggle-menu');
        }, 5000)
    })
}

