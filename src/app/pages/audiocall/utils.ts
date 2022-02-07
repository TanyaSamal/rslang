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

export const showAnswer = (correctness: string, questionNumber: number) => {
  const progress = document.querySelector(`.progress-status li:nth-child(${questionNumber})`);
  progress.classList.add(correctness);
  const audios = ['audio-right', 'audio-wrong'];
  if (correctness === 'correct') playAudio(audios[0]);
  else playAudio(audios[1]);
}

export const showAnswerInfo = () => {
  const answer = <HTMLDivElement>document.querySelector('.question-info');
  answer.style.display = 'flex';
  const play = <HTMLDivElement>document.querySelector('.play-question');
  play.style.display = 'none';
}
