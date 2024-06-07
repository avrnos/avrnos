// test/index.test.ts

import { RequiredFieldValidator } from '../src/index';
import { EmailValidator } from '../src/index';
import { PasswordStrengthValidator } from '../src/index';

describe('Validators', () => {
    describe('RequiredFieldValidator', () => {
        it('should validate non-empty strings', () => {
            expect(RequiredFieldValidator.validate('hello')).toBe(true);
            expect(RequiredFieldValidator.validate('')).toBe(false);
            expect(RequiredFieldValidator.validate(' ')).toBe(false);
        });

        it('should return the correct error message', () => {
            expect(RequiredFieldValidator.getErrorMessage()).toBe('This field is required.');
        });
    });

    describe('EmailValidator', () => {
        it('should validate correct email formats', () => {
            expect(EmailValidator.validate('test@example.com')).toBe(true);
            expect(EmailValidator.validate('invalid-email')).toBe(false);
        });

        it('should return the correct error message', () => {
            expect(EmailValidator.getErrorMessage()).toBe('Invalid email format.');
        });
    });

    describe('PasswordStrengthValidator', () => {
        it('should validate strong passwords', () => {
            expect(PasswordStrengthValidator.validate('Strong1!')).toBe(true);
            expect(PasswordStrengthValidator.validate('weak')).toBe(false);
            expect(PasswordStrengthValidator.validate('NoNumbers!')).toBe(false);
            expect(PasswordStrengthValidator.validate('12345678')).toBe(false);
        });

        it('should return the correct error message', () => {
            expect(PasswordStrengthValidator.getErrorMessage()).toBe('Password must be at least 8 characters long and include a number, a lowercase letter, an uppercase letter, and a special character.');
        });
    });
});
