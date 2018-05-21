import ObservableDataSet from './ObservableDataSet';

class Common {
  constructor() {
    this.init();
  }
  
  init() {
    const comments = new ObservableDataSet();
    const post = (text, title, time) => {
      comments.nextItem = {
        text,
        title,
        time
      };
    };
    const edit = (itemIndex, data) => {
      comments[itemIndex] = data;
    };
    
    post('lorem lorem lorem', 'My comment', '12:31');
    post('lorem lorem lorem', 'My comment', '12:32');
    
    setTimeout(() => {
      edit(0, {
        text: 'Edit edit edit',
        title: 'My Edit',
        time: '12:35'
      });
    }, 2000);
    
    setTimeout(() => {
      post('some new post', 'New post!', '12:36');
    }, 3000);
  }
}

export default new Common();
