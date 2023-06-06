export default (data) => {
  const parser = new DOMParser();
  const xmlDOM = parser.parseFromString(data, 'text/xml');

  const parseError = xmlDOM.querySelector('parsererror');
  if (parseError) {
    const err = new Error();
    err.name = parseError.textContent;
    err.message = 'notUrl';
    throw err;
  }
  try {
    const feed = {
      title: xmlDOM.querySelector('title').textContent,
      description: xmlDOM.querySelector('description').textContent,
    };

    const posts = Array.from(xmlDOM.querySelectorAll('item')).map((post) => {
      const title = post.querySelector('title').textContent;
      const description = post.querySelector('description').textContent;
      const link = post.querySelector('link').textContent;
      return { title, description, link };
    });
    return { feed, posts };
  } catch (err) {
    err.message = 'unknown';
    throw err;
  }
};
