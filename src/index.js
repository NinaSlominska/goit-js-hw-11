import axios from "axios"
import { Notify } from 'notiflix/build/notiflix-notify-aio';
const form = document.querySelector('.search-form')
const input = document.querySelector('.search-input')
const gallery = document.querySelector('.gallery')
const loadMore = document.querySelector('.load-more')
let page
form.addEventListener("submit", onSearch)
loadMore.addEventListener('click', onLoadMore)
loadMore.classList.add('visually-hidden')
async function onLoadMore(event) {
    event.preventDefault()
    page += 1
   
    const data = await request(input.value.trim(), page)
    gallery.insertAdjacentHTML("beforeend",createMarkup(data.hits))
   
     if (page > data.totalHits / 40) {
        loadMore.classList.add('visually-hidden')
         Notify.info("We're sorry, but you've reached the end of search results.")
     return    
    }
}


async function onSearch(event) {
    event.preventDefault()
    page = 1
    gallery.innerHTML = ''
    if (!input.value.trim()) {
       Notify.failure("Sorry, there are no images matching your search query. Please try again.") 
       return  
    }
    try {
        const data = await request(input.value.trim(), page)
        if (!data.total) {
           Notify.failure("Sorry, there are no images matching your search query. Please try again.") 
       return
        }
       
        gallery.insertAdjacentHTML("beforeend", createMarkup(data.hits))
        loadMore.classList.remove('visually-hidden')
        
    }
    catch {Notify.failure("Sorry, there are no images matching your search query. Please try again.")}
   
    
}
async function request(searchValue, page) {
    const resp = await axios.get(`https://pixabay.com/api/?key=32924633-fe951661f7e48cba387e32cda&q=${searchValue}&image_type=photo&orientation=horizontal&safesearch=true&per_page=40&page=${page}`) 
   

    return resp.data

}
function createMarkup(arr) {
    
    return arr.map(obj => {
   const{webformatURL,largeImageURL,tags,likes,views,comments,downloads}=obj 
    return `<div class="photo-card">
  <img class="photo-gallery" src="${webformatURL}" alt="${tags}" loading="lazy" />
  <div class="info">
    <p class="info-item">
      <b>Likes ${likes}</b>
    </p>
    <p class="info-item">
      <b>Views ${views}</b>
    </p>
    <p class="info-item">
      <b>Comments${comments}</b>
    </p>
    <p class="info-item">
      <b>Downloads${downloads}</b>
    </p>
  </div>
</div>`
    }).join('')
    
}
