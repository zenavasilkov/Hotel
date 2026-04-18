let currentTab = 'bookings';
let bookings = [];
let rooms = [];
let clients = [];

document.addEventListener('DOMContentLoaded', () => {
    initAdminPanel();
});

async function initAdminPanel() {
    setupEventListeners();
    await loadData();
    updateAdminInfo();
    renderAll();

    document.addEventListener('languageChanged', () => {
        renderAll();
        updateAdminInfo();
    });
}

async function loadData() {
    try {
        const [bookingsRes, roomsRes, usersRes] = await Promise.all([
            fetch('http://localhost:3000/bookings'),
            fetch('http://localhost:3000/rooms'),
            fetch('http://localhost:3000/users')
        ]);

        bookings = await bookingsRes.json();
        rooms = await roomsRes.json();
        clients = await usersRes.json();

    } catch (error) {
        console.error('Ошибка загрузки данных:', error);
        showNotification('Ошибка загрузки данных', 'error');
    }
}

function setupEventListeners() {
    document.querySelectorAll('.admin-nav__link').forEach(btn => {
        btn.addEventListener('click', (e) => switchTab(e.target.dataset.tab));
    });

    document.querySelectorAll('[data-close-modal]').forEach(el => {
        el.addEventListener('click', closeModal);
    });

    document.addEventListener('keydown', e => {
        if (e.key === 'Escape') closeModal();
    });

    document.getElementById('logoutBtn').addEventListener('click', () => {
        localStorage.removeItem('user');
        window.location.href = 'auth.html';
    });

    document.getElementById('exportBookingsBtn')?.addEventListener('click', exportBookingsToCSV);

    document.getElementById('addRoomBtn')?.addEventListener('click', () => openRoomModal());

    document.getElementById('bookingForm')?.addEventListener('submit', handleBookingSubmit);
    document.getElementById('roomForm')?.addEventListener('submit', handleRoomSubmit);

    document.getElementById('clientsSearch')?.addEventListener('input', filterClients);

    document.getElementById('generateReportBtn')?.addEventListener('click', generateReport);

    document.getElementById('reportPeriod')?.addEventListener('change', updateReports);
}

function switchTab(tabName) {
    currentTab = tabName;

    document.querySelectorAll('.admin-nav__link').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.tab === tabName);
        btn.setAttribute('aria-selected', btn.dataset.tab === tabName);
    });

    document.querySelectorAll('.admin-tab').forEach(tab => {
        const isActive = tab.id === `tab-${tabName}`;
        tab.classList.toggle('active', isActive);
        tab.hidden = !isActive;
    });

    if (tabName === 'bookings') {
        renderBookings();
        document.querySelectorAll('.status-badge').forEach(el => {
            const status = el.classList[1]?.replace('status-badge--', '');
            if (status) el.textContent = getStatusText(status);
        });
    }
    else if (tabName === 'rooms') renderRooms();
    else if (tabName === 'clients') renderClients();
    else if (tabName === 'reports') updateReports();
}

function renderAll() {
    renderBookings();
    renderRooms();
    renderClients();
}

function renderBookings() {
    const tbody = document.getElementById('bookingsTableBody');
    if (!tbody) return;

    tbody.innerHTML = '';

    if (bookings.length === 0) {
        tbody.innerHTML = '<tr><td colspan="10" class="table-loading">Нет бронирований</td></tr>';
        updateBookingsStats();
        return;
    }

    bookings.forEach(booking => {
        const tr = createBookingRow(booking);
        tbody.appendChild(tr);
    });

    updateBookingsStats();
}

function createBookingRow(booking) {
    const tr = document.createElement('tr');
    const nights = calculateNights(booking.checkIn, booking.checkOut);

    const adultsText = `${booking.adults} ${I18n.t(booking.adults === 1 ? 'guestAdultSingular' : 'guestAdultPlural')}`;
    const kidsText = booking.kids ? `, ${booking.kids} ${I18n.t(booking.kids === 1 ? 'guestChildSingular' : 'guestChildPlural')}` : '';
    const guests = adultsText + kidsText;

    const roomNameTranslations = {
        'Стандарт': I18n.t('roomStandard'),
        'Люкс': I18n.t('roomLux'),
        'Делюкс': I18n.t('roomDeluxe'),
        'Семейный': I18n.t('roomFamily'),
        'Президентский': I18n.t('roomPresidential'),
        'Студия': I18n.t('roomStudio')
    };
    const translatedRoomName = roomNameTranslations[booking.roomName] || booking.roomName;

    tr.innerHTML = `
        <td><strong>#${booking.id}</strong></td>
        <td>${booking.userName || I18n.t('notSpecified')}</td>
        <td>${booking.userPhone || '—'}</td>
        <td>${translatedRoomName}</td>
        <td>${formatDate(booking.checkIn)}</td>
        <td>${formatDate(booking.checkOut)}</td>
        <td>${guests}</td>
        <td><strong>₽${(booking.totalPrice || nights * 5000).toLocaleString()}</strong></td>
        <td><span class="status-badge status-badge--${booking.status}">${getStatusText(booking.status)}</span></td>
        <td>
            <div class="table-actions">
                <button class="btn-icon btn-icon--primary" onclick="openBookingModal(${booking.id})" title="${I18n.t('btnEdit')}">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
                </button>
                <button class="btn-icon btn-icon--danger" onclick="deleteBooking(${booking.id})" title="${I18n.t('btnDelete')}">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
                </button>
            </div>
        </td>
    `;

    return tr;
}

function updateBookingsStats() {
    const confirmed = bookings.filter(b => b.status === 'confirmed').length;
    const pending = bookings.filter(b => b.status === 'pending').length;
    const revenue = bookings
        .filter(b => b.status === 'confirmed')
        .reduce((sum, b) => sum + (b.totalPrice || 0), 0);

    document.getElementById('statTotalBookings').textContent = bookings.length;
    document.getElementById('statConfirmed').textContent = confirmed;
    document.getElementById('statPending').textContent = pending;
    document.getElementById('statRevenue').textContent = `₽${revenue.toLocaleString()}`;
}

function openBookingModal(id) {
    const booking = bookings.find(b => b.id === id);
    if (!booking) return;

    document.getElementById('bookingId').value = booking.id;
    document.getElementById('userName').value = booking.userName || '';
    document.getElementById('userPhone').value = booking.userPhone || '';
    document.getElementById('checkIn').value = booking.checkIn;
    document.getElementById('checkOut').value = booking.checkOut;
    document.getElementById('adults').value = booking.adults || 1;
    document.getElementById('kids').value = booking.kids || 0;
    document.getElementById('roomName').value = booking.roomName;
    document.getElementById('status').value = booking.status;
    document.getElementById('totalPrice').value = `₽${(booking.totalPrice || 0).toLocaleString()}`;

    document.getElementById('bookingModalTitle').textContent = `Бронирование #${booking.id}`;
    openModal('bookingModal');
}

async function handleBookingSubmit(e) {
    e.preventDefault();

    const id = parseInt(document.getElementById('bookingId').value);
    const updatedBooking = {
        userName: document.getElementById('userName').value,
        userPhone: document.getElementById('userPhone').value,
        checkIn: document.getElementById('checkIn').value,
        checkOut: document.getElementById('checkOut').value,
        adults: parseInt(document.getElementById('adults').value),
        kids: parseInt(document.getElementById('kids').value),
        roomName: document.getElementById('roomName').value,
        status: document.getElementById('status').value,
        totalPrice: parseInt(document.getElementById('totalPrice').value.replace(/[^0-9]/g, ''))
    };

    try {
        await fetch(`http://localhost:3000/bookings/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedBooking)
        });

        const index = bookings.findIndex(b => b.id === id);
        if (index !== -1) {
            bookings[index] = { ...bookings[index], ...updatedBooking };
        }

        closeModal();
        renderBookings();
        showNotification('Бронирование обновлено', 'success');
    } catch (error) {
        showNotification('Ошибка сохранения', 'error');
    }
}

async function deleteBooking(id) {
    if (!confirm('Вы уверены, что хотите удалить это бронирование?')) return;

    try {
        await fetch(`http://localhost:3000/bookings/${id}`, { method: 'DELETE' });
        bookings = bookings.filter(b => b.id !== id);
        renderBookings();
        showNotification('Бронирование удалено', 'success');
    } catch (error) {
        showNotification('Ошибка удаления', 'error');
    }
}

function exportBookingsToCSV() {
    if (bookings.length === 0) {
        showNotification('Нет данных для экспорта', 'warning');
        return;
    }

    const headers = ['ID', 'Гость', 'Телефон', 'Номер', 'Заезд', 'Выезд', 'Взрослые', 'Дети', 'Сумма', 'Статус'];
    const rows = bookings.map(b => [
        b.id,
        b.userName,
        b.userPhone,
        b.roomName,
        b.checkIn,
        b.checkOut,
        b.adults,
        b.kids,
        b.totalPrice,
        b.status
    ]);

    const csvContent = [headers, ...rows].map(row => row.join(';')).join('\n');
    downloadCSV(csvContent, 'bookings_santorini.csv');
}

function renderRooms() {
    const grid = document.getElementById('roomsGrid');
    if (!grid) return;

    grid.innerHTML = '';

    rooms.forEach(room => {
        const card = createRoomCard(room);
        grid.appendChild(card);
    });
}

function createRoomCard(room) {
    const card = document.createElement('div');
    card.className = 'room-card';

    const statusClass = room.available ? 'available' : 'unavailable';
    const statusText = room.available ? I18n.t('roomAvailable') : I18n.t('roomUnavailable');
    const mainImage = room.images && room.images.length > 0 ? room.images[0] : 'assets/images/rooms/default.jpg';

    const displayName = I18n.currentLang === 'ru' ? room.name : (room.nameEn || room.name);

    card.innerHTML = `
        <div class="room-card__image-wrapper">
            <img src="${mainImage}" alt="${displayName}" class="room-card__image" loading="lazy" onerror="this.src='assets/images/rooms/default.jpg'">
        </div>
        <div class="room-card__header">
            <div class="room-card__name">${displayName}</div>
            <div class="room-card__price">₽${room.price.toLocaleString()} / ${I18n.t('perNight')}</div>
        </div>
        <div class="room-card__body">
            <div class="room-card__info">
                <div class="room-card__info-item">
                    <span class="room-card__info-label">${I18n.t('labelArea')}:</span>
                    <span class="room-card__info-value">${room.area} ${I18n.t('sqm')}</span>
                </div>
                <div class="room-card__info-item">
                    <span class="room-card__info-label">${I18n.t('labelGuests')}:</span>
                    <span class="room-card__info-value">${room.guests}</span>
                </div>
                <div class="room-card__info-item">
                    <span class="room-card__info-label">${I18n.t('labelBeds')}:</span>
                    <span class="room-card__info-value">${room.beds}</span>
                </div>
            </div>
            <span class="room-card__status room-card__status--${statusClass}">
                <span class="status-dot"></span>
                ${statusText}
            </span>
        </div>
        <div class="room-card__actions">
            <button class="btn btn--outline" onclick="editRoom(${room.id})">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
                ${I18n.t('btnEdit')}
            </button>
            <button class="btn btn--primary" onclick="toggleRoomAvailability(${room.id})">
                ${room.available ? I18n.t('btnHide') : I18n.t('btnShow')}
            </button>
        </div>
    `;

    return card;
}

function openRoomModal(roomId = null) {
    const form = document.getElementById('roomForm');
    form.reset();

    document.querySelectorAll('.amenity-checkbox').forEach(cb => cb.checked = false);

    if (roomId) {
        const room = rooms.find(r => r.id === roomId);
        if (!room) return;

        document.getElementById('roomId').value = room.id;
        document.getElementById('roomNameInput').value = room.name;
        document.getElementById('roomNameEn').value = room.nameEn;
        document.getElementById('roomCategory').value = room.category;
        document.getElementById('roomPrice').value = room.price;
        document.getElementById('roomArea').value = room.area;
        document.getElementById('roomGuests').value = room.guests;
        document.getElementById('roomBeds').value = room.beds;
        document.getElementById('roomDescription').value = room.description;
        document.getElementById('roomDescriptionEn').value = room.descriptionEn;
        document.getElementById('roomAvailable').checked = room.available;

        if (room.amenities) {
            document.querySelectorAll('.amenity-checkbox').forEach(cb => {
                cb.checked = room.amenities.includes(cb.value);
            });
        }

        if (room.images && room.images.length > 0) {
            document.getElementById('roomImages').value = room.images.join('\n');
        }

        const roomNameDisplay = I18n.currentLang === 'ru' ? room.name : (room.nameEn || room.name);
        document.getElementById('roomModalTitle').textContent = `${I18n.t('modalRoomTitleEdit')} ${roomNameDisplay}`;
    } else {
        document.getElementById('roomModalTitle').textContent = I18n.t('modalRoomTitleAdd');
    }

    openModal('roomModal');
}

function editRoom(id) {
    openRoomModal(id);
}

async function handleRoomSubmit(e) {
    e.preventDefault();

    const id = document.getElementById('roomId').value;

    const amenities = Array.from(document.querySelectorAll('.amenity-checkbox:checked'))
        .map(cb => cb.value);

    const imagesText = document.getElementById('roomImages').value.trim();
    const images = imagesText ? imagesText.split('\n').map(url => url.trim()).filter(url => url) : [];

    const roomData = {
        name: document.getElementById('roomNameInput').value,
        nameEn: document.getElementById('roomNameEn').value,
        category: document.getElementById('roomCategory').value,
        price: parseInt(document.getElementById('roomPrice').value),
        area: parseInt(document.getElementById('roomArea').value),
        guests: parseInt(document.getElementById('roomGuests').value),
        beds: parseInt(document.getElementById('roomBeds').value),
        description: document.getElementById('roomDescription').value,
        descriptionEn: document.getElementById('roomDescriptionEn').value,
        amenities: amenities,
        images: images,
        available: document.getElementById('roomAvailable').checked
    };

    try {
        if (id) {
            await fetch(`http://localhost:3000/rooms/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(roomData)
            });

            const index = rooms.findIndex(r => r.id === parseInt(id));
            if (index !== -1) {
                rooms[index] = { ...rooms[index], ...roomData, id: parseInt(id) };
            }

            showNotification('Номер успешно обновлён', 'success');
        } else {
            const response = await fetch('http://localhost:3000/rooms', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(roomData)
            });

            const newRoom = await response.json();
            rooms.push(newRoom);

            showNotification('Номер успешно добавлен', 'success');
        }

        closeModal();
        renderRooms();
    } catch (error) {
        console.error('Ошибка сохранения номера:', error);
        showNotification('Ошибка сохранения номера', 'error');
    }
}

async function toggleRoomAvailability(id) {
    const room = rooms.find(r => r.id === id);
    if (!room) return;

    try {
        await fetch(`http://localhost:3000/rooms/${id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ available: !room.available })
        });

        room.available = !room.available;
        renderRooms();
        showNotification(`Номер ${room.available ? 'доступен' : 'скрыт'}`, 'success');
    } catch (error) {
        showNotification('Ошибка обновления', 'error');
    }
}

function renderClients() {
    const tbody = document.getElementById('clientsTableBody');
    if (!tbody) return;

    tbody.innerHTML = '';

    const filteredClients = filterClientsList(clients);

    if (filteredClients.length === 0) {
        tbody.innerHTML = '<tr><td colspan="8" class="table-loading">Клиенты не найдены</td></tr>';
        updateClientsStats();
        return;
    }

    filteredClients.forEach(client => {
        const tr = createClientRow(client);
        tbody.appendChild(tr);
    });

    updateClientsStats();
}

function createClientRow(client) {
    const tr = document.createElement('tr');
    const roleClass = client.role === 'admin' ? 'admin' : 'user';
    const roleText = client.role === 'admin' ? I18n.t('roleAdmin') : I18n.t('roleClient');

    tr.innerHTML = `
		<td><strong>#${client.id}</strong></td>
		<td>${client.fullName || client.nickname || '—'}</td>
		<td>${client.email}</td>
		<td>${client.phone || '—'}</td>
		<td>${client.nickname || '—'}</td>
		<td><span class="badge badge--${roleClass}">${roleText}</span></td>
		<td>${formatDate(client.createdAt || 'N/A')}</td>
		<td>
			<div class="table-actions">
				<button class="btn-icon btn-icon--primary" onclick="viewClientBookings(${client.id})" title="Бронирования">
					<svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
				</button>
				${client.role !== 'admin' ? `
				<button class="btn-icon btn-icon--danger" onclick="deleteClient(${client.id})" title="Удалить">
					<svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
				</button>
				` : ''}
			</div>
		</td>
	`;

    return tr;
}

function filterClientsList(clientsList) {
    const searchTerm = document.getElementById('clientsSearch')?.value.toLowerCase() || '';
    if (!searchTerm) return clientsList;

    return clientsList.filter(client =>
        (client.fullName || '').toLowerCase().includes(searchTerm) ||
        (client.email || '').toLowerCase().includes(searchTerm) ||
        (client.nickname || '').toLowerCase().includes(searchTerm)
    );
}

function filterClients() {
    renderClients();
}

function updateClientsStats() {
    const admins = clients.filter(c => c.role === 'admin').length;

    document.getElementById('statTotalClients').textContent = clients.length;
    document.getElementById('statAdmins').textContent = admins;
}

function viewClientBookings(clientId) {
    const clientBookings = bookings.filter(b => b.userId === clientId);
    if (clientBookings.length === 0) {
        showNotification('У клиента нет бронирований', 'info');
        return;
    }

    const rows = document.querySelectorAll('#bookingsTableBody tr');
    rows.forEach(row => {
        const bookingId = row.querySelector('td')?.textContent?.replace('#', '');
        const booking = bookings.find(b => b.id === parseInt(bookingId));
        row.style.display = booking && booking.userId === clientId ? '' : 'none';
    });

    switchTab('bookings');
    showNotification(`Показаны бронирования клиента #${clientId}`, 'info');
}

async function deleteClient(id) {
    if (!confirm('Вы уверены, что хотите удалить этого клиента?')) return;

    try {
        await fetch(`http://localhost:3000/users/${id}`, { method: 'DELETE' });
        clients = clients.filter(c => c.id !== id);
        renderClients();
        showNotification('Клиент удалён', 'success');
    } catch (error) {
        showNotification('Ошибка удаления', 'error');
    }
}

function updateReports() {
    const period = document.getElementById('reportPeriod')?.value || 'month';
    calculateReports(period);
}

function calculateReports(period) {
    const now = new Date();
    const startDate = new Date();

    if (period === 'week') startDate.setDate(now.getDate() - 7);
    else if (period === 'month') startDate.setMonth(now.getMonth() - 1);
    else if (period === 'year') startDate.setFullYear(now.getFullYear() - 1);

    const periodBookings = bookings.filter(b => {
        const bookingDate = new Date(b.createdAt);
        return bookingDate >= startDate;
    });

    const confirmedBookings = periodBookings.filter(b => b.status === 'confirmed');
    const totalRevenue = confirmedBookings.reduce((sum, b) => sum + (b.totalPrice || 0), 0);
    const avgCheck = confirmedBookings.length > 0 ? totalRevenue / confirmedBookings.length : 0;

    const roomsCount = {};
    confirmedBookings.forEach(b => {
        roomsCount[b.roomName] = (roomsCount[b.roomName] || 0) + 1;
    });

    const sortedRooms = Object.entries(roomsCount)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5);

    document.getElementById('totalRevenue').textContent = `₽${totalRevenue.toLocaleString()}`;
    document.getElementById('avgCheck').textContent = `₽${Math.round(avgCheck).toLocaleString()}`;
    document.getElementById('totalBookingsReport').textContent = confirmedBookings.length;

    const roomNameTranslations = {
        'Стандарт': I18n.t('roomStandard'),
        'Люкс': I18n.t('roomLux'),
        'Делюкс': I18n.t('roomDeluxe'),
        'Семейный': I18n.t('roomFamily'),
        'Президентский': I18n.t('roomPresidential'),
        'Студия': I18n.t('roomStudio')
    };

    const popularRoomsEl = document.getElementById('popularRooms');
    if (popularRoomsEl) {
        popularRoomsEl.innerHTML = sortedRooms.map(([name, count]) => `
            <div class="report-list-item">
                <span class="report-list-item__name">${roomNameTranslations[name] || name}</span>
                <span class="report-list-item__value">${count} ${I18n.t(count === 1 ? 'bookingSingular' : 'bookingPlural')}</span>
            </div>
        `).join('') || `<div class="text-muted">${I18n.t('noData')}</div>`;
    }

    const totalDays = periodBookings.reduce((sum, b) => {
        return sum + calculateNights(b.checkIn, b.checkOut);
    }, 0);
    const avgOccupancy = rooms.length > 0 ? Math.round((totalDays / (rooms.length * 30)) * 100) : 0;
    document.getElementById('avgOccupancy').textContent = `${Math.min(avgOccupancy, 100)}%`;
}

function generateReport() {
    const period = document.getElementById('reportPeriod').value;
    const periodText = {
        week: I18n.t('reportPeriodWeek'),
        month: I18n.t('reportPeriodMonth'),
        year: I18n.t('reportPeriodYear')
    }[period];

    const report = {
        period: periodText,
        date: new Date().toLocaleString('ru-RU'),
        totalBookings: bookings.length,
        confirmedBookings: bookings.filter(b => b.status === 'confirmed').length,
        totalRevenue: bookings.filter(b => b.status === 'confirmed').reduce((sum, b) => sum + (b.totalPrice || 0), 0),
        totalRooms: rooms.length,
        totalClients: clients.filter(c => c.role === 'user').length
    };

    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `report_santorini_${period}_${Date.now()}.json`;
    a.click();

    showNotification('Отчёт сгенерирован', 'success');
}

function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('active');
        modal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
    }
}

function closeModal() {
    document.querySelectorAll('.modal').forEach(modal => {
        modal.classList.remove('active');
        modal.setAttribute('aria-hidden', 'true');
    });
    document.body.style.overflow = '';
}

function calculateNights(checkIn, checkOut) {
    if (!checkIn || !checkOut) return 1;
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const diff = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    return diff > 0 ? diff : 1;
}

function formatDate(dateStr) {
    if (!dateStr || dateStr === 'N/A') return '—';
    const date = new Date(dateStr);
    return date.toLocaleDateString('ru-RU');
}

function getStatusText(status) {
    const statusKeys = {
        pending: 'statusPending',
        confirmed: 'statusConfirmed',
        cancelled: 'statusCancelled'
    };
    return I18n.t(statusKeys[status] || status);
}

function downloadCSV(content, filename) {
    const blob = new Blob(['\uFEFF' + content], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
}

function showNotification(message, type = 'info') {
    const colors = {
        success: '#22c55e',
        error: '#ef4444',
        warning: '#f59e0b',
        info: '#3b82f6'
    };

    console.log(`[${type.toUpperCase()}] ${message}`);
}

function updateAdminInfo() {
    const user = JSON.parse(localStorage.getItem('currentUser') || '{}');
    const nameEl = document.getElementById('adminName');
    if (nameEl) {
        const adminName = user.fullName?.split(' ')[0] || user.nickname || user.email?.split('@')[0] || I18n.t('adminDefault');
        nameEl.textContent = adminName;
    }
}
