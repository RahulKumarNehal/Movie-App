// API links 
const API_URL =
  "https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key=3fd2be6f0c70a2a598f084ddfb75487c&page=1";
const IMG_PATH = "https://image.tmdb.org/t/p/w1280";
const SEARCH_API =
  "https://api.themoviedb.org/3/search/movie?api_key=3fd2be6f0c70a2a598f084ddfb75487c&query=";

const form = document.getElementById("form");
const search = document.getElementById("search");
const main = document.getElementById("main");
const suggestionsBox = document.createElement("div");

// Add class to style suggestionsBox
suggestionsBox.classList.add("suggestions");
document.body.appendChild(suggestionsBox); 

// Position the suggestion box relative to the search input
const positionSuggestionsBox = () => {
  const rect = search.getBoundingClientRect();
  suggestionsBox.style.position = "absolute";
  suggestionsBox.style.left = `${rect.left}px`;
  suggestionsBox.style.top = `${rect.bottom + window.scrollY}px`;
  suggestionsBox.style.width = `${rect.width}px`;
};

search.addEventListener("focus", positionSuggestionsBox);
window.addEventListener("resize", positionSuggestionsBox);

// Fetch and display popular movies on load
getMovies(API_URL);

// Fetch movies
async function getMovies(url) {
  const res = await fetch(url);
  const data = await res.json();
  showMovies(data.results);
}

// Handle form submit (full search)
form.addEventListener("submit", (e) => {
  e.preventDefault();
  const searchTerm = search.value;
  if (searchTerm && searchTerm !== "") {
    getMovies(SEARCH_API + searchTerm);
    search.value = "";
    suggestionsBox.innerHTML = ""; // Clear suggestions on search
  } else {
    window.location.reload();
  }
});

// Display movie results
function showMovies(movies) {
  main.innerHTML = "";
  movies.forEach((movie) => {
    const { title, poster_path, vote_average, } = movie;
    const movieEl = document.createElement("div");
    movieEl.classList.add("movie");

    movieEl.innerHTML = `
        <img src="${IMG_PATH + poster_path}" alt="${title}">
        <div class="movie-info">
          <h3>${title}</h3>
          <span class="${getClassByRate(vote_average)}">${vote_average}</span>
        </div>`;

    main.appendChild(movieEl);
  });
}

// Get CSS class by rating
function getClassByRate(vote) {
  if (vote >= 8) {
    return "green";
  } else if (vote >= 5) {
    return "orange";
  } else {
    return "red";
  }
}

// Handle search suggestions (autocomplete)
search.addEventListener("input", async () => {
  const searchTerm = search.value;
  if (searchTerm && searchTerm.length > 2) {
    const res = await fetch(SEARCH_API + searchTerm);
    const data = await res.json();
    showSuggestions(data.results);
  } else {
    suggestionsBox.innerHTML = ""; // Clear suggestions if input is empty
  }
});

// Show suggestions in the dropdown
function showSuggestions(movies) {
  suggestionsBox.innerHTML = "";
  movies.forEach((movie) => {
    const suggestionItem = document.createElement("div");
    suggestionItem.classList.add("suggestion-item");
    suggestionItem.textContent = movie.title;

    // Handle click on suggestion
    suggestionItem.addEventListener("click", () => {
      search.value = movie.title;
      getMovies(SEARCH_API + movie.title); // Perform search based on suggestion click
      suggestionsBox.innerHTML = ""; // Clear suggestions after selection
    });

    suggestionsBox.appendChild(suggestionItem);
  });

  // Reposition suggestion box if not already aligned
  positionSuggestionsBox();
}
