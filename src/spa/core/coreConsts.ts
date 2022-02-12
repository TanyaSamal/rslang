export type GAME = {
    name: string;
    description: string;
}

export const GAME_SPRINT_OPTIONS: GAME = {
    name: 'Спринт',
    description: 'Необходимо проверить соответствует ли перевод истине. На это отводится 60 сек.'
};
  
export const GAME_AUDIOCALL_OPTIONS: GAME = {
    name: 'Аудиовызов',
    description: 'Необходимо из предложенных вариантов ответа выбрать правильный перевод слова, которое услышите.'
};

export const SPRINT_STATE = 'sprintState';