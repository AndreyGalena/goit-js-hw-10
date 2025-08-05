import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";
import { Russian } from "flatpickr/dist/l10n/ru.js";
import { German } from "flatpickr/dist/l10n/de.js";  // Немецкий

import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";

// Пример уведомления
// iziToast.success({
//     title: 'Успех',
//     message: 'Операция выполнена успешно!',
//     position: 'topRight'
// });

// iziToast.error({
//     title: 'Ошибка',
//     message: 'Что-то пошло не так...',
//     position: 'topRight'
// });
iziToast.info({
    title: 'Информация',
    message: 'Выбери дату для запуска обратного отщёта.',
    messageColor: 'white',
    position: 'center',
    timeout: 5000,
    progressBar: true,
    close: true,
    backgroundColor: "rgb(0 140 255)"
});


const input = document.getElementById('datetime-picker');
const btnStart = document.querySelector('button[data-start]');
let userSelectedDate = null;
let countdownInterval = null;
// кнопка не активная.
btnStart.disabled = true;


function convertMs(ms) {
    // Number of milliseconds per unit of time
    const second = 1000;
    const minute = second * 60;
    const hour = minute * 60;
    const day = hour * 24;

    // Remaining days
    const days = Math.floor(ms / day);
    // Remaining hours
    const hours = Math.floor((ms % day) / hour);
    // Remaining minutes
    const minutes = Math.floor(((ms % day) % hour) / minute);
    // Remaining seconds
    const seconds = Math.floor((((ms % day) % hour) % minute) / second);

    return { days, hours, minutes, seconds };
}

flatpickr("#datetime-picker", {
    enableTime: true,
    dateFormat: "d.m.Y   H:i",
    // отк. мобильную версию.
    disableMobile: true,
    locale: Russian, // язык интерфейса
    // locale: German, // переключение на немецкий

    time_24hr: true,
    defaultDate: new Date(),
    minuteIncrement: 1,
    onClose(selectedDates) {
        userSelectedDate = selectedDates[0];

        if (userSelectedDate <= new Date()) {
            iziToast.success({
                title: 'Внимание',
                message: 'Пожалуйста, выберите дату в будущем.!',
                messageColor: 'red',
                position: 'center',
                timeout: 4000, // время отображения в мс
                progressBar: true,
                close: true,
                backgroundColor: 'rgb(0 140 255)',
            });
        } else {
            // input активен
            input.disabled = false;
            // кнопка активная.
            btnStart.disabled = false;
            btnStart.classList.replace("notActive", "button");
        }
    },
});


btnStart.addEventListener('click', () => {
    if (!userSelectedDate) {
        iziToast.warning({
            title: 'Внимание',
            message: 'Сначала выберите дату!',
            messageColor: 'red',
            position: 'center',
            timeout: 3000, // время отображения в мс
            progressBar: true,
            close: true,
            backgroundColor: 'rgb(0 140 255)',
        });
        return;
    }

    // input не активен
    input.disabled = true;
    btnStart.disabled = true; // блокируем кнопку после запуска
    btnStart.classList.replace("button", "notActive");

    countdownInterval = setInterval(() => {
        const now = new Date();
        const delta = userSelectedDate - now;

        if (delta <= 0) {
            clearInterval(countdownInterval);
            updateTimerDisplay({ days: 0, hours: 0, minutes: 0, seconds: 0 });
            iziToast.success({
                title: 'Внимание',
                message: 'Время вышло!',
                messageColor: 'white',
                position: 'center',
                timeout: 4000, // время отображения в мс
                progressBar: true,
                close: true,
                backgroundColor: 'rgb(0 140 255)',
            });
            // input активен
            input.disabled = false;
            return;
        }

        const timeLeft = convertMs(delta);
        updateTimerDisplay(timeLeft);
    }, 1000);
});

function updateTimerDisplay({ days, hours, minutes, seconds }) {
    document.querySelector('[data-days]').textContent = String(days).padStart(2, '0');
    document.querySelector('[data-hours]').textContent = String(hours).padStart(2, '0');
    document.querySelector('[data-minutes]').textContent = String(minutes).padStart(2, '0');
    document.querySelector('[data-seconds]').textContent = String(seconds).padStart(2, '0');
}




// Flatpickr поддерживает множество языков: ru, fr, de, es, zh, и другие.
// Все они находятся в папке dist/l10n/.