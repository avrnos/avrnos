import { EmailValidator } from '../../src/validations/EmailValidator';

describe('EmailValidator', () => {
    it('should validate correct email formats', () => {
        expect(EmailValidator.validate('test@example.com')).toBe(true);
        expect(EmailValidator.validate('invalid-email')).toBe(false);
    });

    it('should return the correct error message', () => {
        expect(EmailValidator.getErrorMessage()).toBe('Invalid email format.');
    });
});