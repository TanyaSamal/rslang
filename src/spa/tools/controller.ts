import { router } from "./router";
import { IUser, IWord, IUserWord, IUserWordInfo, UrlPath, HttpMethod, IAuth, IStatistics } from "./controllerTypes";

export default class Controller {
  private baseUrl = 'https://rslang-2022.herokuapp.com/';

  async createUser(user: IUser): Promise<Response> {
    const rawResponse = await fetch(`${this.baseUrl + UrlPath.USERS}`, {
      method: HttpMethod.POST,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(user)
    });
    return rawResponse;
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

  async getUserName(userId: string, token: string): Promise<string> {
    const rawResponse = await fetch(`${this.baseUrl + UrlPath.USERS}/${userId}`, {
      method: HttpMethod.GET,
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
    });
    const body: IUser = await rawResponse.json();
    return body.name;
  }

  async getWords(group: string, page: string): Promise<IWord[]> {
    const rawResponse = await fetch(`${this.baseUrl + UrlPath.WORDS}?group=${group}&page=${page}`);
    return rawResponse.json();
  }

  async getWordById(wordId: string): Promise<IWord> {
    const rawResponse = await fetch(`${this.baseUrl + UrlPath.WORDS}/${wordId}`);
    return rawResponse.json();
  }

  async getNewToken(userId: string): Promise<string> {
    const { refreshToken } = JSON.parse(localStorage.getItem('userInfo'));
    const rawResponse = await fetch(`${this.baseUrl + UrlPath.USERS}/${userId}/${UrlPath.TOKENS}`, {
      method: HttpMethod.GET,
      headers: {
        'Authorization': `Bearer ${refreshToken}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
    });
    if (rawResponse.status === 401) {
      localStorage.removeItem('userInfo');
      router.navigate('auth');
      return null;
    }
    const content: Promise<IAuth> = await rawResponse.json();
    window.localStorage.setItem('userInfo', JSON.stringify(content));
    return (await content).token;
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
    if (rawResponse.status === 401) {
      const newToken = await this.getNewToken(userId);
      await this.getUserWords(userId, newToken);
      return null;
    }
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
    if (rawResponse.status === 401) {
      const newToken = await this.getNewToken(userId);
      await this.getUserWordById(userId, newToken, wordId);
      return null;
    }
    if (rawResponse.status === 404) {
      return null;
    }
    return rawResponse.json();
  }

  async updateUserWord(userId: string, token: string, wordId: string, word: IUserWord) {
    const rawResponse = await fetch(`${this.baseUrl + UrlPath.USERS}/${userId}/${UrlPath.WORDS}/${wordId}`, {
      method: HttpMethod.PUT,
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(word)
    });
    if (rawResponse.status === 401) {
      const newToken = await this.getNewToken(userId);
      await this.updateUserWord(userId, newToken, wordId, word);
    }
  }

  async createUserWord(userId: string, wordId: string, word: IUserWord, token: string) {
    const rawResponse = await fetch(`${this.baseUrl + UrlPath.USERS}/${userId}/${UrlPath.WORDS}/${wordId}`, {
      method: HttpMethod.POST,
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(word)
    });
    if (rawResponse.status === 401) {
      this.createUserWord(userId, wordId, word, token);
    }
    if (rawResponse.status === 417) {
      await this.updateUserWord(userId, token, wordId, word);
    }
  }

  async getAgregatedWords(userId: string, token: string, group: string, filter: string) {
    const rawResponse = await fetch(`${this.baseUrl + UrlPath.USERS}/${userId}/${UrlPath.AGREGATED}?group=${group}&wordsPerPage=20&filter=${filter}`, {
      method: HttpMethod.GET,
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });
    if (rawResponse.status === 401) {
      const newToken = await this.getNewToken(userId);
      await this.getAgregatedWords(userId, newToken, group, filter);
      return null;
    }
    return rawResponse.json();
  }

  async getStatistics(userId: string, token: string): Promise<IStatistics> {
    const rawResponse = await fetch(`${this.baseUrl + UrlPath.USERS}/${userId}/${UrlPath.STATISTICS}`, {
      method: HttpMethod.GET,
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });
    if (rawResponse.status === 401) {
      const newToken = await this.getNewToken(userId);
      await this.getStatistics(userId, newToken);
      return null;
    }
    if (rawResponse.status === 404) {
      return null;
    }
    return rawResponse.json();
  }

  async setStatistics(userId: string, token: string, statistic: IStatistics): Promise<void> {
    const rawResponse = await fetch(`${this.baseUrl + UrlPath.USERS}/${userId}/${UrlPath.STATISTICS}`, {
      method: HttpMethod.PUT,
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(statistic)
    });
    if (rawResponse.status === 401) {
      const newToken = await this.getNewToken(userId);
      await this.setStatistics(userId, newToken, statistic);
    }
  }

}
