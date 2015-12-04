declare module BensExtensions {
    interface ExportCommand {
        id: string;
        callback: (...args: any[]) => any
    }
}