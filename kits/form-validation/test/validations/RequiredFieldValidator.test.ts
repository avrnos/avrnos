import { RequiredFieldValidator } from '../../src/validations/RequiredFieldValidator';

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