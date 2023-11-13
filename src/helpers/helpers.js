export function getCells () {
    return [
        ...document.querySelectorAll('.bottom > div'),
        ...document.querySelectorAll('.left > div'),
        ...document.querySelectorAll('.top> div'),
        ...document.querySelectorAll('.right > div')
    ]
}

export const movementEvent = new Event('movementComplete')

export const generateRandomColor = () => {
    const letters = '0123456789ABCDEF'
    let color = '#'
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)]
    }
    return color
}
export const generateId = (() => {
    let counter = 0
    return () => {
        return counter++
    }
})()

export function parseHTML(html) {
    const t = document.createElement('template');
    t.innerHTML = html;
    return t.content;
}