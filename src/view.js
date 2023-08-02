import onChange from 'on-change';
import handlePosts from './handlePosts.js';
import handleFeeds from './handleFeeds.js';

const removeError = (elements) => {
  const { input, formFeedback } = elements;
  formFeedback.classList.remove('text-danger');
  formFeedback.classList.remove('text-warning');
  formFeedback.classList.remove('text-success');
  input.classList.remove('is-invalid');
};

const showError = (initialState, elements, i18n) => {
  const { formFeedback: isFeedback } = elements;
  elements.formFeedback.classList.add('text-danger');
  elements.input.classList.add('is-invalid');
  isFeedback.textContent = i18n.t(`errors.${initialState.form.error}`);
};

const handleModal = (value, initialState, elements) => {
  let currentPost;

  initialState.posts.forEach((item) => {
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

const handleLoadingProcess = (value, initialState, elements, i18n) => {
  const { formFeedback: isFeedback } = elements;
  removeError(elements);
  switch (value.status) {
    case 'loading':
      isFeedback.textContent = '';
      break;
    case 'success':
      elements.formFeedback.classList.add('text-success');
      isFeedback.textContent = i18n.t('loading.success');
      elements.form.reset();
      elements.input.focus();
      break;
    case 'failed':
      elements.formFeedback.classList.add('text-danger');
      elements.input.classList.add('is-invalid');
      isFeedback.textContent = i18n.t(`errors.${initialState.loadingProcess.error}`);
      break;
    default:
      break;
  }
};

const handleFrom = (initialState, elements, i18n) => {
  if (!initialState.form.isValidate) {
    showError(initialState, elements, i18n);
    return;
  }
  removeError(elements);
};

const render = (elements, initialState, i18n) => onChange(initialState, (path, value) => {
  switch (path) {
    case 'loadingProcess':
      handleLoadingProcess(value, initialState, elements, i18n);
      break;
    case 'form':
      handleFrom(initialState, elements, i18n);
      break;
    case 'posts':
      handlePosts(initialState, elements, i18n);
      break;
    case 'feeds':
      handleFeeds(initialState, elements, i18n);
      break;
    case 'viewedPosts':
      handlePosts(initialState, elements, i18n);
      break;
    case 'modal.postId':
      handleModal(value, initialState, elements);
      break;
    default:
      break;
  }
});

export default render;
