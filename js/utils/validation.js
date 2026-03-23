/**
 * Form Validation Utility
 */
const Validation = {
    /**
     * Validate email format
     * @param {string} email - Email to validate
     * @returns {boolean}
     */
    isValidEmail(email) {
        const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return pattern.test(email);
    },

    /**
     * Validate phone number (Belarus format)
     * @param {string} phone - Phone to validate
     * @returns {boolean}
     */
    isValidPhone(phone) {
        const pattern = /^\+375\d{9}$/;
        return pattern.test(phone.replace(/\s/g, ''));
    },

    /**
     * Validate password strength
     * @param {string} password - Password to validate
     * @returns {object} Validation result
     */
    isValidPassword(password) {
        const result = {
            valid: true,
            errors: []
        };

        if (password.length < APP_CONFIG.VALIDATION.MIN_PASSWORD_LENGTH) {
            result.valid = false;
            result.errors.push('Минимум 8 символов');
        }

        if (password.length > APP_CONFIG.VALIDATION.MAX_PASSWORD_LENGTH) {
            result.valid = false;
            result.errors.push('Максимум 20 символов');
        }

        if (!/[A-Z]/.test(password)) {
            result.valid = false;
            result.errors.push('Хотя бы одна заглавная буква');
        }

        if (!/[a-z]/.test(password)) {
            result.valid = false;
            result.errors.push('Хотя бы одна строчная буква');
        }

        if (!/[0-9]/.test(password)) {
            result.valid = false;
            result.errors.push('Хотя бы одна цифра');
        }

        if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
            result.valid = false;
            result.errors.push('Хотя бы один специальный символ');
        }

        return result;
    },

    /**
     * Validate age (minimum 16 years)
     * @param {string} birthDate - Birth date in ISO format
     * @returns {boolean}
     */
    isValidAge(birthDate) {
        const today = new Date();
        const birth = new Date(birthDate);
        let age = today.getFullYear() - birth.getFullYear();
        const monthDiff = today.getMonth() - birth.getMonth();

        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
            age--;
        }

        return age >= APP_CONFIG.VALIDATION.MIN_AGE;
    },

    /**
     * Validate required field
     * @param {*} value - Value to validate
     * @returns {boolean}
     */
    isRequired(value) {
        return value !== null && value !== undefined && value !== '';
    },

    /**
     * Validate form field
     * @param {HTMLElement} field - Form field element
     * @returns {object} Validation result
     */
    validateField(field) {
        const value = field.value.trim();
        const type = field.type;
        const name = field.name;
        const result = {
            valid: true,
            message: ''
        };

        // Check required
        if (field.required && !this.isRequired(value)) {
            result.valid = false;
            result.message = 'Это поле обязательно для заполнения';
            return result;
        }

        // Type-specific validation
        switch (type) {
            case 'email':
                if (value && !this.isValidEmail(value)) {
                    result.valid = false;
                    result.message = 'Введите корректный email';
                }
                break;

            case 'tel':
                if (value && !this.isValidPhone(value)) {
                    result.valid = false;
                    result.message = 'Введите номер в формате +375XXXXXXXXX';
                }
                break;

            case 'password':
                if (value) {
                    const passwordResult = this.isValidPassword(value);
                    if (!passwordResult.valid) {
                        result.valid = false;
                        result.message = passwordResult.errors.join(', ');
                    }
                }
                break;

            case 'date':
                if (value && !this.isValidAge(value)) {
                    result.valid = false;
                    result.message = 'Вам должно быть минимум 16 лет';
                }
                break;
        }

        return result;
    },

    /**
     * Show validation message
     * @param {HTMLElement} field - Form field
     * @param {string} message - Validation message
     */
    showMessage(field, message) {
        // Remove existing message
        const existingMessage = field.parentNode.querySelector('.validation-message');
        if (existingMessage) {
            existingMessage.remove();
        }

        // Create message element
        if (message) {
            const messageEl = document.createElement('div');
            messageEl.className = 'validation-message';
            messageEl.textContent = message;
            field.parentNode.appendChild(messageEl);
            field.classList.add('invalid');
            field.classList.remove('valid');
        } else {
            field.classList.remove('invalid');
            field.classList.add('valid');
        }
    },

    /**
     * Validate entire form
     * @param {HTMLFormElement} form - Form element
     * @returns {boolean}
     */
    validateForm(form) {
        const fields = form.querySelectorAll('input, select, textarea');
        let isValid = true;

        fields.forEach(field => {
            const result = this.validateField(field);
            this.showMessage(field, result.valid ? '' : result.message);

            if (!result.valid) {
                isValid = false;
            }
        });

        return isValid;
    }
};

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Validation;
}
