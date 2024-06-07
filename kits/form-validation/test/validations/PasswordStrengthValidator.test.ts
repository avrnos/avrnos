import { PasswordStrengthValidator } from '../../src/validations/PasswordStrengthValidator';

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