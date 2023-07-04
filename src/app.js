import onChange from 'on-change';
import i18next from 'i18next';
import axios from 'axios';
import * as yup from 'yup';
import { uniqueId, differenceWith, isEqual } from 'lodash';
import resources from './locale/resources.js';
import render from './view.js';
import locale from './locale/locale.js';
import rssParse from './rssParse.js';

const getProxyUrl = (url) => {
  const proxyUrl = new URL('/get', 'https://allorigins.hexlet.app');
  proxyUrl.searchParams.set('disableCache', 'true');
  proxyUrl.searchParams.set('url', url);

  return proxyUrl.toString();
};

const validate = (url, urls) => {
  const schema = yup
    .string()
    .trim()
    .required()
    .notOneOf(urls, 'exists')
    .url('notUrl');
  
  return schema.validate(url)
    .then((link) => axios.get(getProxyUrl(link)))
    .catch(error => error.message);
}

const updatePosts = (state) => {
  const promises = state.feeds.map((feed) => axios.get(getProxyUrl(feed.url))
    .then((response) => {
      const { posts } = rssParse(response.data.contents);
      const postsOfFeed = state.posts.filter(({ feedId }) => feedId === feed.id);
      const viewedPosts = postsOfFeed.map((post) => {
        const { title, link, description } = post;
        return { title, link, description };
      });
      const newPosts = differenceWith(posts, viewedPosts, isEqual);
      const newPostsWithIds = newPosts.map((post) => {
        post.id = uniqueId();
        post.feedId = feed.id;
        return post;
      });
      if (newPostsWithIds[0].pubDate !== state.posts[0].pubDate) {
        state.posts.unshift(...newPostsWithIds);
      }
    })
    .catch((error) => {
      console.error(error);
    }));

  return Promise.all(promises)
    .finally(setTimeout(() => updatePosts(state), 5000));
};

export default () => {
  
  const defaultLang = 'ru';
  const i18nInstance = i18next.createInstance();
  i18nInstance.init({
    lng: defaultLang,
    debug: true,
    resources,
  })
    .then(() => {
      yup.setLocale(locale);
    });


  const elements = {
    container: document.querySelector('.container-xxl '),
    form: document.querySelector('.rss-form'),
    input: document.getElementById('url-input'),
    formFeedback: document.querySelector('.feedback'),
    submit: document.querySelector('.rss-form button[type="submit"]'),
    feedsBox: document.querySelector('.feeds'),
    postsBox: document.querySelector('.posts'),
    modal: document.querySelector('.modal'),
    buttonModal: document.querySelector('[data-bs-toggle="modal"]'),
  };

  const initialState = {
    form: {
      processState: 'filling',
      error: null,
    },
    feeds: [],
    posts: [],
    viewedPosts: new Set(),
    modal: {
      postId: null,
    },
  };

  const watchedState = onChange(
    initialState,
    render(elements, initialState, i18nInstance),
  );

  elements.form.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const currentUrl = formData.get('url');
    const feedLinks = watchedState.feeds.map((feed) => feed.url);

    validate(currentUrl, feedLinks)
      .then((response) => {
        const rssData = rssParse(response.data.contents);
        rssData.feed.url = currentUrl;
        watchedState.form.processState = 'loading';
        watchedState.feeds.push(rssData.feed);
        watchedState.posts.push(rssData.posts);
      })

      .catch((err) => {
        watchedState.form.processState = 'failed';
        if (err.name === 'AxiosError') {
          watchedState.form.error = 'network';
          return;
        }
        watchedState.form.error = err.message;
      });
    updatePosts(watchedState);
  });

  elements.postsBox.addEventListener('click', (e) => {
    e.preventDefault();

    const { id } = e.target.dataset;
    if (!id) {
      return;
    }
    watchedState.modal.postId = Number(id);
    watchedState.viewedPosts.add(Number(id));
  });
};

