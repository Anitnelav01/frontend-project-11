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

const showError = (state, elements, i18n) => {
  const { formFeedback, input } = elements;
  formFeedback.classList.add('text-danger');
  input.classList.add('is-invalid');
  formFeedback.textContent = i18n.t(`errors.${state.form.error}`);
};

const handleModal = (value, state, elements) => {
  const {
    modal, modalTitle, modalBody, modalLink,
  } = elements;
  const currentPost = state.posts.find((item) => item.id === value);

  const {
    description, id, title, link,
  } = currentPost;

  modal.setAttribute('data-id', id);
  modalTitle.textContent = title;
  modalBody.textContent = description;
  modalLink.setAttribute('href', link);
};

const handleLoadingProcess = (value, state, elements, i18n) => {
  const { formFeedback, form, input } = elements;
  removeError(elements);
  switch (value.status) {
    case 'loading':
      formFeedback.textContent = '';
      break;
    case 'success':
      formFeedback.classList.add('text-success');
      formFeedback.textContent = i18n.t('loading.success');
      form.reset();
      input.focus();
      break;
    case 'failed':
      formFeedback.classList.add('text-danger');
      input.classList.add('is-invalid');
      formFeedback.textContent = i18n.t(`errors.${state.loadingProcess.error}`);
      break;
    default:
      break;
  }
};

const handleFrom = (state, elements, i18n) => {
  if (!state.form.isValidate) {
    showError(state, elements, i18n);
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
