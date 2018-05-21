import PubSub from 'pubsub-js';
import Comments from './Comments';
import { store } from './store';

export default class ObservableDataSet {
  constructor() {
    this.comments = new Comments();
    
    PubSub.subscribe('storeChanged', () => {
      this.updateStore = store.totalLength;
    });
  }
  
  set nextItem(params) {
    this.comments.nextItem = params;
    this.updateStore = store.totalLength;
  }
  
  set updateStore(totalLength) {
    for (let i = 0; i < totalLength; i++) {
      Object.defineProperty(this, i, {
        set(params) {
          this.comments.editComment = {
            ...params,
            index: i
          };
        },
        configurable: true
      });
    }
  }
}

export const comments = new ObservableDataSet();
