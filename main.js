"use strict";

const buttonSearch = document.querySelector(".js-submit-bttn");
const searchedSeries = document.querySelector(".js-search-series");
const inputSearch = document.querySelector(".js-input");
const favouriteSeries = document.querySelector(".js-favourite-series");
const titleFavourites = document.querySelector(".js-title-favourites");
const titleCard = document.querySelector(".title-card");
const divFavourites = document.querySelector(".js-div-favourites");
const titleSearch = document.querySelector(".js-title-search");
const divSearch = document.querySelector(".js-div-search");
const resetButton = document.querySelector(".js-reset-bttn");
const deleteFavourites = document.querySelector(".js-delete-favourites");

let animeSeriesList = [];
let favouriteSeriesList = [];

const savedFavourites = JSON.parse(localStorage.getItem("favouriteSeries"));
if (savedFavourites && savedFavourites.length > 0) {
  favouriteSeriesList = savedFavourites;
  renderResults(favouriteSeriesList, favouriteSeries, true);
  titleFavourites.classList.remove("hidden");
  divFavourites.classList.remove("hidden");
  titleSearch.classList.add("hidden");
  divSearch.classList.add("hidden");
} else {
  titleFavourites.classList.add("hidden");
  divFavourites.classList.add("hidden");
}

function handleSearchedSeries(event) {
  event.preventDefault();
  const value = inputSearch.value;

  fetch(`https://api.jikan.moe/v4/anime?q=${value}`)
    .then((res) => res.json())
    .then((data) => {
      animeSeriesList = data.data;

      renderResults(animeSeriesList, searchedSeries, false);
    });
}

buttonSearch.addEventListener("click", handleSearchedSeries);

const placeholderImage =
  "https://via.placeholder.com/210x295/ffffff/666666/?text=TV.";

function renderResults(animeSeriesList, searchedSeries, isFavourite) {
  searchedSeries.innerHTML = "";
  let resultsHTML = "";

  if (animeSeriesList.length > 0) {
    titleSearch.classList.remove("hidden");
    divSearch.classList.remove("hidden");
  } else {
    titleSearch.classList.add("hidden");
    divSearch.classList.add("hidden");
  }

  for (const anime of animeSeriesList) {
    const titleSeries = anime.title;
    const animeId = anime.mal_id;
    let imageSeries;

    if (
      anime.images.jpg.image_url ===
      "https://cdn.myanimelist.net/img/sp/icon/apple-touch-icon-256.png"
    ) {
      imageSeries = placeholderImage;
    } else {
      imageSeries = anime.images.jpg.image_url;
    }

    resultsHTML += `
            <div class="anime-card ${
              isFavourite ? "" : "js-normal-series"
            }"  id="${animeId}">
                <h3 class="title-card">${titleSeries}</h3>
                <img class="img-card" src="${imageSeries}" alt="${titleSeries}">
                ${
                  isFavourite
                    ? '<button class="button-x js-button-x">X</button>'
                    : ""
                }
            </div>`;
  }
  searchedSeries.innerHTML = resultsHTML;

  if (searchedSeries.length > 0) {
    titleSearch.classList.remove("hidden");
  }

  const animeSeries = document.querySelectorAll(".js-normal-series");

  for (const animeSerie of animeSeries) {
    animeSerie.addEventListener("click", handleFavouriteSeries);
  }

  const xButton = document.querySelectorAll(".js-button-x");

  for (const xbttn of xButton) {
    xbttn.addEventListener("click", handleRemovingFavourites);
  }
}

function handleFavouriteSeries(event) {
  const idClickedAnime = parseInt(event.currentTarget.id);

  const seriesSelected = animeSeriesList.find((anime) => {
    return idClickedAnime === anime.mal_id;
  });

  event.currentTarget.classList.add("favourite-card");

  const titleClickedAnime = event.currentTarget.querySelector(".title-card");
  titleClickedAnime.classList.add("title-anime-card");

  const indexSeriesFavourites = favouriteSeriesList.findIndex(
    (favouriteAnime) => {
      return idClickedAnime === favouriteAnime.mal_id;
    }
  );

  if (indexSeriesFavourites === -1) {
    favouriteSeriesList.push(seriesSelected);
    renderResults(favouriteSeriesList, favouriteSeries, true);
    titleFavourites.classList.remove("hidden");
    divFavourites.classList.remove("hidden");

    localStorage.setItem(
      "favouriteSeries",
      JSON.stringify(favouriteSeriesList)
    );
  }
}

function handleRemovingFavourites(event) {
  const idClickedAnime = parseInt(event.currentTarget.parentNode.id);

  favouriteSeriesList = favouriteSeriesList.filter(
    (series) => series.mal_id !== idClickedAnime
  );

  console.log(favouriteSeriesList.length);

  if (favouriteSeriesList.length > 0) {
    renderResults(favouriteSeriesList, favouriteSeries, true);
  } else {
    favouriteSeries.innerHTML = "";
    titleFavourites.classList.add("hidden");
    divFavourites.classList.add("hidden");
  }
  //   else {

  //   }
  localStorage.setItem("favouriteSeries", JSON.stringify(favouriteSeriesList));
}

function handleResetButton() {
  favouriteSeriesList = [];
  animeSeriesList = [];

  localStorage.removeItem("favouriteSeries");

  titleFavourites.classList.add("hidden");
  divFavourites.classList.add("hidden");
  titleSearch.classList.add("hidden");
  divSearch.classList.add("hidden");

  favouriteSeries.innerHTML = "";
  searchedSeries.innerHTML = "";

  inputSearch.value = "";
}

resetButton.addEventListener("click", handleResetButton);
