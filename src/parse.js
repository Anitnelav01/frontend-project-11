import onChange from 'on-change';
import i18next from 'i18next';
import axios from 'axios';
import * as yup from 'yup';
import ru from './languages/ru';
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

const getUrlThroughProxi = (url) =>
  `https://allorigins.hexlet.app/get?disableCache=true&url=${url}`;

const getDataRss = (document) => {
  const title = document.querySelector('title').textContent;
  const descriotion = document.querySelector('description').textContent;
  const item = document.querySelectorAll('item');
  const items = Array.from(item).map((el) => el.textContent.split('/n'));
  console.log(items);
  return { title, descriotion, items };
};

const parseData = (data) => {
  const parser = new DOMParser();
  return parser.parseFromString(data, 'text/xml');
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
        .then((link) => axios.get(getUrlThroughProxi(link)))
        .then((response) => {
          console.log(`Здесть${initialState.feeds}`)
          watchState.form.processState = 'loading';
          const result = parseData(response.data.contents);
          const dataRSS = getDataRss(result);
          //console.log(dataRSS.items);
          console.log(initialState.feeds);
          //if(initialState.feeds.includes(value) === ture) {
          //  initialState.form.error.innerHTML = ru.translation.errors.urlExist;
          //} else {
            initialState.feeds.push(value);
          initialState.posts.push(dataRSS.items);
          console.log(initialState);
        })
  
        .catch((err) => {
          //console.log(err.message);
          watchState.form.processState = 'failed';

        });
    });
}
