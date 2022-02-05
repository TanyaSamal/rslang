export const checkPageProgress = (): void => {
  const statuses = document.querySelectorAll('.status-info');
  let activeCount = 0;
  statuses.forEach((status: HTMLDivElement) => {
    if (status.textContent !== '')
      activeCount += 1;
  });
  const pageStatusInfo = <HTMLDivElement>document.querySelector('.page-status__info');
  const wordsMeaning = <HTMLDivElement>document.querySelector('.words-meaning');
  const gameLinks = document.querySelectorAll('.link-container');
  const currPage = <HTMLButtonElement>document.querySelector('.current-page');
  if (activeCount === 20) {
    pageStatusInfo.style.display = 'block';
    wordsMeaning.classList.add('done');
    gameLinks.forEach((link: HTMLDivElement) => {
      link.classList.add('disabled');
    });
    currPage.classList.add('learnt-page');
  } else {
    pageStatusInfo.style.display = 'none';
    wordsMeaning.classList.remove('done');
    gameLinks.forEach((link: HTMLDivElement) => {
      link.classList.remove('disabled');
    });
  }
}
