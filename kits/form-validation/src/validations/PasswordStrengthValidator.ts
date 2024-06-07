export class PasswordStrengthValidator {
    static validate(value: string): boolean {
        // A strong password must have at least 8 characters, including a number, a lowercase letter, an uppercase letter, and a special character.
        const strongPasswordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[\W_]).{8,}$/;
        return strongPasswordRegex.test(value);
    }

    static getErrorMessage(): string {
        return 'Password must be at least 8 characters long and include a number, a lowercase letter, an uppercase letter, and a special character.';
    }
}
