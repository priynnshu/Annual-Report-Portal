import { contextBridge } from "electron";
// src/preload/index.js
contextBridge.exposeInMainWorld("desktop", {
	platform: process.platform,
	isElectron: true
});
export {};
