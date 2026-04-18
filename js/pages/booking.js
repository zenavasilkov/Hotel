document.addEventListener('DOMContentLoaded', async () => {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) {
        window.location.href = 'auth.html';
        return;
    }

    const urlParams = new URLSearchParams(window.location.search);
    const roomId = urlParams.get('roomId');

    if (!roomId) {
        window.location.href = 'rooms.html';
        return;
    }

    let roomPrice = 0;
    const form = document.getElementById('booking-form');
    const checkInInput = document.getElementById('check-in');
    const checkOutInput = document.getElementById('check-out');
    const phoneInput = document.getElementById('user-phone');
    const nightsEl = document.getElementById('nights-count');
    const totalEl = document.getElementById('total-price');
    const errorEl = document.getElementById('date-error');

    const today = new Date().toISOString().split('T')[0];
    checkInInput.min = today;

    const formatPhoneNumber = (value) => {
        if (!value) return '+375 ';
        const phoneNumber = value.replace(/[^\d]/g, '');
        const phoneNumberLength = phoneNumber.length;

        if (phoneNumberLength < 4) return `+${phoneNumber}`;
        if (phoneNumberLength < 6) {
            return `+${phoneNumber.slice(0, 3)} (${phoneNumber.slice(3)}`;
        }
        if (phoneNumberLength < 9) {
            return `+${phoneNumber.slice(0, 3)} (${phoneNumber.slice(3, 5)}) ${phoneNumber.slice(5)}`;
        }
        if (phoneNumberLength < 11) {
            return `+${phoneNumber.slice(0, 3)} (${phoneNumber.slice(3, 5)}) ${phoneNumber.slice(5, 8)}-${phoneNumber.slice(8)}`;
        }
        return `+${phoneNumber.slice(0, 3)} (${phoneNumber.slice(3, 5)}) ${phoneNumber.slice(5, 8)}-${phoneNumber.slice(8, 10)}-${phoneNumber.slice(10, 12)}`;
    };

    document.getElementById('user-name').value = currentUser.firstName || '';
    document.getElementById('user-surname').value = currentUser.lastName || '';

    if (currentUser.phone) {
        phoneInput.value = formatPhoneNumber(currentUser.phone);
    } else {
        phoneInput.value = '+375 ';
    }

    phoneInput.addEventListener('input', (e) => {
        e.target.value = formatPhoneNumber(e.target.value);
    });

    phoneInput.addEventListener('keydown', (e) => {
        if (e.target.value.length <= 5 && e.keyCode === 8) {
            e.preventDefault();
        }
    });

    try {
        const room = await FetchAPI.get(`${API_ENDPOINTS.ROOMS}/${roomId}`);
        if (!room) throw new Error('Room not found');

        roomPrice = room.price;
        document.getElementById('room-img').src = room.images[0];
        const roomName = I18n.currentLang === 'ru' ? room.name : room.nameEn;
        document.getElementById('room-name').textContent = roomName;
        document.getElementById('room-price-val').textContent = roomPrice.toLocaleString();
    } catch (e) {
        window.location.href = '404.html';
        return;
    }

    function calculateBooking() {
        const d1 = new Date(checkInInput.value);
        const d2 = new Date(checkOutInput.value);

        if (checkInInput.value && checkOutInput.value) {
            if (d2 > d1) {
                const diffTime = Math.abs(d2 - d1);
                const nights = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

                errorEl.style.display = 'none';
                nightsEl.textContent = nights;
                totalEl.textContent = (nights * roomPrice).toLocaleString() + ' ' + I18n.t('currency');
                return nights;
            } else {
                errorEl.style.display = 'block';
                nightsEl.textContent = '0';
                totalEl.textContent = '0 ' + I18n.t('currency');
                return 0;
            }
        }
        return 0;
    }

    checkInInput.addEventListener('change', () => {
        checkOutInput.min = checkInInput.value;
        calculateBooking();
    });
    checkOutInput.addEventListener('change', calculateBooking);

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const nights = calculateBooking();
        if (nights <= 0) return;

        const bookingData = {
            userId: currentUser.id,
            roomId: parseInt(roomId),
            roomName: document.getElementById('room-name').textContent,
            userName: `${document.getElementById('user-name').value} ${document.getElementById('user-surname').value}`,
            userPhone: phoneInput.value,
            checkIn: checkInInput.value,
            checkOut: checkOutInput.value,
            adults: parseInt(document.getElementById('guests-adults').value),
            kids: parseInt(document.getElementById('guests-kids').value),
            totalPrice: nights * roomPrice,
            status: "pending",
            createdAt: new Date().toISOString()
        };

        try {
            const res = await FetchAPI.post(API_ENDPOINTS.BOOKINGS, bookingData);
            if (res) {
                alert(I18n.t('bookingSuccess'));
                window.location.href = 'index.html';
            }
        } catch (err) {
            alert(I18n.t('bookingError'));
        }
    });

    document.addEventListener('languageChanged', () => {
        updateSelectOptions();
        calculateBooking();
    });

    function updateSelectOptions() {
        const adultsSelect = document.getElementById('guests-adults');
        const kidsSelect = document.getElementById('guests-kids');

        const adultsOptions = adultsSelect.querySelectorAll('option');
        adultsOptions.forEach(opt => {
            opt.textContent = I18n.t(opt.dataset.i18n);
        });

        const kidsOptions = kidsSelect.querySelectorAll('option');
        kidsOptions.forEach(opt => {
            opt.textContent = I18n.t(opt.dataset.i18n);
        });
    }

    updateSelectOptions();
});
