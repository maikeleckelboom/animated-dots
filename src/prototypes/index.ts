Object.defineProperty(Array.prototype, 'first', {
    value() {
        return this.find(Boolean)
    }
})