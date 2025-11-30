export interface TaskServerToClientEvents {
    noArg: () => void;
    "task:update": (a: number, b: string, c: Buffer) => void;
    withAck: (d: string, callback: (e: number) => void) => void;
}
//# sourceMappingURL=task.io.type.d.ts.map