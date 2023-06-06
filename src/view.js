const clearData = (elements) => {
  const { input, formFeedback } = elements;
  formFeedback.classList.remove('text-danger');
  formFeedback.classList.remove('text-warning');
  formFeedback.classList.remove('text-success');
  input.classList.remove('is-invalid');
};

const getPosts = (initialState, i18n) => {
  const divContainer = document.createElement('div');
  divContainer.classList.add('card', 'border-0');
  const divBlockTitle = document.createElement('div');
  divBlockTitle.classList.add('card-body');
  const listsPost = document.createElement('ul');
  listsPost.classList.add('list-group', 'border-0', 'rounded-0');
  listsPost.append(initialState.posts);
  const h2 = document.createElement('h2');
  h2.classList.add('card-title' ,'h4');
  h2.textContent = i18n.t('posts');
  divBlockTitle.append(h2);
  divContainer.append(divBlockTitle);
  divContainer.append(listsPost);
  document.querySelector(".posts").append(divContainer);
}

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
      //console.log(initialState);
      //console.log(postsBox);
      getPosts(initialState, i18n);
    default:
      break;
  }
};

const render = (elements, initialState, i18n) => (path, value) => {
  handlerFormUrl(path, elements, value, i18n, initialState);
  //console.log(initialState);
};

export default render;
