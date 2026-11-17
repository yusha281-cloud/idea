// ====== ВЫБОР УСЛУГ + ИТОГОВАЯ СУММА ======
document.addEventListener("DOMContentLoaded", function () {
    const servicesList = document.getElementById("servicesList");
    const totalPriceElement = document.getElementById("totalPrice");
    const selectedServicesInput = document.getElementById("selectedServices");
    const totalPriceInput = document.getElementById("totalPriceInput");

    if (!servicesList || !totalPriceElement || !selectedServicesInput) {
        console.error("Не найдены элементы выбора услуг!");
        return;
    }

    function updateServices() {
        let total = 0;
        const selectedServices = [];

        servicesList.querySelectorAll(".service-item").forEach(item => {
            const price = Number(item.dataset.price);
            const quantity = Number(item.querySelector(".quantity").textContent);
            const name = item.querySelector(".service-name").textContent;

            total += price * quantity;

            if (quantity > 0) {
                selectedServices.push(name + " × " + quantity);
            }
        });

        totalPriceElement.textContent = total + " ₽";
        selectedServicesInput.value = selectedServices.join("; ");
        if (totalPriceInput) totalPriceInput.value = total + " ₽";
    }

    // Обработка кликов по плюсу и минусу
    servicesList.addEventListener("click", function (event) {
        const button = event.target.closest(".quantity-btn");
        if (!button) return;

        const item = button.closest(".service-item");
        if (!item) return;

        const quantityElement = item.querySelector(".quantity");
        let quantity = Number(quantityElement.textContent);

        if (button.classList.contains("plus")) quantity++;
        if (button.classList.contains("minus")) quantity = Math.max(0, quantity - 1);

        quantityElement.textContent = quantity;
        updateServices();
    });

    // ====== МИНИМАЛЬНАЯ ДАТА И ВАЛИДАЦИЯ ======
    const dateInput = document.getElementById("date");
    const message = document.getElementById("message");
    const form = document.getElementById("bookingForm");

    const today = new Date();
    const localDate = new Date(today.getTime() - today.getTimezoneOffset() * 60000)
        .toISOString().split("T")[0];
    dateInput.min = localDate;

    form.addEventListener("submit", function (event) {
        const services = selectedServicesInput.value;

        if (!services) {
            event.preventDefault();
            event.stopImmediatePropagation();
            message.textContent = "Пожалуйста, выберите хотя бы одну услугу.";
            return;
        }

        message.textContent = "";
    }, true); // capture=true срабатывает раньше Formspree
});

// ====== ИНИЦИАЛИЗАЦИЯ FORMSPREE ======
window.formspree = window.formspree || function () {
    (formspree.q = formspree.q || []).push(arguments);
};

window.formspree('initForm', {
    formElement: '#bookingForm',
    formId: 'xrpqqpgn'
});

// Подключаем библиотеку Formspree
document.addEventListener("DOMContentLoaded", function () {
    const script = document.createElement("script");
    script.src = "https://unpkg.com/@formspree/ajax@1";
    script.defer = true;
    document.head.appendChild(script);
});

// ====== СБРОС ФОРМЫ ПОСЛЕ УСПЕШНОЙ ОТПРАВКИ ======
document.addEventListener("DOMContentLoaded", function () {
    const successContainer = document.querySelector("[data-fs-success]");
    const form = document.getElementById("bookingForm");
    
    if (!successContainer || !form) return;

    const observer = new MutationObserver(() => {
        if (successContainer.textContent.trim()) {
            form.reset();
            document.querySelectorAll(".quantity").forEach(el => el.textContent = "0");
            
            // Сбрасываем сумму и скрытые поля
            document.getElementById("totalPrice").textContent = "0 ₽";
            document.getElementById("selectedServices").value = "";
            document.getElementById("totalPriceInput").value = "0 ₽";
        }
    });

observer.observe(successContainer, { childList: true, characterData: true, subtree: true });
});

