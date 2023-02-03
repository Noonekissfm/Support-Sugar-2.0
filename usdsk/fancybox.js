const getModalSiteInputAsync = async () => {
    const INTERVAL_MS = 50;
    const MAX_TIME_SEC = 10;

    return new Promise((resolve, reject) => {
        let count = 1;

        const timerId = setInterval(() => {
            const isLimitExceeded = (INTERVAL_MS * count) / 1000 > MAX_TIME_SEC;

            if (isLimitExceeded) {
                clearInterval(timerId);
                reject(new Error('Limit exceeded - getModalSiteInputAsync'));
            }

            const modalIFrame = document.querySelector('.fancybox-iframe');

            if (!modalIFrame) {
                return;
            }

            const input = modalIFrame.contentWindow.document.querySelector('input[name="sites[url][]"]');

            if (input) {
                resolve(input);
                clearInterval(timerId);
            }
            count++;
        }, INTERVAL_MS);
    });
};

const getModalElement = async (modal, selectorPath) => {
    return new Promise((resolve, reject) => {
        let count = 0;

        const interval = setInterval(() => {
            if (count === 100) {
                clearInterval(interval);
                reject(new Error('timeout: element not found'));
            }
            const documentModal = document.querySelector(modal);

            if (!documentModal) {
                return;
            }

            const modalElement = documentModal.contentWindow.document.querySelector(selectorPath);

            if (modalElement) {
                clearInterval(interval);
                resolve(modalElement);
                return;
            }
            count++;
        }, 50);
    });
};

const getFancyboxContent = async () => {
    const fancybox = document.querySelector('.fancybox-iframe');
    const html = `<style>
    .help-block {
        display: none;
    }
    .form-dynamic-control {
        margin-bottom: 10px;
    }
    .form-horizontal div {
        margin-bottom: 0;
    }
    </style>`;

    const flag = await getModalElement('.fancybox-iframe', '#submit');
    if(flag) {
        const fancyboxHeadElement = fancybox.contentWindow.document.querySelector('head');
        fancyboxHeadElement.insertAdjacentHTML('beforeend', html)
    }

    const responseArr = await Promise.all([
        getModalElement('.fancybox-iframe', 'h3'),
        getModalElement('.fancybox-iframe', '#group_avatar'),
        getModalElement('.fancybox-iframe', 'div:nth-child(3)'),
        getModalElement('.fancybox-iframe', 'div:nth-child(4)'),
        getModalElement('.fancybox-iframe', 'div:nth-child(6)'),
        getModalElement('.fancybox-iframe', 'div:nth-child(9)'),
        getModalElement('.fancybox-iframe', '#form .row:nth-child(8)'),
        getModalElement('.fancybox-iframe', '#form .row:nth-child(9)'),
    ]);

    responseArr.forEach((item) => {
        if (item) {
            item.remove();
        }
    });

    fancybox.style.height = '650px';
    fancybox.style.backgroundColor = '#fff';
    fancybox.style.paddingTop = '0';
};

const generateLink = async () => {
    let name = '',
    rawName = '';
    const isLocationChat = location.pathname.split('/')[1] === 'chat'
    if (isLocationChat) {
        rawName = await getElement('h3[class="client-h3"]');
    } else {
        rawName = await getElement('#right_resize_container h3 a');
    }
    name = rawName.innerText.trim()
    return `http://crm.spb.play.dc/users/${name}/info`;
};

const insertLinkToModalInput = async () => {
    try {
        const input = await getModalSiteInputAsync();
        const link = await generateLink();
        if (!input.value) {
            input.value = link;
        }
    } catch (error) {
        console.log(error);
    }
};