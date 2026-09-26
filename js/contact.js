(function () {
    'use strict';

    var MESSAGES = {
        nome: 'Informe seu nome completo.',
        whatsapp: 'Informe um telefone com DDD.',
        email: 'Informe um e-mail válido.',
        cidade: 'Informe a cidade onde fica o ambiente.',
        ambiente: 'Selecione o tipo de ambiente.',
        servico: 'Selecione o serviço de interesse.',
        consentimento: 'É preciso autorizar o contato para enviar.'
    };

    function onlyDigits(value) {
        return value.replace(/\D/g, '');
    }

    var validators = {
        nome: function (value) {
            return value.trim().length >= 3 && value.trim().indexOf(' ') > 0;
        },
        whatsapp: function (value) {
            var digits = onlyDigits(value);
            return digits.length >= 10 && digits.length <= 11;
        },
        email: function (value) {
            return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value.trim());
        },
        cidade: function (value) {
            return value.trim().length >= 2;
        },
        ambiente: function (value) {
            return value !== '';
        },
        servico: function (value) {
            return value !== '';
        },
        consentimento: function (value, field) {
            return field.checked;
        }
    };

    function showError(field, message) {
        var error = document.querySelector('[data-error-for="' + field.name + '"]');
        field.setAttribute('aria-invalid', 'true');
        if (error) {
            error.textContent = message;
            error.classList.add('is-shown');
        }
    }

    function clearError(field) {
        var error = document.querySelector('[data-error-for="' + field.name + '"]');
        field.removeAttribute('aria-invalid');
        if (error) {
            error.textContent = '';
            error.classList.remove('is-shown');
        }
    }

    function validateField(field) {
        var validator = validators[field.name];
        if (!validator) return true;

        var valid = validator(field.value, field);
        if (valid) clearError(field);
        else showError(field, MESSAGES[field.name]);
        return valid;
    }

    function initForm() {
        var form = document.querySelector('[data-contact-form]');
        if (!form) return;

        var status = document.querySelector('[data-form-status]');
        var fields = Array.prototype.slice.call(
            form.querySelectorAll('input[name], select[name], textarea[name]')
        ).filter(function (field) {
            return validators[field.name];
        });

        fields.forEach(function (field) {
            var eventName = field.type === 'checkbox' || field.tagName === 'SELECT' ? 'change' : 'blur';
            field.addEventListener(eventName, function () {
                validateField(field);
            });
            field.addEventListener('input', function () {
                if (field.getAttribute('aria-invalid') === 'true') validateField(field);
            });
        });

        form.addEventListener('submit', function (event) {
            event.preventDefault();

            var invalid = fields.filter(function (field) {
                return !validateField(field);
            });

            if (invalid.length) {
                if (status) {
                    status.innerHTML =
                        '<div class="notice" style="border-left-color: var(--red-500); background: var(--red-100)">' +
                        '<svg aria-hidden="true" focusable="false"><use href="#i-info"></use></svg>' +
                        '<span><strong>' +
                        invalid.length +
                        (invalid.length === 1 ? ' campo precisa' : ' campos precisam') +
                        ' de atenção</strong>Revise os itens destacados acima e envie de novo.</span></div>';
                }
                invalid[0].focus();
                return;
            }

            if (status) {
                status.innerHTML =
                    '<div class="notice notice--ok">' +
                    '<svg aria-hidden="true" focusable="false"><use href="#i-check"></use></svg>' +
                    '<span><strong>Solicitação validada</strong>' +
                    'Os campos estão corretos. Como este é um projeto de front-end, nada foi enviado: ' +
                    'em produção a ProSeg receberia a solicitação por e-mail ou CRM e retornaria em até 1 dia útil.' +
                    '</span></div>';
            }

            form.reset();
            fields.forEach(clearError);
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initForm);
    } else {
        initForm();
    }
})();
