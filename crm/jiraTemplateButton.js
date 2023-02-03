const createJiraTaskTemplateButton = async () => {
    const jiraInput = await getElement('#jira_task');
    const btn = createElement('button', ['my-btn', 'my-btn--payment'], 'Шаблон ссылки');

    btn.addEventListener('click', (event) => {
        event.preventDefault();
        jiraInput.value = 'https://secure.usedesk.ru/tickets/НомерЗаявки';
    });

    return jiraInput.parentNode.append(btn);
}