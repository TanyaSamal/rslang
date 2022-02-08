function changeStyleElement(element: HTMLElement): void {
  const borderColor: string = window.getComputedStyle(element).borderColor;

  element.classList.add('click-level');
  element.style.borderRadius = '50%';
  element.style.backgroundColor = borderColor;
}

function resetStyleElement(): void {
  const allLevel: NodeListOf<Element> = document.querySelectorAll('.level');

  allLevel.forEach((element: HTMLElement) => {
    element.classList.remove('click-level');
    element.style.borderRadius = '0px';
    element.style.backgroundColor = '#000000';
  });
}

function activateButton(): void {
  const button = document.querySelector('.start-sprint') as HTMLElement;
  
  button.removeAttribute('disabled');
  button.classList.add('start-sprint-enable');
}

function mouseOverElement(element: HTMLElement): void {
  const borderColor: string = window.getComputedStyle(element).borderColor;

  element.style.backgroundColor = borderColor;
}

function mouseOutElement(element: HTMLElement): void {
  const allLevel: NodeListOf<Element> = document.querySelectorAll('.level');

  allLevel.forEach((element: HTMLElement) => {
      if (!element.classList.contains('click-level')) {
        element.style.backgroundColor = '#000000';
      }
  });
}

export default {
  changeStyleElement,
  resetStyleElement,
  activateButton,
  mouseOverElement,
  mouseOutElement,
};