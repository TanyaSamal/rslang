import { IUser, IAuth } from "./controllerTypes";

const path = {
  users: 'users',
  words: 'words',
  signin: 'signin'
}

export default class Controller {
  private baseUrl = 'https://rslang-2022.herokuapp.com/';

  async createUser(user: IUser): Promise<IUser> {
    const rawResponse = await fetch(`${this.baseUrl + path.users}`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(user)
    });
    console.log(rawResponse);
    const content = await rawResponse.json();
    return content;
  }

  async loginUser(user: IUser): Promise<Response> {
    const rawResponse = await fetch(`${this.baseUrl + path.signin}`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(user)
    });
    return rawResponse;
  }

}
