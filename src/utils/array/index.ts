Array.prototype.distinct = function <T>(): T[] {
    return [...new Set(this)];
}

Array.prototype.distinctBy = function <T, S>(predicate: (value: T) => S): T[] {
    return this.reduce<T[]>((accumalator, current) => {
        if (!accumalator.some((s: T) => predicate(s) === predicate(current))) {
            accumalator.push(current);
        }
        return accumalator;
    }, []);
}

Array.prototype.except = function <T>(array: T[]): T[] {
    return [...new Set(this.filter(x => !array.some(s => x === s)))];
}

Array.prototype.exceptBy = function <T, S>(array: T[], predicate: (value: T) => S): any[] {
    return [...new Set(this.filter(x => !array.some(s => predicate(x) === predicate(s))))];
}

Array.prototype.intersect = function <T>(array: T[]): T[] {
    return [...new Set(this.filter(x => array.some(s => x === s)))];
}

Array.prototype.intersectBy = function <T, S>(array: T[], predicate: (value: T) => S): any[] {
    return [...new Set(this.filter(x => array.some(s => predicate(x) === predicate(s))))];
}