const dlg = document.getElementById('contactDialog'); 
const openBtn = document.getElementById('openDialog'); 
const closeBtn = document.getElementById('closeDialog'); 
const form = document.getElementById('contactForm'); 
let lastActive = null; 
let formWasSubmitted = false; // Флаг для отслеживания отправки формы

openBtn.addEventListener('click', () => { 
    lastActive = document.activeElement; 
    dlg.showModal();               // модальный режим + затемнение 
    dlg.querySelector('input,select,textarea,button')?.focus(); 
    formWasSubmitted = false; // Сбрасываем флаг при открытии
    removeErrorHighlights(); // Убираем подсветку ошибок
}); 

closeBtn.addEventListener('click', () => {
    dlg.close('cancel');
    removeErrorHighlights(); // Убираем подсветку ошибок при закрытии
}); 

// Функция для удаления подсветки ошибок
function removeErrorHighlights() {
    const elements = form.elements;
    for (let i = 0; i < elements.length; i++) {
        elements[i].classList.remove('field-error');
    }
}

// Функция для подсветки невалидных полей
function highlightInvalidFields() {
    const elements = form.elements;
    for (let i = 0; i < elements.length; i++) {
        const element = elements[i];
        if (element.willValidate && !element.checkValidity()) {
            element.classList.add('field-error');
        } else {
            element.classList.remove('field-error');
        }
    }
}

form?.addEventListener('submit', (e) => { 
    // 1) Сброс кастомных сообщений
    [...form.elements].forEach(el => el.setCustomValidity?.(''));

    // 2) Проверка встроенных ограничений
    if (!form.checkValidity()) {
        e.preventDefault();
        formWasSubmitted = true; // Устанавливаем флаг отправки

        // Пример: таргетированное сообщение
        const email = form.elements.email;
        if (email?.validity.typeMismatch) {
            email.setCustomValidity('Введите корректный e-mail, например name@example.com');
        }

        // Подсвечиваем невалидные поля
        highlightInvalidFields();
        
        form.reportValidity(); // показать браузерные подсказки

        // Ally: подсветка проблемных полей
        [...form.elements].forEach(el => {
            if (el.willValidate) el.toggleAttribute('aria-invalid', !el.checkValidity());
        });
        return;
    }

    // 3) Успешная «отправка» (без сервера)
    e.preventDefault();
    // Если форма внутри <dialog>, закрываем окно:
    document.getElementById('contactDialog').close('success');
    form.reset();
    formWasSubmitted = false; // Сбрасываем флаг
    removeErrorHighlights(); // Убираем подсветку ошибок
}); 

// Слушатель изменения полей - убираем подсветку при исправлении
form?.addEventListener('input', (e) => {
    if (formWasSubmitted) {
        const element = e.target;
        if (element.checkValidity()) {
            element.classList.remove('field-error');
        }
    }
});

dlg.addEventListener('close', () => { 
    lastActive?.focus(); 
    formWasSubmitted = false; // Сбрасываем флаг при закрытии
    removeErrorHighlights(); // Убираем подсветку ошибок
}); 

// Esc по умолчанию вызывает событие 'cancel' и закрывает <dialog>