/// <reference types="vite/client" />

interface Window {
  ethereum?: {
    isMetaMask?: boolean;
    on: (event: string, handler: (...args: any[]) => void) => void;
    removeListener: (event: string, handler: (...args: any[]) => void) => void;
    request: (args: any) => Promise<any>;
    send: (method: string, params?: any[]) => Promise<any>;
  };
}
