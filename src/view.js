import onChange from 'on-change';
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

  state.forEach((item) => {
    if (Number(item.id) === Number(value)) {
      currentPost = item;
    }
  });

  const {
    description, id, title, link,
  } = currentPost;
  const modalTitle = document.querySelector('.modal-title');
  const modalBody = document.querySelector('.modal-body');
  const modalLink = document.querySelector('.btn-primary');

  elements.modal.setAttribute('data-id', id);
  modalTitle.textContent = title;
  modalBody.textContent = description;
  modalLink.setAttribute('href', link);
};

const handlerFormUrl = (path, elements, value, i18n, initialState) => {
  const { formFeedback: isFeedback } = elements;
  const { postsBox, feedsBox } = elements;
  switch (path) {
    case 'loadingProcess':
      clearData(elements);
      if (initialState.loadingProcess.status === 'loading') {
        isFeedback.textContent = '';
      }
      if (initialState.loadingProcess.status === 'success') {
        elements.formFeedback.classList.add('text-success');
        isFeedback.textContent = i18n.t('loading.success');
        elements.form.reset();
        elements.input.focus();
      }
      if (initialState.loadingProcess.status === 'failed') {
        elements.formFeedback.classList.add('text-danger');
        elements.input.classList.add('is-invalid');
        isFeedback.textContent = i18n.t(`errors.${initialState.loadingProcess.error}`);
      }
      break;
    case 'form':
      clearData(elements);
      elements.formFeedback.classList.add('text-danger');
      elements.input.classList.add('is-invalid');
      isFeedback.textContent = i18n.t(`errors.${initialState.form.error}`);
      break;
    case 'posts':
      postsBox.innerHTML = '';
      getPosts(initialState, elements, initialState.posts, i18n);
      break;
    case 'feeds':
      feedsBox.innerHTML = '';
      getFeeds(elements, initialState.feeds, i18n);
      break;
    case 'viewedPosts':
      postsBox.innerHTML = '';
      getPosts(initialState, elements, initialState.posts, i18n);
      break;
    case 'modal.postId':
      renderModal(value, initialState.posts, elements);
      break;
    default:
      break;
  }
};

const render = (elements, initialState, i18n) => onChange(initialState, (path, value) => {
  handlerFormUrl(path, elements, value, i18n, initialState);
});

export default render;
