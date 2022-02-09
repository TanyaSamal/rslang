import { Component, Controller} from '../../../spa';
import Audiocall from './audiocall.component.html';
import * as utils from './utils';
import './audiocall.component.scss';
import AudioQuestion from '../../components/audio-question/app.audio-question.html';
import { appHeader } from '../../components/header/app.header';
import { IAuth, IWord, WordStatus } from '../../../spa/tools/controllerTypes';
import { AppAudioQuestion } from '../../components/audio-question/app.audio-question';
import { ICallQuestion } from '../../../spa/core/coreTypes';
import { IGameState, IGameStatistic, Mode } from '../../componentTypes';
import { appSelectDifficulty } from '../../components/select-dificult/app.select-difficulty';

const BASE_URL = 'https://rslang-2022.herokuapp.com/';
const ANSWERS_COUNT = 5;
const CORRECT = 'correct';
const INCORRECT = 'incorrect';

class AudiocallComponent extends Component {
  private controller = new Controller();
  private gameWords: IWord[] = [];
  private currentQuestion = 0;
  private answers: Array<number> = [];
  private isAnswered = false;
  private level = '0';
  private newWords = 0;

  saveGameResults() {
    let longest = utils.findLongestSeries(this.answers);
    let rightAnswers = this.answers.filter((answer) => answer === 1).length;
    let totalAnswers = this.answers.filter((answer) => answer === 1 || answer === -1).length;
    if (localStorage.getItem('audiocallStatistic')) {
      const statistic: IGameStatistic = JSON.parse(localStorage.getItem('audiocallStatistic'));
      longest = (longest > statistic.longest) ? longest : statistic.longest;
      rightAnswers += statistic.rightAnswers;
      totalAnswers += statistic.totalAnswers;
    }
    localStorage.setItem('audiocallStatistic', JSON.stringify({
      longest,
      rightAnswers,
      totalAnswers,
      newWords: this.newWords
    }));
  }

  async sendAnswer(wordId: string, correctness: string) {
    const userInfo: IAuth = JSON.parse(localStorage.getItem('userInfo'));
    const userWordInfo = await this.controller.getUserWordById(userInfo.userId, userInfo.token, wordId);
    if (userWordInfo) {
      delete userWordInfo.id;
      delete userWordInfo.wordId;
      if (userWordInfo.optional.gameProgress.audiocall.right === 0 &&
        userWordInfo.optional.gameProgress.audiocall.wrong === 0)
        this.newWords += 1;
      if (correctness === CORRECT) {
        userWordInfo.optional.gameProgress.audiocall.right  += 1; 
      } else {
        userWordInfo.optional.gameProgress.audiocall.wrong  += 1;
        if (userWordInfo.optional.status === WordStatus.learnt)
          userWordInfo.optional.status = WordStatus.inProgress;
      }
      if (userWordInfo.optional.gameProgress.audiocall.right === 3 && Number(this.level) < 3) {
        userWordInfo.optional.status = WordStatus.learnt;
      } else if (userWordInfo.optional.gameProgress.audiocall.right === 5 && Number(this.level) >= 3) {
        userWordInfo.optional.status = WordStatus.learnt;
      } else if (userWordInfo.optional.status !== WordStatus.learnt) {
        userWordInfo.optional.status = WordStatus.inProgress;
      }
      userWordInfo.optional.updatedDate = new Date().toLocaleDateString();
      await this.controller.updateUserWord(userInfo.userId, userInfo.token, wordId, userWordInfo);
    } else {
      const userWord = {
        difficulty: this.level,
        optional: {
          updatedDate: new Date().toLocaleDateString(),
          status: WordStatus.inProgress,
          gameProgress: {
            sprint: {
              right: 0,
              wrong: 0,
            },
            audiocall: {
              right: (correctness === CORRECT) ? 1 : 0,
              wrong: (correctness === INCORRECT) ? 1 : 0,
            },
          }
        }
      };
      await this.controller.createUserWord(userInfo.userId, wordId, userWord, userInfo.token);
    }
  }

  nextQuestion() {
    if (this.isAnswered) {
      this.currentQuestion += 1;
      if (this.currentQuestion === this.gameWords.length) {
        this.saveGameResults();
      } else {
        this.drawQuestion(this.currentQuestion);
      }
    } else {
      this.isAnswered = true;
      this.answers[this.currentQuestion] = -1;
      utils.showAnswer(INCORRECT, this.currentQuestion + 1);
      utils.showAnswerInfo();
      document.querySelector('.forward-btn').textContent = 'Дальше';
      const answerBtns = document.querySelectorAll('.answer-btn');
      answerBtns.forEach((btn: HTMLButtonElement) => {
        btn.disabled = true;
      });
    }
  }

  checkWord(target: HTMLButtonElement) {
    this.isAnswered = true;
    const answerWord = target.textContent.slice(4);
    let correctness = INCORRECT;
    if (answerWord === this.gameWords[this.currentQuestion].wordTranslate) {
      correctness = CORRECT;
      this.answers[this.currentQuestion] = 1;
    } else {
      this.answers[this.currentQuestion] = -1;
    }
    utils.showAnswer(correctness, this.currentQuestion + 1);
    target.classList.add(correctness);
    if (localStorage.getItem('userInfo'))
      this.sendAnswer(this.gameWords[this.currentQuestion].id, correctness);
    utils.showAnswerInfo();
    document.querySelector('.forward-btn').textContent = 'Дальше';
  }

  addListenets() {
    const checkAnswer = (event: MouseEvent) => {
      const target = <HTMLButtonElement>event.target;
      this.checkWord(target);
    }

    const answerBtns = document.querySelector('.answers');
    answerBtns.addEventListener('click', checkAnswer);

    const forwardBtn = document.querySelector('.forward-btn');
    forwardBtn.addEventListener('click', this.nextQuestion.bind(this));
  }

  addWindowListenets() {
    const ckeckKey = (event: KeyboardEvent) => {
      if (Number(event.key) >= 1 && Number(event.key) <= 5) {
        const target = <HTMLButtonElement>document.querySelector(`.answer:nth-child(${event.key}) button`);
        this.checkWord(target);
      }
      if (event.key === 'Enter') {
        this.nextQuestion();
      }
      if (event.key === ' ') {
        this.playQuestion();
      }
    }

    window.addEventListener('keyup', ckeckKey);
  }

  drawProgress() {
    const psogress = document.querySelector('.progress-status');
    psogress.innerHTML = '';
    this.answers.forEach((answer) => {
      const li = document.createElement('li');
      if (answer === 1) li.classList.add('correct');
      if (answer === -1) li.classList.add('incorrect');
      psogress.append(li);
    });
  }

  playQuestion() {
    utils.playWord(this.gameWords[this.currentQuestion].audio);
  }

  async getRoundWords() {
    let gameWords: IWord[] = [];
    if (localStorage.getItem('audiocallState')) {
      const gameState: IGameState = JSON.parse(localStorage.getItem('audiocallState'));
      this.level = gameState.level;
      if (localStorage.getItem('userInfo')) {
        const userInfo: IAuth = JSON.parse(localStorage.getItem('userInfo'));
        // const resp = await this.controller.getAgregatedWords(userInfo.userId, userInfo.token, state.level,
        //   '%7B%22userWord.difficulty%22%3A%220%22%7D');
        //   gameWords = resp.paginatedResults;
        if (gameState.mode === Mode.DICTIONARY) {
          gameWords = gameState.dictionaryWords.slice(gameState.dictionaryPage * 20, gameState.dictionaryPage * 20 + 20);
        }  else {
          const userWords = await this.controller.getUserWords(userInfo.userId, userInfo.token);
          const learntWords = userWords.filter((word) =>
          word.difficulty === gameState.level && word.optional.status === WordStatus.learnt)
          .map((word) => word.wordId);
          gameWords = gameState.textbookWords.filter((word) => !learntWords.includes(word.id));
          if (gameWords.length < 20) {
            let page = gameState.textbookPage;
            const promises = [];
            while (page !== 0) {
              page -= 1;
              promises.push(this.controller.getWords(gameState.level, page.toString()));
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
      const page = JSON.parse(localStorage.getItem('page'));
      this.level = JSON.parse(localStorage.getItem('group'));
      gameWords = await this.controller.getWords(this.level, page);
    }
    this.gameWords = utils.shuffleArray(gameWords);
    this.answers = Array(this.gameWords.length).fill(0);
    localStorage.removeItem('audiocallState');
  }

  generateAnswers(idx: number): Array<number> {
    const answersNumbers: Set<number> = new Set();
    answersNumbers.add(idx);
    while (answersNumbers.size < ANSWERS_COUNT) {
      answersNumbers.add(utils.getRandomNumber(this.gameWords.length));
    }
    return Array.from(answersNumbers);
  }

  makeQuestionData(idx: number): ICallQuestion {
    let answers: Array<number> = this.generateAnswers(idx);
    answers = utils.shuffleArray(answers);
    return {
      answerWord: this.gameWords[idx].word,
      answerTranslate: this.gameWords[idx].wordTranslate,
      image: this.gameWords[idx].image,
      answer1: `1 - ${this.gameWords[answers[0]].wordTranslate}`,
      answer2: `2 - ${this.gameWords[answers[1]].wordTranslate}`,
      answer3: `3 - ${this.gameWords[answers[2]].wordTranslate}`,
      answer4: `4 - ${this.gameWords[answers[3]].wordTranslate}`,
      answer5: `5 - ${this.gameWords[answers[4]].wordTranslate}`,
    }
  }

  drawQuestion(idx: number) {
    this.currentQuestion = idx;
    this.isAnswered = false;
    const questionEl = (<HTMLDivElement>document.querySelector('.audiocall-question'));
    if (questionEl) questionEl.style.marginLeft = '-300%';
    setTimeout(() => {
      document.querySelector('.question-container').innerHTML = '';
      document.querySelector('.question-container').insertAdjacentHTML('afterbegin',
        `<audio-question></audio-question>`);
      const questionTepmlate = document.querySelector('audio-question');
      questionTepmlate.innerHTML = '';

      const questionData: ICallQuestion = this.makeQuestionData(idx);
      const appAudioQuestion = new AppAudioQuestion({
        selector: 'audio-question',
        template: AudioQuestion,
        wordData: {...questionData},
      });
      const word = document.querySelector('audio-question');
      word.innerHTML = appAudioQuestion.template;
      appAudioQuestion.render('audio-question');

      const wordImage = <HTMLDivElement>document.querySelector('.question-image');
      wordImage.style.backgroundImage = `url('${BASE_URL + questionData.image}')`;
      setTimeout(() => {
        (<HTMLDivElement>document.querySelector('.audiocall-question')).style.marginRight = '0';

        this.playQuestion();
      }, 700);

      document.querySelector('.play-answer').addEventListener('click', this.playQuestion.bind(this));
      document.querySelector('.play-question').addEventListener('click', this.playQuestion.bind(this));
      this.addListenets();
    }, 500);
  }

  showGame() {
    (<HTMLDivElement>document.querySelector('.welcome-container')).style.display = 'none';
    (<HTMLDivElement>document.querySelector('.game-audiocall')).style.display = 'block';
  }

  afterInit() {
    const startGame = async () => {
      this.showGame();
      await this.getRoundWords();
      this.drawQuestion(this.currentQuestion);
      this.drawProgress();
      this.addWindowListenets();
    }

    const startBtn = document.querySelector('.start-sprint');
    startBtn.addEventListener('click', startGame);
  }
}

export const audiocallComponent = new AudiocallComponent({
  selector: 'app-audiocall',
  components: [
    appHeader,
    appSelectDifficulty
  ],
  template: Audiocall,
});
