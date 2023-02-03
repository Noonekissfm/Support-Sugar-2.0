const switcher = document.querySelector('#theme-switcher');
checkTheme();

switcher.addEventListener('change', () => {
    if (switcher.checked) {
        switchToDark()
        localStorage.setItem('usdk-theme', 'dark')
    } else {
        switchToLight()
        localStorage.removeItem('usdk-theme')
    }
})

function checkTheme() {
    const theme = localStorage.getItem('usdk-theme');
    if(theme == 'dark') {
        switcher.checked = true;

    } else {
        switcher.checked = false;

    }
}


function switchToDark() {
    chrome.tabs.query({active: true, currentWindow: true, url: 'https://secure.usedesk.ru/chat/*'}, (tabs) => {
        chrome.scripting.executeScript({target:{tabId: tabs[0].id}, function: () => {    
            document.querySelector('body').classList.add('dark');
            localStorage.setItem('usdk-theme', 'dark')
            }
        });
    });
}
function switchToLight() {
    chrome.tabs.query({active: true, currentWindow: true, url: 'https://secure.usedesk.ru/chat/*'}, (tabs) => {
        chrome.scripting.executeScript({target:{tabId: tabs[0].id}, function: () =>{    
            document.querySelector('body').classList.remove('dark');
            localStorage.removeItem('usdk-theme')
            }
        });
    });
}
