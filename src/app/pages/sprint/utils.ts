import { DELAY, SECTOR } from "./consts";

export function changeStyleElement(element: HTMLElement): void {
    const borderColor: string = window.getComputedStyle(element).borderColor;

    element.classList.add('click-level');
    element.style.borderRadius = '50%';
    element.style.backgroundColor = borderColor;
}

export function resetStyleElement(): void {
    const allLevel: NodeListOf<Element> = document.querySelectorAll('.level');

    allLevel.forEach((element: HTMLElement) => {
        element.classList.remove('click-level');
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
        if (!element.classList.contains('click-level')) {
            element.style.backgroundColor = '#000000';
        }
    });
}

export function activateButton(): void {
    const button = document.querySelector('.start-sprint') as HTMLElement;
    
    button.removeAttribute('disabled');
    button.classList.add('start-sprint-enable');
}

export function getGroup(): string {
    const level = document.querySelector('.click-level') as HTMLElement;
    const group: string = level.dataset.difficult;
    
    return group;
}

export function randomNumber(start: number, stop: number): number {
    return Math.floor(Math.random() * (stop - start + 1)) + start;
}

export function hideVelcomeContainer(): void {
    const welcomeContainer = document.querySelector('.welcome-container') as HTMLElement;

    welcomeContainer.classList.add('hide');
}

export function showStopwatch(): void {
    const stopwatchСontainer = document.querySelector('.stopwatch-container') as HTMLElement;
    const stopwatch = document.querySelector('.stopwatch') as HTMLElement;
    stopwatchСontainer.classList.add('show');

    const count = document.createElement('span') as HTMLElement;
    stopwatch.append(count);

    let currentDelay: number = DELAY;
    let timerId = setTimeout(function tick() {
        count.innerHTML = String(currentDelay);
        
        stopwatch.style.background = `conic-gradient(#3abb3a ${SECTOR[SECTOR.length - currentDelay - 1]}%, transparent 0)`;
        currentDelay = currentDelay - 1;
        
        if (currentDelay < 0) {
            clearInterval(timerId);
        } else {
            timerId = setTimeout(tick, 1000);
        }
    }, 1000);
}
