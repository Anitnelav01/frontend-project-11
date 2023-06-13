export default (elements, feeds, i18n) => {
    const feedsBox = elements.feedsBox;
    feedsBox.innerHTML = '';

    const divContainer = document.createElement('div');
    const divBlock = document.createElement('div');
    const h2 = document.createElement('h2');
    const ul = document.createElement('ul');
  
    divContainer.classList.add('card', 'border-0');
    divBlock.classList.add('card-body');
    ul.classList.add('list-group', 'border-0', 'rounded-0');
    h2.classList.add('card-title', 'h4'); 
  
    h2.textContent = i18n.t('feeds');
    for (const feed of feeds){
      let li = document.createElement('li');
      const h3 = document.createElement('h3');
      const p = document.createElement('p');
    
      li.classList.add('list-group-item', 'border-0', 'border-end-0');
      h3.classList.add('h6', 'm-0');
      p.classList.add('m-0', 'small', 'text-black-50');
    
      h3.textContent = feed.title;
      p.textContent = feed.description;
    
      li.append(h3);
      li.append(p);
      ul.prepend(li);
    }

    divBlock.append(h2);
    divContainer.append(divBlock);
    divContainer.append(ul);
    feedsBox.append(divContainer);
  }