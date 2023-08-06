export default (state, elements, i18n) => {
  const { postsBox } = elements;
  const postContainer = document.createElement('div');
  const postTitle = document.createElement('div');
  const listsPost = document.createElement('ul');

  postsBox.innerHTML = '';
  postContainer.classList.add('card', 'border-0');
  postTitle.classList.add('card-body');
  listsPost.classList.add('list-group', 'border-0', 'rounded-0');
  state.posts.forEach((item) => {
    const { id, title, link } = item;
    const itemPost = document.createElement('li');
    const linkPost = document.createElement('a');
    const buttonPost = document.createElement('button');
    itemPost.classList.add(
      'list-group-item',
      'd-flex',
      'justify-content-between',
      'align-items-start',
      'border-0',
      'border-end-0',
    );

    linkPost.textContent = title;
    linkPost.setAttribute('href', link);
    if (state.viewedPosts.has(id)) {
      linkPost.classList.add('fw-normal', 'link-secondary');
    } else {
      linkPost.classList.add('fw-bold');
    }
    linkPost.setAttribute('data-id', id);
    linkPost.setAttribute('target', '_blank');
    linkPost.setAttribute('rel', 'noopener noreferrer');
    buttonPost.setAttribute('type', 'button');

    buttonPost.classList.add('btn', 'btn-outline-primary', 'btn-sm');

    buttonPost.setAttribute('data-id', id);
    buttonPost.setAttribute('data-bs-toggle', 'modal');
    buttonPost.setAttribute('data-bs-target', '#exampleModal');

    buttonPost.textContent = i18n.t('preview');

    itemPost.append(linkPost);
    itemPost.append(buttonPost);
    listsPost.prepend(itemPost);
  });

  const h2 = document.createElement('h2');

  h2.classList.add('card-title', 'h4');
  h2.textContent = i18n.t('posts');

  postTitle.append(h2);
  postContainer.append(postTitle);
  postContainer.append(listsPost);
  postsBox.append(postContainer);
};
