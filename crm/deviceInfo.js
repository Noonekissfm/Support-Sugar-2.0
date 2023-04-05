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
            state.user.devices = [...state.user.devices, '\n']
        })
    })

    createSaveAllDevicesInfoButton()
}

const saveAllDevicesInfo = async () => {
    const devices = Object.values(await getElements('.spec')).map(device => device.children[0])
    const textBuffer = [];
    devices.forEach(device => {
        const paragraphArr = Object.values(device.children)
        paragraphArr.forEach((p, index) => {
            if(p.innerText === '') return
            textBuffer.push(p.innerText)
            if(index === paragraphArr.length - 1) {
                textBuffer.push(' ')
            }
        })
    })

    state.user.devices = [...state.user.devices, ...textBuffer]
    if (!!state.user.devices) {
        showNotice(createNotice('Устройства сохранены для СО'), 3)
    }
}

const createSaveAllDevicesInfoButton = async () => {
    const targetButton = Object.values(await getElements('.ng-star-inserted button')).filter(button => button.innerText === 'ОТВЯЗАТЬ И РАЗЛОГИНИТЬ ВСЕ')
    targetButton[0].addEventListener('click', saveAllDevicesInfo)
}

const unlinkedDevicesButton = () => {
    const place = document.querySelector('.questions-footer');
    const button = createElement('button', ['btn', 'btn-default', 'shake'], 'Отвязанные устройства')

    button.addEventListener('click', (e)=>{
        e.preventDefault();
        const descriptionArea = document.querySelector("#issue_description_0")
        state.user.devices.forEach(item => {
            if(item === ' ') return descriptionArea.value += '\n';
            descriptionArea.value += `${item}\n`;
        })
        dispatchEvent('change', descriptionArea)
        console.log(state.user.devices)
    })
    place.append(button)
}