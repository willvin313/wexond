import { observable } from 'mobx';

export default class Page {
  @observable public id: number = -1;
  @observable public url: string = 'https://nersent.tk/Projects/Material-React';

  public webview: any;

  constructor(id: number) {
    this.id = id;
  }
}
