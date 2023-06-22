import getPosts from './getPosts';
import getFeeds from './getFeeds';

const clearData = (elements) => {
  const { input, formFeedback } = elements;
  formFeedback.classList.remove('text-danger');
  formFeedback.classList.remove('text-warning');
  formFeedback.classList.remove('text-success');
  input.classList.remove('is-invalid');
};

const renderModal = (value, state, elements) => {
  let currentPost;
  for( const posts of state) {
    for( const post of posts) {
      if (post.id == value) {
        currentPost =  post;
    }
  }
}

  const {
    description, id, title, link,
  } = currentPost;
  const modal = elements.modal;

  const modalTitle = document.querySelector('.modal-title');
  const modalBody = document.querySelector('.modal-body');
  const modalLink = document.querySelector('.btn-primary');

  modal.setAttribute('data-id', id);
  modalTitle.textContent = title;
  modalBody.textContent = description;
  modalLink.setAttribute('href', link);
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
      getPosts(elements, initialState.posts, i18n, initialState);
    case 'feeds':
      getFeeds(elements, initialState.feeds, i18n, initialState);
    case 'viewedPosts':
      getPosts(elements, initialState.posts, i18n);
      break;
    case 'modal.postId':
      renderModal(value, initialState.posts, elements);
      break;
      default:
      break;
  }
};

const render = (elements, initialState, i18n) => (path, value) => {
  handlerFormUrl(path, elements, value, i18n, initialState);
};

export default render;
