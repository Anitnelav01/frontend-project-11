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
    .notOneOf(urls)
    .url();
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
    modal: document.querySelector("#modal")
  };

  const initialState = {
    form: {
      processState: 'filling',
      error: null,
      valid: false,
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
    const value = elements.input.value;
  
    isValidUrl(formData.get('url'), initialState.feeds)
      .then((response) => {
        watchState.form.processState = 'loading';
        watchState.form.valid = true;
        initialState.feeds.push(value);
        console.log(initialState);
      })
      .catch((err) => {
        watchState.form.processState = 'failed';
        watchState.form.valid = false;
        console.log(initialState);
      });
  });
}