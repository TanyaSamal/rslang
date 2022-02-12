function changeStyleElement(element: HTMLElement): void {
  const { borderColor } = window.getComputedStyle(element);
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
  const { borderColor } = window.getComputedStyle(element);
  element.style.backgroundColor = borderColor;
}

function mouseOutElement(): void {
  const allLevel: NodeListOf<Element> = document.querySelectorAll('.level');

  allLevel.forEach((element: HTMLElement) => {
      if (!element.classList.contains('click-level')) {
        element.style.backgroundColor = '#000000';
      }
  });
}

function hideContainer(container: HTMLElement): void {
  container.classList.add('hide');
}

function getGroup(): string {
  const level = document.querySelector('.click-level') as HTMLElement;
  const group: string = level.dataset.difficult;
  
  return group;
}

function randomNumber(start: number, stop: number): number {
  return Math.floor(Math.random() * (stop - start + 1)) + start;
}

export default {
  changeStyleElement,
  resetStyleElement,
  activateButton,
  mouseOverElement,
  mouseOutElement,
  hideContainer,
  getGroup,
  randomNumber,
};