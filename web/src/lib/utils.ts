import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
};

export function exists<T>(value: T | null | undefined): value is T {
    return value !== null && value !== undefined;
};

export function serializeQuery(obj: any) {
    let str = [];
    for (const p in obj) {
        if (obj.hasOwnProperty(p)) {
            if (Array.isArray(obj[p])) {
                obj[p].forEAach((v: any) => str.push(encodeURIComponent(p) + '[]=' + encodeURIComponent(v)));
            } else {
                str.push(encodeURIComponent(p) + '=' + encodeURIComponent(obj[p]));
            }
        }
    }
    return str.join('&');
}