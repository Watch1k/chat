import { TimelineMax } from 'gsap';
import PubSub from 'pubsub-js';
import { store } from './store';

export default class Comments {
  constructor() {
    this.container = document.querySelector('.comments');
    this.sectionName = 'comment';
    this.textName = `${this.sectionName}__text`;
    this.titleName = `${this.sectionName}__title`;
    this.timeName = `${this.sectionName}__time`;
    this.editName = `${this.sectionName}__edit`;
    this.removeName = `${this.sectionName}__remove`;
  }
  
  set nextItem(params) {
    const elements = this.addComment(params);
    
    this.initAnim(elements);
    store.totalLength++;
    PubSub.publish('storeChanged');
  }
  
  set editComment({ text, title, time, index }) {
    const messageContainer = this.container.children[index];
    
    messageContainer.querySelector(`.${this.textName}`).innerHTML = text;
    messageContainer.querySelector(`.${this.titleName}`).innerHTML = title;
    messageContainer.querySelector(`.${this.timeName}`).innerHTML = time;
  }
  
  createNextItem(params) {
    this.nextItem = params;
  }
  
  addComment(params) {
    return this.createComment(params);
  }
  
  createComment({ text, title, time }) {
    const section = this.createSection();
    
    //create text
    const textContainer = this.createChild({
      section,
      text,
      elementSelector: 'p',
      selectorClass: this.textName
    });
    
    //create title
    const titleContainer = this.createChild({
      section,
      text: title,
      elementSelector: 'h1',
      selectorClass: this.titleName
    });
    
    //create time
    const timeContainer = this.createChild({
      section,
      text: time,
      selectorClass: this.timeName
    });
    
    //create edit button
    const editBtn = this.createChild({
      section,
      text: 'Edit',
      elementSelector: 'button',
      selectorClass: this.editName,
      elementType: 'button'
    });
    
    //create remove button
    const removeBtn = this.createChild({
      section,
      text: 'Remove',
      elementSelector: 'button',
      selectorClass: this.removeName,
      elementType: 'button'
    });
    
    //handle events
    this.handleRemove(removeBtn, section);
    this.handleEdit({
      editBtn,
      titleContainer,
      textContainer
    });
    
    return {
      textContainer,
      titleContainer,
      timeContainer,
      editBtn,
      removeBtn
    };
  }
  
  handleRemove(btn, container) {
    btn.addEventListener('click', () => {
      container.remove();
      store.totalLength--;
      PubSub.publish('storeChanged');
    });
  }
  
  /**
   * @param editBtn {HTMLElement}
   * @param titleContainer {HTMLElement}
   * @param textContainer {HTMLElement}
   */
  handleEdit({ editBtn, titleContainer, textContainer }) {
    editBtn.addEventListener('click', () => {
      editBtn.classList.toggle('is-active');
      
      const active = editBtn.classList.contains('is-active');
      
      active ? editBtn.innerText = 'Save' : editBtn.innerText = 'Edit';
      
      titleContainer.classList.toggle('is-edit');
      titleContainer.setAttribute('contenteditable', active);
      
      textContainer.classList.toggle('is-edit');
      textContainer.setAttribute('contenteditable', active);
    });
  }
  
  createSection() {
    const section = document.createElement('section');
    
    section.classList.add(this.sectionName);
    this.container.appendChild(section);
    
    return section;
  }
  
  createChild({ section, text, elementSelector, selectorClass, elementType }) {
    const element = document.createElement(elementSelector || 'div');
    
    if (elementType) element.setAttribute('type', elementType);
    if (selectorClass) element.classList.add(selectorClass);
    element.innerText = text;
    section.appendChild(element);
    
    return element;
  }
  
  initAnim(elements) {
    const {
      titleContainer: title,
      textContainer: text,
      timeContainer: time,
      editBtn,
      removeBtn
    } = elements;
    const tl = new TimelineMax();
    
    tl
    //title, time
      .fromTo([title, time], 0.5, {
        autoAlpha: 0,
        y: 30
      }, {
        autoAlpha: 1,
        y: 0,
        ease: Power1.easeInOut,
        onStart() {
          this.target.forEach(item => item.classList.add('transition-off'));
        },
        onComplete() {
          this.target.forEach(item => item.classList.remove('transition-off'));
        }
      })
      //text
      .fromTo(text, 0.5, {
        autoAlpha: 0,
        y: 30
      }, {
        autoAlpha: 1,
        y: 0,
        ease: Power1.easeInOut,
        onStart() {
          this.target.classList.add('transition-off');
        },
        onComplete() {
          this.target.classList.remove('transition-off');
        }
      }, '-=0.35')
      //buttons
      .fromTo([editBtn, removeBtn], 0.5, {
        autoAlpha: 0,
        y: 10
      }, {
        autoAlpha: 1,
        y: 0,
        ease: Power1.easeInOut,
        onStart() {
          this.target.forEach(item => item.classList.add('transition-off'));
        },
        onComplete() {
          this.target.forEach(item => item.classList.remove('transition-off'));
        }
      }, '-=0.2');
  }
}
