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
    .url()
    .notOneOf(urls);
  return schema.validate(url)
    .then(() => null)
    .catch((error) => error.message.key);
};

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

const getError = (error) => {
  if (error.isAxiosError) {
    return 'network';
  }
  if (error.isParseError) {
    return 'noRss';
  }
  return 'unknown';
};

const loadRss = (url, watchedState) => {
  watchedState.loadingProcess.state = 'loading';

  axios.get(getProxyUrl(url))
    .then((response) => {
      const { feed, posts } = rssParse(response.data.contents);

      feed.url = url;
      posts.map((post) => {
        const postId = post;
        postId.id = uniqueId();
        return postId;
      });
      watchedState.loadingProcess.state = 'success';
      watchedState.feeds.push(feed);
      watchedState.posts.push([...posts]);
    })
    .catch((error) => {
      const err = getError(error);
      watchedState.loadingProcess.error = err;
      watchedState.loadingProcess.state = 'failed';
    });
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
    container: document.querySelector('.container-xxl'),
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
      isValidate: true,
      error: null,
    },
    loadingProcess: {
      state: '',
      error: null,
    },
    feeds: [],
    posts: [],
    viewedPosts: new Set(),
    modal: {
      postId: null,
    },
  };

  const view = render(elements, initialState, i18nInstance);

  elements.form.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const url = formData.get('url');
    const urls = initialState.feeds.map((feed) => feed.url);

    validate(url, urls)
      .then((error) => {
        if (error) {
          view.form = { error, isValidate: false };
          return;
        }
        view.form = { error: '', isValidate: true };
        loadRss(url, view);
      });
  });

  elements.postsBox.addEventListener('click', (e) => {
    const { id } = e.target.dataset;
    if (!id) {
      return;
    }
    view.modal.postId = Number(id);
    view.viewedPosts.add(Number(id));

    updatePosts(view);
  });
};
