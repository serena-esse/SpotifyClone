// __________________________________________________________________________
document.getElementById("searchForm3").addEventListener("submit", function (event) {
  event.preventDefault();

  const artistName = document.getElementById("artistName3").value;

  //encodeURIComponent lho usato per far si che se nel form vengano inseriti degli spazi o dei caratteri speciali essi vengano convertiti senza causa problemi durante il reindirazzamento
  window.location.href = `artistpage.html?artist=${encodeURIComponent(artistName)}`;
});

document.getElementById("searchForm4").addEventListener("submit", function (event) {
  event.preventDefault();

  const artistName = document.getElementById("artistName4").value;

  //encodeURIComponent lho usato per far si che se nel form vengano inseriti degli spazi o dei caratteri speciali essi vengano convertiti senza causa problemi durante il reindirazzamento
  window.location.href = `artistpage.html?artist=${encodeURIComponent(artistName)}`;
});

// ______________________________________________________________________________
document.addEventListener("DOMContentLoaded", function () {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);

  const artistName = urlParams.get("artist");

  if (artistName) {
    searchDeezerArtist(artistName);
  } else {
    console.error("Nome dell'artista non fornito ");
  }
});

// Funzione per ottenere album in modo randomico
async function getAlbumInfo(albumId) {
  const albumUrl = `https://deezerdevs-deezer.p.rapidapi.com/album/${albumId}`;

  const options = {
    method: "GET",
    headers: {
      "X-RapidAPI-Key": token,
      "X-RapidAPI-Host": "deezerdevs-deezer.p.rapidapi.com",
    },
  };

  try {
    const response = await fetch(albumUrl, options);

    if (!response.ok) {
      throw new Error(`Errore: ${response.status}`);
    }

    const data = await response.json();

    const albumInfo = {
      id: data.id,
      title: data.title,
      cover_medium: data.cover_medium,
      artist: data.artist.name,
      tracks: data.tracks.data,
    };
    console.log(data);
    return albumInfo;
  } catch (errore) {
    console.error(errore.message);
    return null;
  }
}

async function getAlbumsInfoByIds(albumIds) {
  const albumInfoArray = [];

  for (const albumId of albumIds) {
    const albumInfo = await getAlbumInfo(albumId);
    if (albumInfo) {
      albumInfoArray.push(albumInfo);
    }
  }

  return albumInfoArray;
}

const albumIds = [
  595243, 75378, 122366, 382685427, 199146112, 7079242, 66768702, 253927, 212377, 9410100, 441697007, 239901952,
  11611626, 373880, 73776,
];

const shuffleAlbum = albumIds.sort(() => Math.random() - 0.5).slice(0, 6);
getAlbumsInfoByIds(shuffleAlbum).then((albumInfoArray) => {
  console.log(albumInfoArray);

  albumInfoArray.forEach((albumInfo) => {
    const containerSugg = document.getElementById("containerSuggested");
    const sugHTML = document.createElement("div");
    sugHTML.classList.add("col-4", "col-md-3", "col-lg-2", "discCards");
    const templateSug = `
  
    <a href="./album2.html?id=${albumInfo.id}">
    <div class="discCovers border-radius rounded-circle">
    <img src="${albumInfo.cover_medium}" class="img-fluid border-radius rounded-circle" />
    </div>
    <div class="discText">
    <p class="subtitles mb-0 mt-2">${albumInfo.title}</p>
    <p>${albumInfo.artist}</p>
    </div>
<a/>
  `;
    sugHTML.innerHTML = templateSug;
    containerSugg.appendChild(sugHTML);
  });
});

// FUNZIONE DEL FORM
function searchDeezerArtist(artistName) {
  const artistUrl = `https://deezerdevs-deezer.p.rapidapi.com/search?q=${artistName}`;

  const options = {
    method: "GET",
    headers: {
      "X-RapidAPI-Key": token,
      "X-RapidAPI-Host": "deezerdevs-deezer.p.rapidapi.com",
    },
  };

  fetch(artistUrl, options)
    .then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error(`errore pay att!: ${response.status}`);
      }
    })
    .then((artistData) => {
      displayResults(artistData);
    })
    .catch((error) => {
      console.error(error);
    });
}
// FUNZIONE DEL FORM

// FUNZIONE DEL DISPLAYALBUM
const displayedAlbumIds = [];
function displayResults(artistData) {
  const imgBg = document.getElementById("imgBg");
  const titlePageArtist = document.getElementById("artistTitle");

  if (artistData && artistData.data) {
    const albums = artistData.data;

    imgBg.src = albums[1].artist.picture_xl;
    titlePageArtist.innerText = albums[1].artist.name;
    const viewers = document.getElementById("viewers");
    viewers.innerText = Math.floor(Math.random() * 30000000) + " monthly listeners";

    albums.forEach((album, index) => {
      const resultsContainer = document.getElementById("containerSongs");
      const containerDisco = document.getElementById("containerDisco");

      const albumTitle = album.album.title;
      const songTitle = album.title;
      const previewSong = album.preview;
      const artist = album.artist.name;
      const albumImage = album.album.cover_medium;
      const rank = album.rank;
      const duration = album.duration + "s";
      const idAlbum = album.album.id;
      const type = album.album.type;

      if (!displayedAlbumIds.includes(idAlbum)) {
        displayedAlbumIds.push(idAlbum);
        const templateDisco = `
  
  <a href="./album2.html?id=${idAlbum}">
    <div class="discCovers">
    <img src="${albumImage}" class="img-fluid" />
    </div>
    
    <div class="discText">
    <p class="subtitles mb-0 mt-2">${albumTitle}</p>
    <p>${type}</p>
    </div>
  </a>`;

        const discoHTML = document.createElement("div");
        discoHTML.classList.add("col-4", "col-md-3", "col-lg-2", "discCards");
        discoHTML.innerHTML = templateDisco;

        containerDisco.appendChild(discoHTML);
      }

      const template = `
<div class="col-1 songPlay " data-preview=${album.preview} >▶</div>
<div class="col-1 songNum">${index + 1}</div>
<div class="col-2 albumImg gx-1"><img src="${albumImage}" /></div>
<div class="col-4 d-flex me-auto"><a href="#">${songTitle}</a></div>
<div class="col-3 d-none d-md-block">${rank}</div>
<div class="col-1 fs-6 heartIcon">♡</div>
<div class="col-1">${duration}</div>`;

      const songHTML = document.createElement("div");
      songHTML.classList.add("row", "popularSongs", "align-items-center", "p-2", "track");
      songHTML.innerHTML = template;
      resultsContainer.appendChild(songHTML);

      songHTML.addEventListener("click", function (e) {
        const previewUrl = previewSong;

        const songTitle = e.target.dataset.songTitle;
        const audioPlayer = document.getElementById("audio-player");
        const sourceSong = document.getElementById("sourceSong");
        const imgAudio = document.getElementById("imgalbum");
        const titleAudio = document.getElementById("titleaudio");
        titleAudio.innerText = album.title;
        const titleArtist = document.getElementById("titleartist");

        titleArtist.innerText = artist;
        imgAudio.src = albumImage;

        sourceSong.src = previewUrl;
        audioPlayer.load();
        audioPlayer.play();
      });
    });
  } else {
    console.error("Dati dell'artista non validi");
  }
}
// FUNZIONE DEL DISPLAYALBUM
