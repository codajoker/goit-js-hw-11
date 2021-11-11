import './css/styles.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { debounce } from 'debounce';
// Описан в документации
import SimpleLightbox from 'simplelightbox';
// Дополнительный импорт стилей
import 'simplelightbox/dist/simple-lightbox.min.css';
const axios = import('axios').default;

import NewsApiServerce from './NewsApiService';
const refs = {
  form: document.querySelector('.search-form'),
  gallery: document.querySelector('.gallery'),
};
const newApiServer = new NewsApiServerce();
console.log(newApiServer);
refs.form.addEventListener('submit', onSerchForm);
window.addEventListener('scroll', debounce(scroll, 300));

refs.gallery.addEventListener('click', ongalleryContainerClick);
async function onSerchForm(e) {
  e.preventDefault();
  refs.gallery.innerHTML = '';
  newApiServer.query = e.currentTarget.elements.searchQuery.value;

  try {
    newApiServer.resetPage();

    const totalHits = await newApiServer.totalHits();
    const hits = await newApiServer.fetchApi();
    Notify.info(`Hooray! We found ${totalHits} images.`);
    if (hits.length === 0) {
      Notify.failure('Sorry, there are no images matching your search query. Please try again.');
      return newApiServer.resetPage();
    }
    refs.gallery.insertAdjacentHTML('beforeend', murkup(hits));
    await lazyScroll();
    let lightbox = new SimpleLightbox('.gallery a', { captionDelay: 250, captionsData: 'alt' });
  } catch {
    console.log(error);
  }
}
async function scroll() {
  try {
    var block = refs.gallery;
    var counter = 1;

    var contentHeight = block.offsetHeight; // 1) высота блока контента вместе с границами
    var yOffset = window.pageYOffset; // 2) текущее положение скролбара
    var window_height = window.innerHeight; // 3) высота внутренней области окна документа
    var y = yOffset + window_height;

    // если пользователь достиг конца
    if (y >= contentHeight) {
      //загружаем новое содержимое в элемент
      const hits = await newApiServer.fetchApi();
      if (hits.length === 0) {
        return Notify.failure(
          'Sorry, there are no images matching your search query. Please try again.',
        );
      }
      refs.gallery.insertAdjacentHTML('beforeend', murkup(hits));
      await lazyScroll();
      let lightbox = new SimpleLightbox('.gallery a', {
        captionDelay: 250,
        captionsData: 'alt',
      });
      lightbox.refresh();
    }
  } catch {
    console.log(error);
  }
}

function murkup(item) {
  return item
    .map(({ webformatURL, largeImageURL, tags, likes, views, comments, downloads }) => {
      return `<div class="photo-card">
   <a class="gallery__item" href="${largeImageURL}"><img src="${webformatURL}" alt="${tags}" loading="lazy" height="400" /></a>
   <div class="info">
     <p class="info-item">
       <b>likes:${likes}</b>
     </p>
     <p class="info-item">
       <b>views:${views}</b>
     </p>
     <p class="info-item">
      <b>comments:${comments}</b>
     </p>
     <p class="info-item">
      <b>downloads:${downloads}</b>
    </p>
   </div>
 </div>
 `;
    })
    .join('');
}
function ongalleryContainerClick(evt) {
  evt.preventDefault();
  if (evt.target.nodeName !== 'IMG') {
    return;
  }
}

async function lazyScroll() {
  const { height: cardHeight } = document
    .querySelector('.gallery')
    .firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
}
