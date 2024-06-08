//------------------------------------------------------------//

import chalk from 'chalk';

//------------------------------------------------------------//

enum LogType {
    Command = 'magenta',
    General = 'yellow',
    Error = 'red',
    Event = 'orange'
}

//------------------------------------------------------------//

/**
 * Helper function to format and log messages.
 * @param {LogType} type - The type of log message which dictates the color used.
 * @param {string} prefix - The prefix to display before the message, e.g., 'CMD', 'ERROR'.
 * @param {string} msg - The message to be logged.
 */
function logMessage(type: LogType, prefix: string, msg: string): string {
    const color = (chalk as any).bgKeyword(type); // dynamically access chalk colors
    const styledText = color(`📘[${prefix}]`) + ' ' + chalk.white(msg);
    console.log(styledText); // Log the styled text if needed
    return styledText; // Return the styled text
}
/**
 * Logs a command message.
 * @param {string} msg - The message to log, typically detailing a command-related action.
 */
export function cmd(msg: string): void {
    logMessage(LogType.Command, 'CMD', msg);
}

/**
 * Clears the console.
 */
export function clear(): void {
    console.clear();
}

/**
 * Logs a general bot message.
 * @param {string} msg - The message to log, generally used for regular bot operational updates.
 */
export function clog(msg: string, color?: string): void {
    if (color) {
        const coloredMessage = (chalk as any).keyword(color)(msg);
        console.log(coloredMessage);
    } else {
        console.log(msg);
    }
}

/**
 * Logs an error message.
 * @param {string} msg - The error message to log, indicating problems or exceptions.
 */
export function error(msg: string): void {
    logMessage(LogType.Error, 'ERROR', msg);
}

/**
 * Logs an event message.
 * @param {string} msg - The event message to log, used for tracking bot events such as startup or special operations.
 */
export function evnt(msg: string): void {
    logMessage(LogType.Event, 'EVENT', msg);
}