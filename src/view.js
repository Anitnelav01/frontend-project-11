import getPosts from './getPosts';
import getFeeds from './getFeeds';

const clearData = (elements) => {
  const { input, formFeedback } = elements;
  formFeedback.classList.remove('text-danger');
  formFeedback.classList.remove('text-warning');
  formFeedback.classList.remove('text-success');
  input.classList.remove('is-invalid');
};

const handlerFormUrl = (path, elements, value, i18n, initialState) => {
  const { formFeedback: isFeedback } = elements;
  switch (path) {
    case 'form.processState':
      clearData(elements);
      elements.formFeedback.classList.add('text-success');
      isFeedback.textContent = i18n.t(`${value}.success`);
      elements.form.reset();
      elements.input.focus();
      break;
      case 'form.error':
      //console.log(initialState);
      clearData(elements);
      elements.formFeedback.classList.add('text-danger');
      elements.input.classList.add('is-invalid');
      isFeedback.textContent = i18n.t(`errors.${initialState.form.error}`);
      elements.form.reset();
      elements.input.focus();
      break;
      case 'posts':
      const feed = initialState.posts.feed;
      const posts = initialState.posts.posts;
     // console.log(posts[0].title);
      getPosts(elements, posts, i18n);
      getFeeds(elements, feed, i18n);
    default:
      break;
  }
};

const render = (elements, initialState, i18n) => (path, value) => {
  handlerFormUrl(path, elements, value, i18n, initialState);
  //console.log(initialState);
};

export default render;
