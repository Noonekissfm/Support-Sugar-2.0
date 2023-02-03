const unlinkedDevicesDataBuilder = async () => {
    if (state.flags.deviceFlag) return
    state.flags = {
        ...state.flags,
        deviceFlag: true,
    }
    if(!state.user?.devices) {
        state.user = {
            devices: [],
        }
    }
    
    const buttonsArr = Object.values(await getElements('.datagrid-scrolling-cells button')).filter(button => button.innerText === 'ОТВЯЗАТЬ')

    buttonsArr.forEach(button => {
        const parentRow = button.parentElement.parentElement
        const paragraphArr = Object.values(parentRow.querySelectorAll('.spec p'))
        const text = paragraphArr.map(p => p.innerText).filter(p => p !== '')

        button.addEventListener('click', ()=>{
            showNotice(createNotice('Устройство сохранено для СО'), 3)
            state.user.devices = [...state.user.devices, text.join('\n')]
        })
    })
}

const unlinkedDevicesButton = () => {
    const place = document.querySelector('.questions-footer');
    const button = createElement('button', ['btn', 'btn-default', 'shake'], 'Отвязанные устройства')

    button.addEventListener('click', (e)=>{
        e.preventDefault();
        const descriptionArea = document.querySelector("#issue_description_0")
        state.user.devices.forEach(item => descriptionArea.value += `\n${item}\n`)
        dispatchEvent('change', descriptionArea)
    })
    place.append(button)
}