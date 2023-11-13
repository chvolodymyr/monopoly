export default class DOM {
    getElement (selector) {
        return document.querySelector(selector)
    }

    getElements (selector) {
        return document.querySelectorAll(selector)
    }

    createElement (tag, attributes = {}, dataset) {
        const element = document.createElement(tag)
        for (const key in attributes) {
            element[key] = attributes[key]
        }
        for (const data in dataset) {
            element.dataset[data] = dataset[data]
        }
        return element
    }

    addClass (element, className) {
        element.classList.add(className)
    }

    removeElement (selector) {
        this.getElement(selector).remove()
    }

    setStyles (element, styles) {
        for (const property in styles) {
            element.style[property] = styles[property]
        }
    }

    addEventListenerToElement (element, eventType, callback) {
        element.addEventListener(eventType, callback)
    }
}
