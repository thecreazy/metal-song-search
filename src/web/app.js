/* eslint-disable no-undef */
import axios from "axios";

function debounce(func, wait, immediate) {
    let timeout;
    return function executedFunction() {
      const context = this;
      const args = arguments;  
      const later = function() {
        timeout = null;
        if (!immediate) func.apply(context, args);
      };
      const callNow = immediate && !timeout;
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
      if (callNow) func.apply(context, args);
    };
}

  function millisToMinutesAndSeconds(millis) {
    const minutes = Math.floor(millis / 60000);
    const seconds = ((millis % 60000) / 1000).toFixed(0);
    return minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
  }

const inputType = document.querySelector("#type_input");
const cardsContainer = document.querySelector("#cards");
inputType.addEventListener("input", debounce((event) => {
    axios({
        method: 'get',
        url: `https://metal-song-search.vercel.app/search?q=${event.target.value}`,
      }).then(function (response) {
          const {data = {}} = response;
          const {documents = []} = data;
          cardsContainer.innerHTML = "";
          if(!documents.length) cardsContainer.innerHTML = "<p class='error'>No values found</p>";
          documents.forEach(element => {
            const {id , name, uri, album} = element.value
            const card = `<div class="card" id="${id}">
                <img src="${album.image}" alt="">
                <div class="title">
                    <a href="${uri}" target="_blank">${name}</a>
                </div>
            </div>`;
              cardsContainer.innerHTML += card;
          });
      });
}, 300))

const albumsContainer = document.querySelector("#albums");
const artistsContainer = document.querySelector("#artists");
const durationContainer = document.querySelector("#duration");
axios({
    method: 'get',
    url: `https://metal-song-search.vercel.app/stats`,
}).then(response => {
    const {data = {results : {}}} = response;
    const [stats = {}] = data.results;
    const {avgDuration = 0, numberOfAlbums = 0, numberOfArtists = 0} = stats;
    albumsContainer.innerHTML = numberOfAlbums;
    artistsContainer.innerHTML = numberOfArtists;
    durationContainer.innerHTML = millisToMinutesAndSeconds(avgDuration);
});
