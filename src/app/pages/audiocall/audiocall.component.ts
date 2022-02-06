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

class AudiocallComponent extends Component {
  private controller = new Controller();
  private gameWords: IWord[] = [];
  private currentQuestion = 0;

  playQuestion() {
    utils.playWord(this.gameWords[this.currentQuestion].audio);
  }

  async getRoundWords() {
    this.gameWords = await this.controller.getWords('0', '0');
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
    let answers = this.generateAnswers(idx);
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

  drawQurestion(idx: number) {
    this.currentQuestion = idx;
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

    document.querySelector('.play-answer').addEventListener('click', this.playQuestion.bind(this));
    document.querySelector('.play-question').addEventListener('click', this.playQuestion.bind(this));
  }

  async afterInit() {
    await this.getRoundWords();
    this.drawQurestion(0);
  }
}

export const audiocallComponent = new AudiocallComponent({
  selector: 'app-audiocall',
  components: [
    appHeader
  ],
  template: Audiocall,
});
