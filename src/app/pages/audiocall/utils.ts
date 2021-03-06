import { Controller } from "../../../spa";
import { IAuth, IStatistics, IStatOptions, IUserWord, IWord, WordStatus } from "../../../spa/tools/controllerTypes";
import { AppLoader } from "../../components/loader/app.loader";
import Loader from "../../components/loader/app.loader.html";
import { IGamePoints, IGameState, Mode } from "../../componentTypes";
import { WordsFromTextbook } from "./audiocallTypes";

export const getRandomNumber = (max: number): number => Math.floor(Math.random() * max);

export const shuffleArray = <T>(answers: Array<T>): Array<T> => {
  for (let i = answers.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * i);
    [answers[i], answers[j]] = [answers[j], answers[i]];
  }
  return answers;
}

export const playWord = (src: string) => {
  const BASE_URL = 'https://rslang-2022.herokuapp.com/';
  const audio = new Audio(`${BASE_URL + src}`);
  audio.play();
}

function playAudio(src: string) {
  const audio = new Audio();
  audio.volume = 0.2;
  audio.src = `https://github.com/dns147/mp3-rs/raw/main/mp3-rs-lang/${src}-answer.mp3`
  audio.play();
}

export const findLongestSeries = (arr: Array<number>): number => {
  let longest = 0;
  let series = 1;
  arr.forEach((elem, idx) => {
    if ((elem === arr[idx + 1]))
      series += 1;
    else {
      if (series > longest) longest = series;
      series = 0;
    }
  });
  return longest;
}

export const showAnswer = (correctness: string, questionNumber: number) => {
  const progress = document.querySelector(`.progress-status li:nth-child(${questionNumber})`);
  progress.classList.add(correctness);
  const audios = ['right', 'false'];
  if (correctness === 'correct') playAudio(audios[0]);
  else playAudio(audios[1]);
}

export const showAnswerInfo = () => {
  const play = <HTMLDivElement>document.querySelector('.play-question');
  const answer = <HTMLDivElement>document.querySelector('.question-info');
  play.style.transform = 'scale(0)';
  setTimeout(() => {
    play.style.display = 'none';
    answer.style.height = 'auto';
    setTimeout(() => {
      answer.style.transform = 'scale(1)';
    }, 100);
  }, 500);
}

export const changeAnswerState = () => {
  document.querySelector('.forward-btn').textContent = '????????????';
  const answerBtns = document.querySelectorAll('.answer-btn');
  answerBtns.forEach((btn: HTMLButtonElement) => {
    btn.disabled = true;
  });
  showAnswerInfo();
}

export const addStars = (points: number) => {
  const stars = <HTMLDivElement>document.querySelector('.add-stars');
  const starsCount = <HTMLDivElement>document.querySelector('.stars-count');
  stars.textContent = `+${points}`;
  stars.style.visibility = 'visible';
  setTimeout(() => {
    stars.style.transform = 'translateY(0)';
    stars.style.fontSize = '1em';
    stars.style.opacity = '0';
    setTimeout(() => {
      stars.style.transform = 'translateY(50px)';
      stars.style.fontSize = '1.5em';
      stars.style.opacity = '1';
      stars.style.visibility = 'hidden';
      starsCount.textContent = `${Number(starsCount.textContent) + points}`;
    }, 1000);
  }, 0);
}

export const savePoints = () => {
  let points = Number((<HTMLDivElement>document.querySelector('.stars-count')).textContent);
  const userInfo: IAuth = JSON.parse(localStorage.getItem('userInfo'));
  const today = new Date().toLocaleDateString();
  if (localStorage.getItem('audiocallPoints')) {
    const localResults: IGamePoints = JSON.parse(localStorage.getItem('audiocallPoints'));
    if (localResults.date === today) {
      points += +(localResults.points);
    } else {
      localStorage.removeItem('audiocallPoints');
    }
  }
  if (userInfo) {
    localStorage.setItem('audiocallPoints', JSON.stringify({
      userId: userInfo.userId,
      points: points.toString(),
      date: today
    }));
    const headerPoints = <HTMLDivElement>document.querySelector('.game-points');
    headerPoints.textContent = `${Number(headerPoints.textContent) + points}`;
  }
}

export const makeStatistic = (currentStatistic: IStatistics): IStatistics => {
  const today = new Date().toLocaleDateString();
  const statistic: IStatOptions = {
    date: today,
    newWords: 1,
    totalWords: 1
  }
  if (currentStatistic) {
    delete currentStatistic.id;
    const currentStat: IStatOptions[] = JSON.parse(currentStatistic.optional.stat);
    if (currentStat[currentStat.length - 1].date === today) {
      currentStatistic.learnedWords += 1;
      currentStat[currentStat.length - 1].newWords += 1;
      currentStat[currentStat.length - 1].totalWords += 1;
    } else {
      statistic.totalWords = currentStat[currentStat.length - 1].totalWords + 1;
      currentStatistic.learnedWords = currentStat[currentStat.length - 1].totalWords + 1;
      currentStat.push(statistic);
    }
    currentStatistic.optional.stat = JSON.stringify(currentStat);
  } else {
    // eslint-disable-next-line no-param-reassign
    currentStatistic = {
      learnedWords: 1,
      optional: {
        stat: JSON.stringify([statistic])
      }
    }
  }
  return currentStatistic;
}

export const sendStatistic = async (userId: string, token: string) => {
  const controller = new Controller();
  const currentStatistic: IStatistics = await controller.getStatistics(userId, token);
  const newStatistic = makeStatistic(currentStatistic);
  await controller.setStatistics(userId, token, newStatistic);
}

export const sendAnswer = async (wordId: string, correctness: string, level: string, game: string): Promise<boolean> => {
  const CORRECT = 'correct';
  const INCORRECT = 'incorrect';
  const controller = new Controller();
  let isNew = false;
  const userInfo: IAuth = JSON.parse(localStorage.getItem('userInfo'));

  const userWordInfo = await controller.getUserWordById(userInfo.userId, userInfo.token, wordId);
  if (userWordInfo) {
    delete userWordInfo.id;
    delete userWordInfo.wordId;
    if (userWordInfo.optional.gameProgress[game].right === 0 &&
      userWordInfo.optional.gameProgress[game].wrong === 0)
      isNew = true;
    if (correctness === CORRECT) {
      userWordInfo.optional.gameProgress[game].right  += 1; 
    } else {
      userWordInfo.optional.gameProgress[game].wrong  += 1;
      if (userWordInfo.optional.status === WordStatus.learnt)
        userWordInfo.optional.status = WordStatus.inProgress;
    }
    if (userWordInfo.optional.gameProgress[game].right === 3 && Number(level) < 3) {
      userWordInfo.optional.status = WordStatus.learnt;
      sendStatistic(userInfo.userId, userInfo.token);
    } else if (userWordInfo.optional.gameProgress[game].right === 5 && Number(level) >= 3) {
      userWordInfo.optional.status = WordStatus.learnt;
      sendStatistic(userInfo.userId, userInfo.token);
    }
    if (userWordInfo.optional.status !== WordStatus.learnt) {
      userWordInfo.optional.status = WordStatus.inProgress;
      // delete from statistic?
    }
    userWordInfo.optional.updatedDate = new Date().toLocaleDateString();
    await controller.updateUserWord(userInfo.userId, userInfo.token, wordId, userWordInfo);
  } else {
    isNew = true;
    const userWord: IUserWord = {
      difficulty: String(level),
      optional: {
        updatedDate: new Date().toLocaleDateString(),
        status: WordStatus.inProgress,
        gameProgress: {
          sprint: {
            right: 0,
            wrong: 0,
          },
          audiocall: {
            right: 0,
            wrong: 0,
          },
        }
      }
    };
    userWord.optional.gameProgress[game].right = (correctness === CORRECT) ? 1 : 0;
    userWord.optional.gameProgress[game].wrong = (correctness === INCORRECT) ? 1 : 0;
    await controller.createUserWord(userInfo.userId, wordId, userWord, userInfo.token);
  }
  return isNew;
}

export const showLoader = () => {
  const loader = <HTMLDivElement>document.querySelector('.loader');
  const game = <HTMLDivElement>document.querySelector('.game-audiocall');
  game.style.display = 'none';
  loader.insertAdjacentHTML('afterbegin', `<app-loader></app-loader>`);
  const appLoader = new AppLoader({
    selector: 'app-loader',
    template: Loader,
  });
  loader.innerHTML = appLoader.template;
  appLoader.render('app-loader');
}

export const hideLoader = () => {
  document.querySelector('.loader').innerHTML = '';
  const game = <HTMLDivElement>document.querySelector('.game-audiocall');
  game.style.display = 'block';
}

export const showErrorMessage = () => {
  document.querySelector('.question-container').textContent = '???????? ?????? ???????? ????????????????????????. ???????????????? ???????????? ????????????????';
}

export const getWordsFromTextbook = async (): Promise<WordsFromTextbook> => {
  let level = '0';
  const controller = new Controller();
  let gameWords: IWord[] = [];
  if (localStorage.getItem('audiocallState')) {
    const gameState: IGameState = JSON.parse(localStorage.getItem('audiocallState'));
    level = String(gameState.level);
    if (localStorage.getItem('userInfo')) {
      const userInfo: IAuth = JSON.parse(localStorage.getItem('userInfo'));
      if (gameState.mode === Mode.DICTIONARY) {
        gameWords = gameState.dictionaryWords.slice(gameState.dictionaryPage * 20, gameState.dictionaryPage * 20 + 20);
      }  else {
        const userWords = await controller.getUserWords(userInfo.userId, userInfo.token);
        const learntWords = userWords.filter((word) =>
          word.difficulty === gameState.level && word.optional.status === WordStatus.learnt)
          .map((word) => word.wordId);
        gameWords = gameState.textbookWords.filter((word) => !learntWords.includes(word.id));
        if (gameWords.length < 20) {
          let page = gameState.textbookPage;
          const promises = [];
          while (page !== 0) {
            page -= 1;
            promises.push(controller.getWords(gameState.level, page.toString()));
          }
          const results = await Promise.all(promises);
          page = results.length - 1;
          while(gameWords.length < 20 && page >= 0) {
            const filteredArr = results[page].filter((word) => !learntWords.includes(word.id));
            gameWords = gameWords.concat(filteredArr);
            page -= 1;
          }
          if (gameWords.length > 20) gameWords.length = 20;
        }
      }
    } else {
      gameWords = gameState.textbookWords;
    }
  } else {
    let page = JSON.parse(localStorage.getItem('page'));
    if (localStorage.getItem('group')) level = JSON.parse(localStorage.getItem('group'));
    if (!page) page = '0';
    gameWords = await controller.getWords(level, page);
  }
  return {
    level,
    gameWords
  }
}

export const showModal = () => {
  const modal = <HTMLDivElement>document.querySelector('.exit-modal');
  modal.style.marginTop = '0';
}

export const hideModal = () => {
  const modal = <HTMLDivElement>document.querySelector('.exit-modal');
  modal.style.marginTop = '-150vh';
}
