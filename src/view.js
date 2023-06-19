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
      clearData(elements);
      elements.formFeedback.classList.add('text-danger');
      elements.input.classList.add('is-invalid');
      isFeedback.textContent = i18n.t(`errors.${initialState.form.error}`);
      elements.form.reset();
      elements.input.focus();
      break;
      case 'posts':
      const posts = initialState.posts;
      //console.log(initialState.posts);
      getPosts(elements, posts, i18n);
      case 'feeds':
      const feeds = initialState.feeds;
      getFeeds(elements, feeds, i18n);
      default:
      break;
  }
};

const render = (elements, initialState, i18n) => (path, value) => {
  handlerFormUrl(path, elements, value, i18n, initialState);
};

export default render;
