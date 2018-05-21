import { comments as commentsAPI } from './ObservableDataSet';

export class PublicAPI {
  static Post(text, title, time) {
    commentsAPI.nextItem = {
      text,
      title,
      time
    };
  }
  
  static Edit(index, data) {
    commentsAPI[index] = data;
  }
}

/** Expose Public API */
export default window.PublicAPI = PublicAPI;
