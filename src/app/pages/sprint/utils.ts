export function changeStyleElement(element: HTMLElement): void {
    const borderColor: string = window.getComputedStyle(element).borderColor;

    element.classList.add('click');
    element.style.borderRadius = '50%';
    element.style.backgroundColor = borderColor;
}

export function resetStyleElement(): void {
    const allLevel: NodeListOf<Element> = document.querySelectorAll('.level');

    allLevel.forEach((element: HTMLElement) => {
        element.classList.remove('click');
        element.style.borderRadius = '0px';
        element.style.backgroundColor = '#000000';
    });
}

export function mouseOverElement(element: HTMLElement): void {
    const borderColor: string = window.getComputedStyle(element).borderColor;

    element.style.backgroundColor = borderColor;
}

export function mouseOutElement(element: HTMLElement): void {
    const allLevel: NodeListOf<Element> = document.querySelectorAll('.level');

    allLevel.forEach((element: HTMLElement) => {
        if (!element.classList.contains('click')) {
            element.style.backgroundColor = '#000000';
        }
    });
}

export function activateButton(): void {
    const button = document.querySelector('.start-sprint') as HTMLElement;
    
    button.removeAttribute('disabled');
    button.classList.add('start-sprint-enable');
}
