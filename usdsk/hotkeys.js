async function hotKeys(key) {
    switch (key.code) {
        case 'F2':
            const pencil = document.querySelector('.entypo-pencil').parentElement;

            pencil.click();
            await getFancyboxContent();
            await insertLinkToModalInput();
            break;

        case 'F4':
            const name = String(document.querySelector('h3[class="client-h3"]').innerText).trim();
            window.open(`http://crm.spb.play.dc/users/${name}/info`);
            break;
    }

    if (key.code === 'Digit1' && key.altKey === true) {
        document.querySelector('#awaitButton').click();
    }
    if (key.code === 'Digit2' && key.altKey === true) {
        if (document.querySelector('#reply-link-public').style.display === 'none') {
            document.querySelector('#reply-link-private').click();
        } else {
            document.querySelector('#reply-link-public').click();
        }
    }
    if (key.code === 'Digit3' && key.altKey === true) {
        const names = document.querySelectorAll('.chat-message__name-of-responder');
        for (item of names) {
            item.classList.toggle('blur');
        }
    }
}