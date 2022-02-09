import { IUser, IWord, IUserWord, IUserWordInfo, UrlPath, HttpMethod } from "./controllerTypes";

export default class Controller {
  private baseUrl = 'https://rslang-2022.herokuapp.com/';

  async createUser(user: IUser): Promise<IUser> {
    const rawResponse = await fetch(`${this.baseUrl + UrlPath.USERS}`, {
      method: HttpMethod.POST,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(user)
    });
    return rawResponse.json();
  }

  async loginUser(user: IUser): Promise<Response> {
    const rawResponse = await fetch(`${this.baseUrl + UrlPath.SIGNIN}`, {
      method: HttpMethod.POST,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(user)
    });
    return rawResponse;
  }

  async getWords(group: string, page: string): Promise<IWord[]> {
    const rawResponse = await fetch(`${this.baseUrl + UrlPath.WORDS}?group=${group}&page=${page}`);
    return rawResponse.json();
  }

  async getWordById(wordId: string): Promise<IWord> {
    const rawResponse = await fetch(`${this.baseUrl + UrlPath.WORDS}/${wordId}`);
    return rawResponse.json();
  }

  async createUserWord(userId: string, wordId: string, word: IUserWord, token: string): Promise<void> {
    await fetch(`${this.baseUrl + UrlPath.USERS}/${userId}/${UrlPath.WORDS}/${wordId}`, {
      method: HttpMethod.POST,
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(word)
    });
  }

  async getUserWords(userId: string, token: string): Promise<IUserWordInfo[]> {
    const rawResponse = await fetch(`${this.baseUrl + UrlPath.USERS}/${userId}/${UrlPath.WORDS}`, {
      method: HttpMethod.GET,
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
    });
    return rawResponse.json();
  }

  async getUserWordById(userId: string, token: string, wordId: string): Promise<IUserWordInfo> {
    const rawResponse = await fetch(`${this.baseUrl + UrlPath.USERS}/${userId}/${UrlPath.WORDS}/${wordId}`, {
      method: HttpMethod.GET,
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
    });
    return rawResponse.json();
  }

  async updateUserWord(userId: string, token: string, wordId: string, word: IUserWord) {
    await fetch(`${this.baseUrl + UrlPath.USERS}/${userId}/${UrlPath.WORDS}/${wordId}`, {
      method: HttpMethod.PUT,
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(word)
    });
  }

}
