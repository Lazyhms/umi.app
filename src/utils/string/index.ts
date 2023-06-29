String.prototype.isNullOrEmpty = function () {
    return (this ?? "") === '';
}

String.prototype.isNullOrWhiteSpace = function () {
    return this.isNullOrEmpty() || this.trim().length === 0;
}