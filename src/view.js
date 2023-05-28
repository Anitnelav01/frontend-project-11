const clearData = (elements) => {
  const { input, formFeedback } = elements;
  formFeedback.classList.remove('text-danger');
  formFeedback.classList.remove('text-warning');
  formFeedback.classList.remove('text-success');
  input.classList.remove('is-invalid');
};

const handlerFormUrl = (elements, value, i18nInstance) => {
  const { formFeedback: isFeedback } = elements;
  switch (value) {
    case 'loading':
      clearData(elements);
      elements.formFeedback.classList.add('text-success');
      isFeedback.textContent = i18nInstance.t(`loading.success`);
      elements.form.reset();
      elements.input.focus();
      break;
    case 'failed':
      clearData(elements);
      elements.formFeedback.classList.add('text-danger');
      elements.input.classList.add('is-invalid');
      isFeedback.textContent = i18nInstance.t('errors.notUrl');
      elements.form.reset();
      elements.input.focus();
      break;
    default:
      break;
  }
};

const render = (elements, initialState, i18nInstance) => (path, value) => {
  handlerFormUrl(elements, value, i18nInstance);
};

export default render;