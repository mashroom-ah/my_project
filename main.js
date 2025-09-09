const dlg = document.getElementById('contactDialog'); 
const openBtn = document.getElementById('openDialog'); 
const closeBtn = document.getElementById('closeDialog'); 
const form = document.getElementById('contactForm'); 
let lastActive = null; 

openBtn.addEventListener('click', () => { 
    lastActive = document.activeElement; 
    dlg.showModal();               // модальный режим + затемнение 
    dlg.querySelector('input,select,textarea,button')?.focus(); 
}); 

closeBtn.addEventListener('click', () => dlg.close('cancel')); 

form?.addEventListener('submit', (e) => { 
    // 1) Сброс кастомных сообщений
    [...form.elements].forEach(el => el.setCustomValidity?.(''));

    // 2) Проверка встроенных ограничений
    if (!form.checkValidity()) {
        e.preventDefault();

        // Пример: таргетированное сообщение
        const email = form.elements.email;
        if (email?.validity.typeMismatch) {
            email.setCustomValidity('Введите корректный e-mail, например name@example.com');
        }

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
}); 
dlg.addEventListener('close', () => { lastActive?.focus(); }); 
// Esc по умолчанию вызывает событие 'cancel' и закрывает <dialog>