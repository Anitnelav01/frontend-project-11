import onChange from 'on-change';
import * as bootstrap from 'bootstrap';
import i18next from 'i18next';
import axios from 'axios';
import * as yup from 'yup';
import ru from './locale/ru';
import render from './view';
import locale from './locale/locale';
import { uniqueId, differenceWith, isEqual } from 'lodash';
import rssParse from './rssParse'

const isValidUrl = (url, urls) => {
  const schema = yup
    .string()
    .trim()
    .required()
    .notOneOf(urls, 'exists')
    .url('notUrl');
  return schema.validate(url);
};

const getProxyUrl = (url) => {
  const baseUrl = (`https://allorigins.hexlet.app/get?disableCache=true&url=${encodeURIComponent(url)}`);
  const proxyUrl = new URL(baseUrl);
  proxyUrl.searchParams.set('disableCache', 'true');
  proxyUrl.searchParams.set('url', url);

  return proxyUrl;
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
    console.log(error);
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
    modal: document.querySelector(".modal"),
    buttonModal: document.querySelector(".btn .btn-outline-primary .btn-sm"),
    myModalEl: document.getElementById('modal'),
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
    render(elements, initialState, i18nInstance)
  );

  elements.form.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const currentUrl = formData.get('url');
    const feedLinks = watchedState.feeds.map((feed) => feed.url);

    isValidUrl(currentUrl, feedLinks)
      .then((link) => axios.get(getProxyUrl(link)))
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

  elements.postsBox.addEventListener('click', (e)=> {
    e.preventDefault();

      const { id } = e.target.dataset;
      if (!id) {
        return;
      }
      watchedState.modal.postId = Number(id);
      watchedState.viewedPosts.add(Number(id));
    }
  )
};
