
'use server';

import fs from 'fs/promises';
import path from 'path';

export interface LogEntry {
    id: string;
    timestamp: string;
    action: string;
    details: string;
}

const dataPath = path.join(process.cwd(), 'src', 'lib', 'logs.json');

async function readLogs(): Promise<LogEntry[]> {
    try {
        const fileContent = await fs.readFile(dataPath, 'utf-8');
        return JSON.parse(fileContent);
    } catch (error) {
        if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
            return [];
        }
        console.error("Could not read logs.json:", error);
        return [];
    }
}

async function writeLogs(logs: LogEntry[]): Promise<void> {
    await fs.writeFile(dataPath, JSON.stringify(logs, null, 2), 'utf-8');
}

export async function addLogEntry(action: string, details: string) {
    const newLog: LogEntry = {
        id: `${new Date().getTime()}-${Math.random().toString(36).substring(2, 9)}`,
        timestamp: new Date().toISOString(),
        action,
        details,
    };

    try {
        const logs = await readLogs();
        logs.unshift(newLog); // Add new log to the beginning of the array
        
        // Keep only the last 1000 logs to prevent the file from growing too large
        const truncatedLogs = logs.slice(0, 1000);

        await writeLogs(truncatedLogs);
    } catch (error) {
        console.error("Failed to add log entry:", error);
    }
}

export async function getLogEntries(): Promise<LogEntry[]> {
    return await readLogs();
}
