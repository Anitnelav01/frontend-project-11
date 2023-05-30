const clearData = (elements) => {
  const { input, formFeedback } = elements;
  formFeedback.classList.remove('text-danger');
  formFeedback.classList.remove('text-warning');
  formFeedback.classList.remove('text-success');
  input.classList.remove('is-invalid');
};

const handlerFormUrl = (path, elements, value, i18nInstance, initialState) => {
  const { formFeedback: isFeedback } = elements;
  switch (path) {
    case 'form.processState':
      clearData(elements);
      elements.formFeedback.classList.add('text-success');
      isFeedback.textContent = i18nInstance.t(`${value}.success`);
      elements.form.reset();
      elements.input.focus();
      break;
    case 'form.error':
      console.log(initialState);
      clearData(elements);
      elements.formFeedback.classList.add('text-danger');
      elements.input.classList.add('is-invalid');
      isFeedback.textContent = i18nInstance.t(`errors.${initialState.form.error}`);
      elements.form.reset();
      elements.input.focus();
      break;
    default:
      break;
  }
};

const render = (elements, initialState, i18nInstance) => (path, value) => {
  console.log(path);
  handlerFormUrl(path, elements, value, i18nInstance, initialState);
};

export default render;
