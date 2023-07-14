import { uniqueId } from 'lodash';

export default (data) => {
  const parser = new DOMParser();
  const xmlDOM = parser.parseFromString(data, 'text/xml');

  const parseError = xmlDOM.querySelector('parsererror');
  if (parseError) {
    const error = new Error(parseError.textContent);
    error.name = 'parserError';
    throw error;
  }

  const feed = {
    title: xmlDOM.querySelector('title').textContent,
    description: xmlDOM.querySelector('description').textContent,
  };

  const posts = Array.from(xmlDOM.querySelectorAll('item')).map((post) => {
    const title = post.querySelector('title').textContent;
    const description = post.querySelector('description').textContent;
    const link = post.querySelector('link').textContent;
    const id = uniqueId();
    return {
      title,
      description,
      link,
      id,
    };
  });

  return { feed, posts };
};
