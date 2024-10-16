let eventsData = []; // Хранение всех мероприятий
let currentEditId = null;

async function register() {
    const username = document.getElementById('register-username').value;
    const password = document.getElementById('register-password').value;

    const response = await fetch('http://localhost:5000/auth/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
    });

    if (response.ok) {
        alert('Пользователь зарегистрирован');
    } else {
        console.error('Ошибка регистрации');
    }
}

async function login() {
    const username = document.getElementById('login-username').value;
    const password = document.getElementById('login-password').value;

    const response = await fetch('http://localhost:5000/auth/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
    });

    if (response.ok) {
        const data = await response.json();
        localStorage.setItem('token', data.token);
        alert('Успешный вход');
        loadEvents(); // Загрузить мероприятия после входа
    } else {
        console.error('Ошибка входа');
    }
}

async function loadEvents() {
    const response = await fetch('http://localhost:5000/events');
    eventsData = await response.json(); // Сохраняем данные для фильтрации
    renderEvents(eventsData); // Выводим все мероприятия
}

function renderEvents(events) {
    const eventsList = document.getElementById('events');
    eventsList.innerHTML = '';

    events.forEach(event => {
        const li = document.createElement('li');
        li.innerHTML = `
            ${event.title} (${event.type}) - ${new Date(event.startTime).toLocaleString()} до ${new Date(event.endTime).toLocaleString()} в ${event.location}
            <button onclick="editEvent('${event._id}', '${event.title}', '${event.type}', '${new Date(event.startTime).toISOString().slice(0,16)}', '${new Date(event.endTime).toISOString().slice(0,16)}', '${event.location}')">Редактировать</button>
            <button onclick="deleteEvent('${event._id}')">Удалить</button>
        `;
        eventsList.appendChild(li);
    });
}

function filterEvents() {
    const titleFilter = document.getElementById('filter-title').value.toLowerCase();
    const typeFilter = document.getElementById('filter-type').value.toLowerCase();

    const filteredEvents = eventsData.filter(event => {
        return (
            event.title.toLowerCase().includes(titleFilter) &&
            event.type.toLowerCase().includes(typeFilter)
        );
    });

    renderEvents(filteredEvents);
}

function editEvent(id, title, type, startTime, endTime, location) {
    currentEditId = id;
    document.getElementById('edit-title').value = title;
    document.getElementById('edit-type').value = type;
    document.getElementById('edit-startTime').value = startTime;
    document.getElementById('edit-endTime').value = endTime;
    document.getElementById('edit-location').value = location;
    document.getElementById('edit-event-form').style.display = 'block';
}

async function updateEvent() {
    const token = localStorage.getItem('token');
    const title = document.getElementById('edit-title').value;
    const type = document.getElementById('edit-type').value;
    const startTime = document.getElementById('edit-startTime').value;
    const endTime = document.getElementById('edit-endTime').value;
    const location = document.getElementById('edit-location').value;

    const response = await fetch(`http://localhost:5000/events/${currentEditId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ title, type, startTime, endTime, location }),
    });

    if (response.ok) {
        loadEvents();
        cancelEdit();
    } else {
        console.error('Ошибка при обновлении мероприятия');
    }
}

async function deleteEvent(id) {
    const token = localStorage.getItem('token');
    
    const response = await fetch(`http://localhost:5000/events/${id}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    });

    if (response.ok) {
        loadEvents();
    } else {
        console.error('Ошибка при удалении мероприятия');
    }
}

function cancelEdit() {
    document.getElementById('edit-event-form').style.display = 'none';
    currentEditId = null;
}

// Загрузка мероприятий при загрузке страницы
window.onload = loadEvents;