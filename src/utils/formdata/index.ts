FormData.prototype.toJson = function <T>(obj?: T): T {
    let jsonObject = obj ?? {} as any;
    for (const key of this.keys()) {
        if (obj === null || obj === undefined || Object.prototype.hasOwnProperty.call(jsonObject, key)) {
            const element = this.get(key);
            if (typeof (element) === "string") {
                jsonObject[key] = element;
            }
        }
    }
    return jsonObject;
}