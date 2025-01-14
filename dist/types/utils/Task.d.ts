import type { AbortSignal } from 'abort-controller';
import type EventEmitter from 'eventemitter3';
import { DisposableScope } from './Disposable';
export declare type TaskStatus = 'pending' | 'running' | 'successful' | 'failed' | 'canceled';
export declare type TaskCallback<T> = (scope: DisposableScope) => T | Promise<T>;
export declare type TaskOptions = {
    signal?: AbortSignal;
    force?: boolean;
};
export declare class Task<T> {
    protected callback: TaskCallback<T>;
    protected children: Task<any>[];
    protected context: object;
    protected status: TaskStatus;
    protected result: T | undefined;
    protected error: unknown;
    protected eventEmitter: EventEmitter;
    constructor(callback: TaskCallback<T>, children?: Task<any>[], context?: object);
    run(options?: TaskOptions): Promise<T>;
    protected forceRun(options?: TaskOptions): Promise<T>;
    loadWith(preloadedResult: T): this;
    reset(): this;
    setChildren(children: Task<any>[]): this;
    getChildren(): Task<any>[];
    getDescendants(): Task<any>[];
    setContext(context: object): this;
    getContext<C extends object = object>(): C;
    getStatus(): TaskStatus;
    getResult(): T | undefined;
    getError(): unknown;
    isPending(): boolean;
    isRunning(): boolean;
    isCompleted(): boolean;
    isSuccessful(): boolean;
    isFailed(): boolean;
    isCanceled(): boolean;
    onStatusChange(callback: (status: TaskStatus) => unknown): this;
    onStatusChangeTo(status: TaskStatus, callback: () => unknown): this;
    onSuccess(callback: () => unknown): this;
    onFailure(callback: () => unknown): this;
    onCancel(callback: () => unknown): this;
    protected setStatus(newStatus: TaskStatus): void;
}
