import { _decorator, Component, Node, EventTarget } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Event_DDWD_Manager')
export class Event_DDWD_Manager {
    private static _eventManager: Event_DDWD_Manager;
    private _eventTarget: EventTarget;

    public static getInstance() {
        if (!this._eventManager) {
            this._eventManager = new Event_DDWD_Manager();
        }
        return this._eventManager;
    }

    private constructor() {
        this._eventTarget = new EventTarget();
    }

    on(type: string, callback: any, target?: any) {
        this._eventTarget.on(type, callback, target)
    }

    once(type: string, callback: any, target?: any) {
        this._eventTarget.once(type, callback, target)
    }

    off(type: string, callback: any, target?: any) {
        this._eventTarget.off(type, callback, target)
    }

    emit(type: string, ...args: any[]) {
        this._eventTarget.emit(type, ...args);
    }
}


