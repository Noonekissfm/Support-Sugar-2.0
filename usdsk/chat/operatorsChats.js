const getChatId = async () => {
    const chats = document.querySelectorAll('#collapseOne-3 > div > ul > li');
    const arr = [];
    for (item of chats) {
        arr.push(item.dataset.chat);
    }
    return arr;
};

const createUrl = (key) => {
    return `https://secure.usedesk.ru/v1/chat/getMessagesByChat?chat=${key}&skip=0&take=25`;
};

const getChats = async () => {
    const chatIdsArr = await getChatId();

    const responseArr = await Promise.all(await Promise.all(chatIdsArr.map((item) => fetch(createUrl(item)).then((res) => res.json()))));

    return responseArr;
};

const createModal = () => {
    const modal_backdrop = document.createElement('div');
    modal_backdrop.classList.add('modal_backdrop');
    modal_backdrop.addEventListener('click', (e) => {
        if (e.currentTarget === modal_backdrop) {
            clearInterval(state.renewalDataTimer);
            delete state.renewalDataTimer;
            modal_backdrop.remove();
        }
    });

    const modal_chats = document.createElement('div');
    modal_chats.classList.add('chats_modal');
    modal_chats.innerHTML = `
    <span class=chats_modal_loading>Загрузка данных...</span>
    `;
    modal_chats.addEventListener('click', (e) => e.stopPropagation());

    modal_backdrop.append(modal_chats);
    document.body.append(modal_backdrop);
};

const formateData = async () => {
    const modal = document.querySelector('.chats_modal');

    const data = await getChats();

    const names = new Set(data.map((item) => item.assignee_name));
    const namesArr = Array.from(names).sort();

    let newState = '<span class=chats_modal_loading>Нет активных чатов...</span>';

    if (namesArr.length > 0) {
        newState = '';
        for (let i = 0; i < namesArr.length; i++) {
            let chatsHTML = '';
            for (let j = 0; j < data.length; j++) {
                if (namesArr[i] === data[j].assignee_name) {
                    chatsHTML += `
                    <a class="chat_id" href="https://secure.usedesk.ru/tickets/${data[j].ticket_id}" target="_blank">
                        <span>${data[j].ticket_id}</span>
                    </a>`;
                }
            }
            const html = `
            <div class=operator_card>
                <div class=card_container>
                    <div class=operator_name>${namesArr[i]}</div>
                    <div class=operator_chats>${chatsHTML}</div>
                </div>
            </div>
            `;
            newState += html;
        }
    }
    return (modal.innerHTML = newState);
};

const createCheckChatsButton = async () => {
    const place = await getElement('#button_assign_next_chat');

    const button = document.createElement('button');
    button.className = 'checkChatsButton';
    button.innerText = 'Чаты операторов';
    place.parentElement.append(button);

    button.addEventListener('click', () => {
        const modal = document.querySelector('.chats_modal');

        if (!modal) {
            createModal();
            formateData();
            state.renewalDataTimer = setInterval(() => {
                formateData();
            }, 3000);
            return;
        }
        modal.remove();
    });
};

createCheckChatsButton();