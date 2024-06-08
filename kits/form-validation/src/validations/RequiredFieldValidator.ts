//     ╭───────────────────────────────────────────╮
//     │             Copyright (c)                 │
//     │           ────────────────                │
//     │        Avrnos, All Rights Reserved        │
//     ╰───────────────────────────────────────────╯

export class RequiredFieldValidator {
    static validate(value: string): boolean {
        return value.trim().length > 0;
    }

    static getErrorMessage(): string {
        return 'This field is required.';
    }
}
