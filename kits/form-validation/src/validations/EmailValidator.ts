//     ╭───────────────────────────────────────────╮
//     │             Copyright (c)                 │
//     │           ────────────────                │
//     │        Avrnos, All Rights Reserved        │
//     ╰───────────────────────────────────────────╯

export class EmailValidator {
    private static emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    static validate(value: string): boolean {
        return this.emailRegex.test(value);
    }

    static getErrorMessage(): string {
        return 'Invalid email format.';
    }
}
