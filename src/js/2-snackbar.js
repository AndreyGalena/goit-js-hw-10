import '../css/styles.css';
import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";

const form = document.querySelector('.form');
const btnSubmit = document.querySelector('button[type="submit"]');
const input = document.querySelector('input[name="delay"]');
// btnSubmit.disabled = true;

iziToast.info({
    title: 'Информация',
    message: 'Вводи значение в поле ввода в МИЛИСЕКУНДАХ.',
    messageColor: 'black',
    position: 'bottomCenter',
    timeout: 5000,
    progressBar: true,
    close: true,
    backgroundColor: 'aquamarine',
});
setTimeout(() => {
    iziToast.info({
        title: 'Информация',
        message: 'После выберите удачное/неудачное завершения Promise',
        messageColor: 'black',
        position: 'bottomCenter',
        timeout: 5000,
        progressBar: true,
        close: true,
        backgroundColor: 'aquamarine',
    });
}, 5200);

function isEven(delay, state) {
    // input не активен
    input.disabled = true;
    return new Promise((resolve, reject) => {
        const time = Number(delay);
        btnSubmit.disabled = true;
        setTimeout(() => {
            if (isNaN(time) || time < 0) {
                reject("⏱️ Некорректное значение задержки.");
                return;
            }

            if (state == 'fulfilled') {
                resolve("✅ Данные успешно получены!");
            } else {
                reject("❌ Ошибка при получении данных.");
            }
        }, time);
    });
}

form.addEventListener('submit', (event) => {
    event.preventDefault();
    const delay = form.elements['delay'].value.trim();
    const state = form.elements['state'].value.trim();
    iziToast.info({
        title: 'Информация',
        message: 'Процесс запущен !!!',
        messageColor: 'black',
        position: 'bottomCenter',
        timeout: 2000,
        progressBar: true,
        close: true,
        backgroundColor: 'aquamarine',
    });

    isEven(delay, state)
        .then((message) => {
            iziToast.success({
                title: 'Успех',
                message: `${message} Время ${delay} ms`,
                messageColor: 'black',
                position: 'bottomCenter',
                timeout: 5000,
                progressBar: true,
                close: true,
                backgroundColor: 'aquamarine',
            });
        })
        .catch((error) => {
            iziToast.error({
                title: 'Ошибка',
                message: `${error} Время ${delay} ms`,
                messageColor: 'black',
                position: 'bottomCenter',
                timeout: 5000,
                progressBar: true,
                close: true,
                backgroundColor: 'aquamarine',
            });
        })
        .finally(() => {
            // input активен
            input.disabled = false;
            btnSubmit.disabled = false;
            form.reset(); // ⬅️ сбрасывает форму
        });
});
