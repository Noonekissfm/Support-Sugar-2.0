const setAppealChannel = async () => {
    try {
        const channel = await getElement('#appeal_channel');
    if (!channel?.value) {
        channel.value = localStorage.getItem('appeal_channel');
        dispatchEvent('change', channel);
        channel.addEventListener('change', saveAppealChannel);
    }
    } catch (error) {
       console.log(error) 
    }
}

const saveAppealChannel = async () => {
    try {
        const channel = await getElement('#appeal_channel');
        localStorage.setItem('appeal_channel', channel.value);
        showNotice(createNotice('Канал сохранен'), 3)
    } catch (err) {
        console.log(err);
    }
}