window.setTimeout(addElements, 1);
window.addEventListener('load', checkTheme)

// window.addEventListener('hashchange', ()=> {
//     //const UID = document.querySelector("#right_resize_container > div.panel.panel-primary.chat__client > div > div.text-center > h3 > a:nth-child(1)")
//     console.log('changed');
// })

function checkTheme() {
    const theme = localStorage.getItem('usdk-theme'),
    bodyClassList = document.querySelector('body').classList;
    if(theme != null) {
        if(theme == 'dark') {
            bodyClassList.add('dark')
        } else {
            if(bodyClassList.contains('dark')) {
                bodyClassList.remove('dark')
            }
        }
    }
}
    
function addElements() {
    let rootBarBtn = document.querySelector( ".btn.btn-success" ).parentNode;
        while ( rootBarBtn.hasChildNodes() ) {
            rootBarBtn.removeChild( rootBarBtn.lastChild )
        }
        /* ---- chat-button ---- */
        createButton ('topmenu root-level', 'm-chat', 'https://secure.usedesk.ru/chat', 'fas fa-comment-dots red-icon');
        /* ---- ticket-button ---- */
        createButton ('root-level', 'm-tickets', 'https://secure.usedesk.ru/tickets', 'entypo-mail red-icon');
        /* ---- Button-in-await ---- */
        createAwaitButton();
        
    function createButton (div_class, div_id, div_link, div_icoClass) {
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
        rightButton.insertAdjacentHTML('beforebegin', `<button class="btn btn-green--await" value="default" onclick="return closeDialog(this)" data-status-id="6" type="submit">${innerText}</button>`);
    }
}

