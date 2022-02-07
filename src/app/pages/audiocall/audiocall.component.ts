import { Component, Controller} from '../../../spa';
import Audiocall from './audiocall.component.html';
import * as utils from './utils';
import './audiocall.component.scss';
import AudioQuestion from '../../components/audio-question/app.audio-question.html';
import { appHeader } from '../../components/header/app.header';
import { IWord } from '../../../spa/tools/controllerTypes';
import { AppAudioQuestion } from '../../components/audio-question/app.audio-question';
import { ICallQuestion } from '../../../spa/core/coreTypes';

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

  addListenets() {
    const checkAnswer = (e: MouseEvent) => {
      this.isAnswered = true;
      const target = <HTMLButtonElement>e.target;
      const answerWord = target.textContent.slice(4);
      if (answerWord === this.gameWords[this.currentQuestion].wordTranslate) {
        utils.showAnswer(CORRECT, this.currentQuestion + 1);
        target.classList.add(CORRECT);
        this.answers[this.currentQuestion] = 1;
      } else {
        utils.showAnswer(INCORRECT, this.currentQuestion + 1);
        target.classList.add(INCORRECT);
        this.answers[this.currentQuestion] = -1;
      }
      utils.showAnswerInfo();
      document.querySelector('.forward-btn').textContent = 'Дальше';
    }

    const nextQuestion = (e: MouseEvent) => {
      const target = <HTMLButtonElement>e.target;
      if (this.isAnswered) {
        this.currentQuestion += 1;
        this.drawQuestion(this.currentQuestion);
      } else {
        this.isAnswered = true;
        this.answers[this.currentQuestion] = -1;
        utils.showAnswer(INCORRECT, this.currentQuestion + 1);
        utils.showAnswerInfo();
        target.textContent = 'Дальше';
      }
    }

    const answerBtns = document.querySelector('.answers');
    answerBtns.addEventListener('click', checkAnswer);

    const forwardBtn = document.querySelector('.forward-btn');
    forwardBtn.addEventListener('click', nextQuestion);
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
    const gameWords = await this.controller.getWords('0', '0');
    this.gameWords = utils.shuffleArray(gameWords);
    this.answers = Array(this.gameWords.length).fill(0);
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

    this.playQuestion();

    document.querySelector('.play-answer').addEventListener('click', this.playQuestion.bind(this));
    document.querySelector('.play-question').addEventListener('click', this.playQuestion.bind(this));
    this.addListenets();
  }

  async afterInit() {
    await this.getRoundWords();
    this.drawQuestion(this.currentQuestion);
    this.drawProgress();
  }
}

export const audiocallComponent = new AudiocallComponent({
  selector: 'app-audiocall',
  components: [
    appHeader
  ],
  template: Audiocall,
});
