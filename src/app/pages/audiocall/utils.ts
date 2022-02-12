import { IGamePoints } from "../../componentTypes";

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
  audio.src = `https://raw.githubusercontent.com/tanyasamal/img/master/quiz/${src}.mp3`;
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
  const audios = ['audio-right', 'audio-wrong'];
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
  const today = new Date().toLocaleDateString();
  if (localStorage.getItem('audiocallPoints')) {
    const localResults: IGamePoints = JSON.parse(localStorage.getItem('audiocallPoints'));
    if (localResults.date === today) {
      points += +(localResults.points);
    } else {
      localStorage.removeItem('audiocallPoints');
    }
  }
  localStorage.setItem('audiocallPoints', JSON.stringify({
    points: points.toString(),
    date: today
  }));
  document.querySelector('.game-points').textContent = `${points}`;
}
