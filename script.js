// 🌟 OMDB API-avain
const API_KEY = 'd186bc5a';

// 🌟 DOM-elementtien valinta
const searchBtn = document.getElementById('search-btn'); // Hae-nappi
const movieInput = document.getElementById('movie-input'); // Hakukenttä
const resultsDiv = document.getElementById('results'); // Hakutulosten div

const movieDetailsDiv = document.getElementById('movie-details'); // Overlay div lisätiedoille
const movieInfoDiv = document.getElementById('movie-info'); // Sisältö overlayssa
const backBtn = document.getElementById('back-btn'); // Takaisin-nappi

// 🌟 Event listenerit
searchBtn.addEventListener('click', searchMovies); // Hae-nappi klikattaessa
movieInput.addEventListener('keypress', e => { 
  if(e.key === 'Enter') searchMovies(); // Enter näppäin hakee
});
backBtn.addEventListener('click', () => { 
  movieDetailsDiv.style.display = 'none'; // Piilota overlay takaisin-napilla
});

// 🌟 Funktio elokuvien hakemiseen
function searchMovies() {
  const query = movieInput.value.trim(); // Hae hakukentästä teksti
  resultsDiv.innerHTML = ''; // Tyhjennä aiemmat tulokset

  if(!query) return; // Jos tyhjä haku, lopeta

  // Fetch-pyyntö OMDB API:lle
  fetch(`https://www.omdbapi.com/?s=${encodeURIComponent(query)}&apikey=${API_KEY}`)
    .then(res => res.json())
    .then(data => {
      if(data.Response === 'True') {
        // Käydään jokainen tulos läpi
        data.Search.forEach(movie => {
          const card = document.createElement('div'); // Luo div kortille
          card.className = 'movie-card';
          card.innerHTML = `
            <img src="${movie.Poster !== 'N/A' ? movie.Poster : 'https://via.placeholder.com/150x225?text=No+Image'}" alt="${movie.Title}">
            <div class="movie-info">
              <h3>${movie.Title}</h3>
              <p>Vuosi: ${movie.Year}</p>
              <p>Tyyppi: ${movie.Type}</p>
            </div>
          `;
          // 🌟 Klikkaus korttiin näyttää lisätiedot
          card.addEventListener('click', () => showMovieDetails(movie.imdbID));
          resultsDiv.appendChild(card); // Lisää kortti hakutuloksiin
        });
      } else {
        // Jos ei löytynyt mitään
        resultsDiv.innerHTML = `<p>Elokuvaa ei löytynyt haulla: ${query}</p>`;
      }
    });
}

// 🌟 Funktio yksittäisen elokuvan tietojen näyttämiseen
function showMovieDetails(id) {
  fetch(`https://www.omdbapi.com/?i=${id}&plot=full&apikey=${API_KEY}`)
    .then(res => res.json())
    .then(movie => {
      if(movie.Response === 'True') {
        // Lisätietojen HTML-overlay
        movieInfoDiv.innerHTML = `
          <h2>${movie.Title} (${movie.Year})</h2>
          <img src="${movie.Poster !== 'N/A' ? movie.Poster : 'https://via.placeholder.com/250x375?text=No+Image'}" alt="${movie.Title}">
          <p><strong>Genre:</strong> ${movie.Genre}</p>
          <p><strong>Ohjaaja:</strong> ${movie.Director}</p>
          <p><strong>Näyttelijät:</strong> ${movie.Actors}</p>
          <p><strong>Juoni:</strong> ${movie.Plot}</p>
          <p><strong>IMDb:</strong> ⭐ ${movie.imdbRating}</p>
        `;
        movieDetailsDiv.style.display = 'flex'; // Näytä overlay
      }
    });
}
