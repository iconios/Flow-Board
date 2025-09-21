export interface TaskServerToClientEvents {
  noArg: () => void;
  "task:update": (a: number, b: string, c: Buffer) => void;
  withAck: (d: string, callback: (e: number) => void) => void;
}

interface TaskClientToServerEvents {
  hello: () => void;
}

interface TaskInterServerEvents {
  ping: () => void;
}

interface TaskSocketData {
  name: string;
  age: number;
}
