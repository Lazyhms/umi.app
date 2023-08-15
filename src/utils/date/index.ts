Date.prototype.format = function (formatStr: string): string {
    const o = {
        "M+": this.getMonth() + 1,
        "d+": this.getDate(),
        "H+": this.getHours(),
        "m+": this.getMinutes(),
        "s+": this.getSeconds(),
        "q+": Math.floor((this.getMonth() + 3) / 3),
        "S": this.getMilliseconds() //毫秒   
    };

    let fmt = formatStr;
    if (/(y+)/.test(formatStr)) {
        fmt = formatStr.replace(/(y+)/, this.getFullYear().toString());
    }

    for (const key in o) {
        if (Object.prototype.hasOwnProperty.call(o, key)) {
            const element = ((o as any)[key]).toString();
            const reg = new RegExp(`(${key})`);
            if (reg.test(fmt)) {
                fmt = fmt.replace(reg, element.padStart(2, '00'));
            }
        }
    }

    return fmt;
}