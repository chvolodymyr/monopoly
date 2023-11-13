export default class DependencyInjector {
    constructor () {
        this.dependencies = { }
    }

    register (name, instance) {
        this.dependencies[name] = instance
    }

    get (name) {
        if (!this.dependencies[name]) {
            throw new Error(`Dependency ${name} not found`)
        }
        return this.dependencies[name]
    }
}
