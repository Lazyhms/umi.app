interface Array<T> {
    /**
     * 去重
     */
    distinct(): T[]
    /**
     * 去重
     * @param predicate 
     */
    distinctBy<S>(predicate: (value: T) => S): T[]
    /**
     * 差集
     * @param array 
     */
    except(array: T[]): T[]
    /**
     * 差集
     * @param array 
     * @param predicate 
     */
    exceptBy<S>(array: T[], predicate: (value: T) => S): T[]
    /**
     * 交集
     * @param array 
     */
    intersect(array: T[]): T[]
    /**
     * 交集
     * @param array 
     * @param predicate 
     */
    intersectBy<S>(array: T[], predicate: (value: T) => S): T[]
}
