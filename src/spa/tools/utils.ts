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
    currPage.classList.remove('learnt-page');
  }
}

export const changeColorTheme = (currentLevel: string): void => {
  const wordsContainer = document.querySelector('.words-content');
  wordsContainer.className = `words-content colorTheme-${currentLevel}`;
  const userWords = document.querySelector('.dictionary-container');
  userWords.className = `dictionary-container colorTheme-${currentLevel}`;
  const userContent = document.querySelector('.dictionary-words');
  userContent.className = `dictionary-words dictionary-view colorTheme-${currentLevel}`;
}

export const savePageInLocalStorage = (currentLevel: string, currentPage: number): void => {
  localStorage.setItem('currentPage', JSON.stringify({
    level: currentLevel,
    page: currentPage
  }));
}

export const channgePaginationView = (currentPage: number): void => {
  const pagination = <HTMLUListElement>document.querySelector('.pagination-list');
  const oldCurrPage = <HTMLButtonElement>pagination.querySelector('.current-page');
  const firstPart = <HTMLButtonElement>pagination.querySelector('.first-part');
  if (oldCurrPage) oldCurrPage.classList.remove('current-page');
  if (currentPage < 27 && currentPage > 0) {
    firstPart.classList.remove('hide');
    if (currentPage === 1 && !firstPart.classList.contains('hide')) firstPart.classList.add('hide');
    if (currentPage === 2) {
      (<HTMLButtonElement>pagination.children[1].lastElementChild).classList.add('hide');
    } else {
      (<HTMLButtonElement>pagination.children[1].lastElementChild).classList.remove('hide');
    }
    if (currentPage === 26) {
      (<HTMLButtonElement>pagination.children[5]).classList.add('hide');
    } else {
      (<HTMLButtonElement>pagination.children[5]).classList.remove('hide');
    }
    pagination.children[2].firstElementChild.textContent = `${currentPage}`;
    pagination.children[3].firstElementChild.textContent = `${currentPage + 1}`;
    pagination.children[4].firstElementChild.textContent = `${currentPage + 2}`;
    (<HTMLButtonElement>pagination.children[3].firstElementChild).classList.add('current-page');
  }
  if (currentPage === 0) {
    firstPart.classList.add('hide');
    if ((<HTMLButtonElement>pagination.children[5]).classList.contains('hide'))
      (<HTMLButtonElement>pagination.children[5]).classList.remove('hide');
    (<HTMLButtonElement>pagination.children[2].firstElementChild).classList.add('current-page');
    pagination.children[2].firstElementChild.textContent = `${currentPage + 1}`;
    pagination.children[3].firstElementChild.textContent = `${currentPage + 2}`;
    pagination.children[4].firstElementChild.textContent = `${currentPage + 3}`;
  }
  if (currentPage >= 27) {
    if(currentPage === 27) {
      (<HTMLButtonElement>pagination.children[4].firstElementChild).classList.add('current-page');
      (<HTMLButtonElement>pagination.children[5]).classList.add('hide');
    } else {
      (<HTMLButtonElement>pagination.children[currentPage - 22].firstElementChild).classList.add('current-page');
      pagination.children[2].firstElementChild.textContent = `${currentPage - 2}`;
      pagination.children[3].firstElementChild.textContent = `${currentPage - 1}`;
      pagination.children[4].firstElementChild.textContent = `${currentPage}`;
      (<HTMLButtonElement>pagination.children[5]).classList.add('hide');
      firstPart.classList.remove('hide');
    }
  }
  (<HTMLButtonElement>pagination.lastElementChild.firstElementChild).disabled = (currentPage === 29);
  (<HTMLButtonElement>pagination.firstElementChild.firstElementChild).disabled = (currentPage === 0);
}

export const switchMode = (mode: string): void => {
  const DICTIONARY = 'dictionary';
  const TEXTBOOK = 'textbook';
  const isDictionary = (mode === DICTIONARY) ? 'flex' : 'none';
  const isTextbook = (mode === TEXTBOOK) ? 'block' : 'none';
  const dictBlocks = document.querySelectorAll('.dictionary-view');
  dictBlocks.forEach((dictEl: HTMLDivElement) => {
    dictEl.style.display = isDictionary;
  });
  const textbookBlock = <HTMLDivElement>document.querySelector('.words-content');
  textbookBlock.style.display = isTextbook;
  const headersTitles = document.querySelectorAll('.header-title');
  if (mode === TEXTBOOK) headersTitles[0].classList.add('active-textbook');
    else headersTitles[0].classList.remove('active-textbook');
  if (mode === DICTIONARY) headersTitles[1].classList.add('active-textbook');
    else headersTitles[1].classList.remove('active-textbook');
}

export const changeUserWordsCount = (difficultCount: number, learntCount: number): void => {
  const difficult = document.querySelector('.difficult-words .word__count span');
  difficult.textContent = String(difficultCount);
  const learnt = document.querySelector('.learnt-words .word__count span');
  learnt.textContent = String(learntCount);
}

const createPagination = (currentPage: number, maxPageCount: number): Array<number | string> => {  // source https://gist.github.com/kottenator/9d936eb3e4e3c3e02598
  const current = currentPage;
  const last = maxPageCount;
  const delta = 2;
  const left = current - delta;
  const right = current + delta + 1;
  const range = [];
  const rangeWithDots = [];
  let l;

  for (let i = 1; i <= last; i += 1) {
      if (i === 1 || i === last || i >= left && i < right) {
          range.push(i);
      }
  }

  // eslint-disable-next-line no-restricted-syntax
  for (const i of range) {
      if (l) {
          if (i - l === 2) {
              rangeWithDots.push(l + 1);
          } else if (i - l !== 1) {
              rangeWithDots.push('...');
          }
      }
      rangeWithDots.push(i);
      l = i;
  }

  return rangeWithDots;
}

export const createPaginationView = (currentPage: number, maxPageCount: number): string => {
  const rangeArray = createPagination(currentPage, maxPageCount);
  const template = (pageNumber: string) => `
  <li>
    <button class="pag-number" tabindex="0" type="button" aria-label="page ${pageNumber}" aria-current="true">${pageNumber}</button>
  </li>`
  let pagination = '';
  rangeArray.forEach((page) => {
    pagination = pagination.concat(template(page.toString()));
  });
  return pagination;
}

export const culcPagesCount = (arrLength: number): number => {
  const WORDS_ON_PAGE = 20;
  return (arrLength % WORDS_ON_PAGE !== 0) ? 
    Math.floor(arrLength / WORDS_ON_PAGE) + 1 :
    arrLength / WORDS_ON_PAGE;
}
