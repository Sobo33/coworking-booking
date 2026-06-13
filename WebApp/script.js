const spaces = [
    {
        id: 1,
        name: "Панорама",
        type: "open",
        typeLabel: "Открытое место",
        address: "м. Смоленская, Новый Арбат, 21",
        district: "Арбат",
        capacity: 1,
        price: 350,
        rating: 4.9,
        image: "assets/open-space.jpg",
        features: ["Wi-Fi", "Кофе", "Принтер"],
        description: "Светлая рабочая зона с большими окнами, удобными креслами и общими столами. Подходит для индивидуальной работы на несколько часов или полный день."
    },
    {
        id: 2,
        name: "Фокус",
        type: "office",
        typeLabel: "Приватный кабинет",
        address: "м. Белорусская, Лесная улица, 7",
        district: "Белорусская",
        capacity: 2,
        price: 750,
        rating: 4.8,
        image: "assets/private-office.jpg",
        features: ["Тишина", "Монитор", "Кондиционер"],
        description: "Небольшой закрытый кабинет для одного или двух человек. Здесь удобно проводить созвоны, работать с документами и сосредоточиться без постороннего шума."
    },
    {
        id: 3,
        name: "Диалог",
        type: "meeting",
        typeLabel: "Переговорная",
        address: "м. Павелецкая, Дербеневская набережная, 11",
        district: "Павелецкая",
        capacity: 6,
        price: 1200,
        rating: 4.7,
        image: "assets/meeting-room.jpg",
        features: ["Экран", "Доска", "Видеосвязь"],
        description: "Переговорная комната для встреч, презентаций и командной работы. В стоимость входят большой экран, маркерная доска и оборудование для видеосвязи."
    },
    {
        id: 4,
        name: "Зелёный этаж",
        type: "open",
        typeLabel: "Открытое место",
        address: "м. Курская, Нижний Сусальный переулок, 5",
        district: "Курская",
        capacity: 1,
        price: 300,
        rating: 4.6,
        image: "assets/open-space.jpg",
        features: ["Wi-Fi", "Кухня", "Лаунж"],
        description: "Спокойная открытая зона с растениями и отдельными местами для коротких звонков. В течение дня доступны кухня и небольшая зона отдыха."
    },
    {
        id: 5,
        name: "Кабинет 24",
        type: "office",
        typeLabel: "Приватный кабинет",
        address: "м. Тульская, Большая Тульская улица, 19",
        district: "Тульская",
        capacity: 2,
        price: 680,
        rating: 4.5,
        image: "assets/private-office.jpg",
        features: ["Тишина", "Лампы", "Шкаф"],
        description: "Компактный кабинет с двумя рабочими столами и местом для хранения вещей. Подходит для совместной работы над небольшим проектом."
    },
    {
        id: 6,
        name: "Большая встреча",
        type: "meeting",
        typeLabel: "Переговорная",
        address: "м. Динамо, Ленинградский проспект, 36",
        district: "Динамо",
        capacity: 10,
        price: 1650,
        rating: 4.9,
        image: "assets/meeting-room.jpg",
        features: ["Экран", "Камера", "Флипчарт"],
        description: "Просторная переговорная для команд до десяти человек. Комната подходит для собеседований, учебных занятий и деловых презентаций."
    }
];

const state = {
    activeType: "all",
    selectedSpaceId: null,
    modalSpaceId: null,
    bookings: loadBookings()
};

const spaceGrid = document.getElementById("spaceGrid");
const resultCount = document.getElementById("resultCount");
const emptyState = document.getElementById("emptyState");
const typeFilters = document.getElementById("typeFilters");
const searchForm = document.getElementById("searchForm");
const searchInput = document.getElementById("searchInput");
const searchDate = document.getElementById("searchDate");
const guestFilter = document.getElementById("guestFilter");
const selectedPlaceholder = document.getElementById("selectedPlaceholder");
const selectedSpace = document.getElementById("selectedSpace");
const selectedImage = document.getElementById("selectedImage");
const selectedType = document.getElementById("selectedType");
const selectedName = document.getElementById("selectedName");
const selectedAddress = document.getElementById("selectedAddress");
const bookingForm = document.getElementById("bookingForm");
const bookingDate = document.getElementById("bookingDate");
const bookingTime = document.getElementById("bookingTime");
const bookingDuration = document.getElementById("bookingDuration");
const bookingGuests = document.getElementById("bookingGuests");
const totalPrice = document.getElementById("totalPrice");
const formMessage = document.getElementById("formMessage");
const bookingButton = bookingForm.querySelector(".booking-button");
const bookingList = document.getElementById("bookingList");
const bookingEmpty = document.getElementById("bookingEmpty");
const historyCount = document.getElementById("historyCount");
const themeButton = document.getElementById("themeButton");
const spaceModal = document.getElementById("spaceModal");
const modalClose = document.getElementById("modalClose");
const modalImage = document.getElementById("modalImage");
const modalType = document.getElementById("modalType");
const modalTitle = document.getElementById("modalTitle");
const modalAddress = document.getElementById("modalAddress");
const modalDescription = document.getElementById("modalDescription");
const modalAmenities = document.getElementById("modalAmenities");
const modalSelect = document.getElementById("modalSelect");
const toast = document.getElementById("toast");

function loadBookings() {
    try {
        return JSON.parse(localStorage.getItem("coworkingBookings")) || [];
    } catch {
        return [];
    }
}

function saveBookings() {
    localStorage.setItem("coworkingBookings", JSON.stringify(state.bookings));
}

function formatPrice(value) {
    return `${value.toLocaleString("ru-RU")} ₽`;
}

function formatDate(value) {
    if (!value) {
        return "";
    }

    return new Date(`${value}T12:00:00`).toLocaleDateString("ru-RU", {
        day: "numeric",
        month: "long"
    });
}

function getFilteredSpaces() {
    const query = searchInput.value.trim().toLowerCase();
    const guests = Number(guestFilter.value);

    return spaces.filter((space) => {
        const matchesType = state.activeType === "all" || space.type === state.activeType;
        const matchesGuests = space.capacity >= guests;
        const matchesQuery = space.name.toLowerCase().includes(query)
            || space.address.toLowerCase().includes(query)
            || space.district.toLowerCase().includes(query);

        return matchesType && matchesGuests && matchesQuery;
    });
}

function renderSpaces() {
    const filteredSpaces = getFilteredSpaces();

    spaceGrid.innerHTML = "";
    resultCount.textContent = `${filteredSpaces.length} вариантов`;
    emptyState.classList.toggle("show", filteredSpaces.length === 0);

    filteredSpaces.forEach((space) => {
        const card = document.createElement("article");
        card.className = `space-card ${state.selectedSpaceId === space.id ? "selected" : ""}`;
        card.innerHTML = `
            <div class="space-image">
                <img src="${space.image}" alt="${space.name}">
                <span class="availability">Свободно</span>
            </div>
            <div class="space-body">
                <div class="space-meta">
                    <span class="space-type">${space.typeLabel}</span>
                    <span class="rating">★ ${space.rating}</span>
                </div>
                <h3>${space.name}</h3>
                <p class="space-address">${space.address}</p>
                <div class="feature-list">
                    ${space.features.map((feature) => `<span>${feature}</span>`).join("")}
                    <span>До ${space.capacity} чел.</span>
                </div>
                <div class="card-footer">
                    <div class="space-price">
                        <small>Стоимость за час</small>
                        <strong>${formatPrice(space.price)}</strong>
                    </div>
                    <div class="card-actions">
                        <button class="details-button" type="button" data-action="details" data-id="${space.id}">Подробнее</button>
                        <button class="select-button" type="button" data-action="select" data-id="${space.id}">
                            ${state.selectedSpaceId === space.id ? "Выбрано" : "Выбрать"}
                        </button>
                    </div>
                </div>
            </div>
        `;

        spaceGrid.appendChild(card);
    });
}

function selectSpace(spaceId) {
    const space = spaces.find((item) => item.id === spaceId);

    if (!space) {
        return;
    }

    state.selectedSpaceId = spaceId;
    selectedPlaceholder.hidden = true;
    selectedSpace.hidden = false;
    selectedImage.src = space.image;
    selectedImage.alt = space.name;
    selectedType.textContent = space.typeLabel;
    selectedName.textContent = space.name;
    selectedAddress.textContent = space.address;
    bookingGuests.max = space.capacity;
    bookingGuests.value = Math.min(Number(bookingGuests.value), space.capacity);
    bookingButton.disabled = false;
    clearFormMessage();
    updateTotal();
    renderSpaces();
}

function updateTotal() {
    const space = spaces.find((item) => item.id === state.selectedSpaceId);
    const duration = Number(bookingDuration.value);
    const total = space ? space.price * duration : 0;
    totalPrice.textContent = formatPrice(total);
}

function showFormMessage(text) {
    formMessage.textContent = text;
    formMessage.classList.add("show");
}

function clearFormMessage() {
    formMessage.textContent = "";
    formMessage.classList.remove("show");
}

function renderBookings() {
    bookingList.innerHTML = "";
    historyCount.textContent = state.bookings.length;
    bookingEmpty.hidden = state.bookings.length > 0;

    state.bookings.forEach((booking) => {
        const item = document.createElement("li");
        item.innerHTML = `
            <strong>${booking.spaceName}</strong>
            <span>${formatDate(booking.date)}, ${booking.time} · ${booking.duration} ч. · ${formatPrice(booking.total)}</span>
            <button class="cancel-booking" type="button" data-id="${booking.id}" aria-label="Отменить бронирование">×</button>
        `;
        bookingList.appendChild(item);
    });
}

function openModal(spaceId) {
    const space = spaces.find((item) => item.id === spaceId);

    if (!space) {
        return;
    }

    state.modalSpaceId = spaceId;
    modalImage.src = space.image;
    modalImage.alt = space.name;
    modalType.textContent = space.typeLabel;
    modalTitle.textContent = space.name;
    modalAddress.textContent = space.address;
    modalDescription.textContent = space.description;
    modalAmenities.innerHTML = space.features
        .concat(`До ${space.capacity} человек`)
        .map((feature) => `<span>${feature}</span>`)
        .join("");
    spaceModal.classList.add("show");
    spaceModal.setAttribute("aria-hidden", "false");
}

function closeModal() {
    spaceModal.classList.remove("show");
    spaceModal.setAttribute("aria-hidden", "true");
    state.modalSpaceId = null;
}

function showToast(text) {
    toast.textContent = text;
    toast.classList.add("show");

    window.clearTimeout(showToast.timer);
    showToast.timer = window.setTimeout(() => {
        toast.classList.remove("show");
    }, 2800);
}

function setTheme(isDark) {
    document.body.classList.toggle("dark-theme", isDark);
    themeButton.textContent = isDark ? "Светлая тема" : "Тёмная тема";
    localStorage.setItem("coworkingTheme", isDark ? "dark" : "light");
}

typeFilters.addEventListener("click", (event) => {
    const button = event.target.closest("button");

    if (!button) {
        return;
    }

    state.activeType = button.dataset.type;
    typeFilters.querySelectorAll("button").forEach((item) => {
        item.classList.toggle("active", item === button);
    });
    renderSpaces();
});

searchForm.addEventListener("submit", (event) => {
    event.preventDefault();
    bookingDate.value = searchDate.value;
    bookingGuests.value = guestFilter.value;
    renderSpaces();
    document.getElementById("spaces").scrollIntoView({ behavior: "smooth", block: "start" });
});

searchInput.addEventListener("input", renderSpaces);
guestFilter.addEventListener("change", renderSpaces);

spaceGrid.addEventListener("click", (event) => {
    const button = event.target.closest("button");

    if (!button) {
        return;
    }

    const spaceId = Number(button.dataset.id);

    if (button.dataset.action === "details") {
        openModal(spaceId);
        return;
    }

    selectSpace(spaceId);
    document.getElementById("booking").scrollIntoView({ behavior: "smooth", block: "start" });
});

bookingDuration.addEventListener("change", updateTotal);

bookingGuests.addEventListener("input", () => {
    const space = spaces.find((item) => item.id === state.selectedSpaceId);
    clearFormMessage();

    if (space && Number(bookingGuests.value) > space.capacity) {
        showFormMessage(`Максимальная вместимость: ${space.capacity} человек.`);
    }
});

bookingForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const space = spaces.find((item) => item.id === state.selectedSpaceId);

    if (!space) {
        showFormMessage("Сначала выберите пространство.");
        return;
    }

    const guests = Number(bookingGuests.value);

    if (!bookingDate.value) {
        showFormMessage("Укажите дату бронирования.");
        return;
    }

    if (guests < 1 || guests > space.capacity) {
        showFormMessage(`Укажите от 1 до ${space.capacity} гостей.`);
        return;
    }

    const duration = Number(bookingDuration.value);
    const booking = {
        id: Date.now(),
        spaceId: space.id,
        spaceName: space.name,
        date: bookingDate.value,
        time: bookingTime.value,
        duration,
        guests,
        total: space.price * duration
    };

    state.bookings.unshift(booking);
    saveBookings();
    renderBookings();
    clearFormMessage();
    showToast(`Бронирование «${space.name}» оформлено`);
});

bookingList.addEventListener("click", (event) => {
    const button = event.target.closest("button");

    if (!button) {
        return;
    }

    const bookingId = Number(button.dataset.id);
    state.bookings = state.bookings.filter((booking) => booking.id !== bookingId);
    saveBookings();
    renderBookings();
    showToast("Бронирование отменено");
});

modalClose.addEventListener("click", closeModal);

spaceModal.addEventListener("click", (event) => {
    if (event.target === spaceModal) {
        closeModal();
    }
});

modalSelect.addEventListener("click", () => {
    if (state.modalSpaceId !== null) {
        const spaceId = state.modalSpaceId;
        closeModal();
        selectSpace(spaceId);
        document.getElementById("booking").scrollIntoView({ behavior: "smooth", block: "start" });
    }
});

document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && spaceModal.classList.contains("show")) {
        closeModal();
    }
});

themeButton.addEventListener("click", () => {
    setTheme(!document.body.classList.contains("dark-theme"));
});

const now = new Date();
const today = [
    now.getFullYear(),
    String(now.getMonth() + 1).padStart(2, "0"),
    String(now.getDate()).padStart(2, "0")
].join("-");
searchDate.min = today;
bookingDate.min = today;
searchDate.value = today;
bookingDate.value = today;

setTheme(localStorage.getItem("coworkingTheme") === "dark");
renderSpaces();
renderBookings();
