export default (state, elements, i18n) => {
  const { feedsBox } = elements;
  const feedContainer = document.createElement('div');
  const feedCard = document.createElement('div');
  const feedTitle = document.createElement('h2');
  const feedList = document.createElement('ul');

  feedsBox.innerHTML = '';
  feedContainer.classList.add('card', 'border-0');
  feedCard.classList.add('card-body');
  feedList.classList.add('list-group', 'border-0', 'rounded-0');
  feedTitle.classList.add('card-title', 'h4');

  feedTitle.textContent = i18n.t('feeds');
  state.feeds.forEach((feed) => {
    const listFeed = document.createElement('li');
    const feedElementTitle = document.createElement('h3');
    const feedDescription = document.createElement('p');

    listFeed.classList.add('list-group-item', 'border-0', 'border-end-0');
    feedElementTitle.classList.add('h6', 'm-0');
    feedDescription.classList.add('m-0', 'small', 'text-black-50');

    feedElementTitle.textContent = feed.title;
    feedDescription.textContent = feed.description;

    listFeed.append(feedElementTitle);
    listFeed.append(feedDescription);
    feedList.prepend(listFeed);
  });

  feedCard.append(feedTitle);
  feedContainer.append(feedCard);
  feedContainer.append(feedList);
  feedsBox.append(feedContainer);
};
