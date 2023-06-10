export default (elements, posts, i18n) => {
  const postsBox = elements.postsBox;
  const divContainer = document.createElement('div');
  const divBlockTitle = document.createElement('div');
  const listsPost = document.createElement('ul');

  divContainer.classList.add('card', 'border-0');
  divBlockTitle.classList.add('card-body');
  listsPost.classList.add('list-group', 'border-0', 'rounded-0');

  for (const post of posts){
    const { id, title, link } = post;
    console.log(post);
    let itemPost = document.createElement('li');
    let linkPost = document.createElement('a');
    const buttonPost = document.createElement('button');
    itemPost.classList.add('list-group-item',
    'd-flex',
    'justify-content-between',
    'align-items-start',
    'border-0',
    'border-end-0');

    linkPost.textContent = title;

    linkPost.setAttribute('href', link);
    linkPost.classList.add('fw-bold');

    linkPost.setAttribute('data-id', id);
    linkPost.setAttribute('target', '_blank');
    linkPost.setAttribute('rel', 'noopener noreferrer');
    buttonPost.setAttribute('type', 'button');

    buttonPost.classList.add('btn', 'btn-outline-primary', 'btn-sm');

    buttonPost.setAttribute('data-id', id);
    buttonPost.setAttribute('data-bs-toggle', 'model');
    buttonPost.setAttribute('data-bs-target', '#model');

    buttonPost.textContent = i18n.t('preview');

    itemPost.append(linkPost);
    itemPost.append(buttonPost);
    listsPost.append(itemPost);
  }

  const h2 = document.createElement('h2');
  h2.classList.add('card-title' ,'h4');
  h2.textContent = i18n.t('posts');

  divBlockTitle.append(h2);
  divContainer.append(divBlockTitle);
  divContainer.append(listsPost);
  postsBox.prepend(divContainer);
}
