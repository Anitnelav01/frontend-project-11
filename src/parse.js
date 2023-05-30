import onChange from 'on-change';
import i18next from 'i18next';
import axios from 'axios';
import * as yup from 'yup';
import ru from './locale/ru';
import locale from './locale/locale';
import render from './view';

const isValidUrl = (url, urls) => {
  const schema = yup
    .string()
    .trim()
    .required()
    .notOneOf(urls, 'exists')
    .url('notUrl');
  return schema.validate(url);
};

export default () => {
  const defaultLang = 'ru';
  const i18nInstance = i18next.createInstance();
  i18nInstance.init({
    lng: defaultLang,
    debug: true,
    resources: {
      ru,
    },
  });
  
  yup.setLocale(locale);

  const elements = {
    container: document.querySelector('.container-xxl '),
    form: document.querySelector('.rss-form'),
    input: document.getElementById('url-input'),
    formFeedback: document.querySelector('.feedback'),
    submit: document.querySelector('.rss-form button[type="submit"]'),
    feedsBox: document.querySelector(".feeds"),
    postsBox: document.querySelector(".posts"),
    modal: document.querySelector("#modal"),
  };

  const initialState = {
    form: {
      processState: 'filling',
      error: null,
    },
    feeds: [],
    posts: [],
  };

  const watchState = onChange(
    initialState,
    render(elements, initialState, i18nInstance)
  );


  elements.form.addEventListener('submit', (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const currentUrl = formData.get('url');
    const value = elements.input.value;
  
    isValidUrl(currentUrl, initialState.feeds)
    .then(() => {
      watchState.form.processState = 'loading';
      watchState.feeds.push(value);
    })
    .catch((err) => {
      watchState.form.processState = 'failed';
      watchState.form.error = err.message;
    });
  });
}