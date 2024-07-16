"use strict"

// API : https://api.jikan.moe/v4/anime?q=naruto
// Buscador de series
// cambiar la parte naruto por lo que escribe el usuario

//"https://api.jikan.moe/v4/anime?q=" + value


const buttonSearch = document.querySelector(".js-submit-bttn");
const searchedSeries = document.querySelector(".js-search-series");
const inputSearch = document.querySelector(".js-input");
const favouriteSeries = document.querySelector(".js-favourite-series");
const titleFavourites = document.querySelector(".js-title-favourites");
const titleCard = document.querySelector(".title-card")

const animeLocalStorage = JSON.parse(localStorage.getItem("animeSeriesSaved"));


let animeSeriesList = [];
let favouriteSeriesList = [];



function handleSearchedSeries (event){
    event.preventDefault();
    const value = inputSearch.value;
    // console.log("ha hecho click")

    if(animeLocalStorage !== null){
        animeSeriesList = animeLocalStorage;
        renderResults(animeLocalStorage, searchedSeries)
    }else{
    fetch(`https://api.jikan.moe/v4/anime?q=${value}`)
    // console.log("https://api.jikan.moe/v4/anime?q=" + value)
    .then ((res) => res.json())
    .then((data) => {
        // console.log(data.data);
        // console.log(data.data[0].mal_id);
        animeSeriesList = data.data;

        localStorage.setItem("animeSeriesSaved", JSON.stringify(animeSeriesList));


        renderResults(animeSeriesList, searchedSeries);
      
        // console.log(data.data[0].title)
        // console.log(data.data[0].images.jpg.image_url)
    });
}
};


buttonSearch.addEventListener("click", handleSearchedSeries);


const placeholderImage = "https://via.placeholder.com/210x295/ffffff/666666/?text=TV"

function renderResults(animeSeriesList, searchedSeries) {
    searchedSeries.innerHTML = '';
    let resultsHTML = '';

    for (const anime of animeSeriesList) {
        const titleSeries = anime.title;
        const animeId = anime.mal_id; 
        let imageSeries;
    

        if (anime.images.jpg.image_url === "https://cdn.myanimelist.net/img/sp/icon/apple-touch-icon-256.png") {
            imageSeries = placeholderImage;
        } else {
            imageSeries = anime.images.jpg.image_url;
        }

        resultsHTML += `
            <div class="anime-card js-series" id="${animeId}">
                <h3 class="title-card">${titleSeries}</h3>
                <img src="${imageSeries}" alt="${titleSeries}">

            </div>`;

        searchedSeries.innerHTML += resultsHTML; 

        
        const animeSeries = document.querySelectorAll(".js-series");
        
        for(const animeSerie of animeSeries){
            animeSerie.addEventListener("click", handleFavouriteSeries);
        }
    };
}

function handleFavouriteSeries (event){
    const idClickedAnime = parseInt(event.currentTarget.id);

    const seriesSelected = animeSeriesList.find((anime) =>{
        return idClickedAnime === anime.mal_id;
        
        }
    );

    event.currentTarget.classList.add('favourite-card');


    const titleClickedAnime = event.currentTarget.querySelector('.title-card');
    titleClickedAnime.classList.add('title-anime-card');

    const indexSeriesFavourites = favouriteSeriesList.findIndex((favouriteAnime)=> {
        return idClickedAnime === favouriteAnime.mal_id;
        }
    );



// Si no existe como favorita:
if (indexSeriesFavourites === -1){
    favouriteSeriesList.push(seriesSelected);
    renderResults(favouriteSeriesList, favouriteSeries);
    titleFavourites.classList.remove("hidden");
    }
}





