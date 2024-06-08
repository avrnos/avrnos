enum LogLevel {
    INFO = 'INFO',
    ERROR = 'ERROR',
}

interface LogOptions {
    level: LogLevel;
    message: string;
}

class Logger {
    static log(options: LogOptions): void {
        const timestamp = new Date().toISOString();
        const logMessage = `[${timestamp}] [${options.level}] ${options.message}`;

        console.log(logMessage); // Output the log message to console

        // Additional logic can be added here, such as writing logs to files or sending to external services
    }

    static info(message: string): void {
        this.log({ level: LogLevel.INFO, message });
    }

    static error(message: string): void {
        this.log({ level: LogLevel.ERROR, message });
    }
}

export default Logger;