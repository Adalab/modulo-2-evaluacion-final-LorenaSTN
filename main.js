"use strict"

// API : https://api.jikan.moe/v4/anime?q=naruto
// Buscador de series
// cambiar la parte naruto por lo que escribe el usuario

//"https://api.jikan.moe/v4/anime?q=" + value


const buttonSearch = document.querySelector(".js-submit-bttn");
const searchedSeries = document.querySelector(".js-search-series");
const inputSearch = document.querySelector(".js-input");


function handleSearchedSeries (event){
    event.preventDefault();
    const value = inputSearch.value;
    // console.log("ha hecho click")
    fetch(`https://api.jikan.moe/v4/anime?q=${value}`)
    // console.log("https://api.jikan.moe/v4/anime?q=" + value)
    .then ((res) => res.json())
    .then((data) => {
        // console.log(data.data);
       
        renderResults(data.data);
      
        // console.log(data.data[0].title)
        // console.log(data.data[0].images.jpg.image_url)
    });
}


buttonSearch.addEventListener("click", handleSearchedSeries);


const placeholderImage = "https://via.placeholder.com/210x295/ffffff/666666/?text=TV."

function renderResults(animeList) {
    searchedSeries.innerHTML = '';
    let resultsHTML = '';

    for (const anime of animeList) {
        const titleSeries = anime.title;
        let imageSeries;

        if (anime.images.jpg.image_url === "https://cdn.myanimelist.net/img/sp/icon/apple-touch-icon-256.png") {
            imageSeries = placeholderImage;
        } else {
            imageSeries = anime.images.jpg.image_url;
        }

        resultsHTML += `
            <div class="anime-card">
                <img src="${imageSeries}" alt="${titleSeries}">
                <h3>${titleSeries}</h3>

            </div>`;

        searchedSeries.innerHTML += resultsHTML; 
    };
}





