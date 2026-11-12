let disableHeaderScrollUntil = 0

export function suppressHeaderScrollFor(ms = 1000): void {
    disableHeaderScrollUntil = Date.now() + ms
}

export function isHeaderScrollSuppressed(): boolean {
    return Date.now() < disableHeaderScrollUntil
}
