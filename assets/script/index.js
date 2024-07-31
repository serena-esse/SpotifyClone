document.getElementById("searchForm").addEventListener("submit", function (event) {
  event.preventDefault();

  const artistName = document.getElementById("artistName").value;

  //encodeURIComponent lho usato per far si che se nel form vengano inseriti degli spazi o dei caratteri speciali essi vengano convertiti senza causa problemi durante il reindirazzamento
  window.location.href = `artistpage.html?artist=${encodeURIComponent(artistName)}`;
});

document.getElementById("searchForm2").addEventListener("submit", function (event) {
  event.preventDefault();

  const artistName = document.getElementById("artistName2").value;

  //encodeURIComponent lho usato per far si che se nel form vengano inseriti degli spazi o dei caratteri speciali essi vengano convertiti senza causa problemi durante il reindirazzamento
  window.location.href = `artistpage.html?artist=${encodeURIComponent(artistName)}`;
});

const getGreeting = (greetingPlaceholder) => {
  const date = new Date();
  const time = date.getHours();

  if (time < 12) {
    greetingPlaceholder.innerText = "Buongiorno";
  } else if (time >= 12 && time < 18) {
    greetingPlaceholder.innerText = "Buon Pomeriggio";
  } else {
    greetingPlaceholder.innerText = "Buonasera";
  }
};

document.addEventListener("DOMContentLoaded", () => {
  const greetingPlaceholder = document.getElementById("greeting");
  if (greetingPlaceholder) {
    getGreeting(greetingPlaceholder);
  } else {
    console.error("Elemento 'greeting' non trovato");
  }
});

document.addEventListener("DOMContentLoaded", (event) => {
  async function getAlbumInfo(ranDiD) {
    const albumUrl = `https://deezerdevs-deezer.p.rapidapi.com/album/${ranDiD}`;
    console.log(albumUrl);

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
      console.log(data);
      const albumInfo = {
        id: data.id,
        title: data.title,
        cover_medium: data.cover_medium,
        artist: data.artist.name,
        tracks: data.tracks.data,
        tracksName: data.tracks.data.title,
        previewSong: data.tracks.data[1].preview,
        genre: data.genres.data[0].name,
      };
      console.log(data.genres.data[0].name);
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
    11611626, 373880, 73776, 544889292, 477956265, 1604183,
  ];

  function getRandomId(array) {
    const randomInd = Math.floor(Math.random() * array.length);
    return array[randomInd];
  }

  const randomID = getRandomId(albumIds);
  console.log(randomID);
  const ranDiD = randomID;

  const shuffleAlbum = albumIds.sort(() => Math.random() - 0.5);
  getAlbumsInfoByIds(shuffleAlbum).then((albumInfoArray) => {
    console.log(albumInfoArray);

    albumInfoArray.forEach((albumInfo, index) => {
      const containerHeroArtist = document.getElementById("containerHeroArtist");
      const headerHTML = document.createElement("div");
      headerHTML.classList.add("row");
      console.log(albumInfo.title);
      const templateHeader = `
  
   
                  
                    <div class="col-4">
                      <img src="${albumInfo.cover_medium}" class="img-fluid rounded-start" alt="music" />
                    </div>
                    <div class="col-8">
                      <div class="card-body">
                        <div class="row">
                          <div class="col-8"><p>ALBUM</p></div>
                          <div class="col-4">
                            <button
                              type="button"
                              class="btn btn-sm rounded-pill btn-dark text-secondary"
                              id="nascondi-annunci"
                            >
                              NASCONDI ANNUNCI
                            </button>
                          </div>
                        </div>
                        <div class="col-12"><h2 class="card-title fs-1">${albumInfo.tracks[1].title}</h2></div>
                        <div class="col-12"><p class="card-text">${albumInfo.artist}</p></div>

                        <div class="col-12">
                          <div class="row align-items-center column-gap-2" id="buttons">
                            <button type="button" class="btn btn-lg rounded-pill col-4" id="btn1"   data-preview=${albumInfo.tracks[1].preview}>Play</button
                            ><button
                              type="button"
                              class="btn btn-dark btn-lg rounded-pill border border-white col-4"
                              id="btn2"
                            >
                              Salva
                            </button>
                            <a href="" id="leftColumn" class="col-auto">
                              <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" width="25px">
                                <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                                <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
                                <g id="SVGRepo_iconCarrier">
                                  <path
                                    d="M4 9.5C5.38071 9.5 6.5 10.6193 6.5 12C6.5 13.3807 5.38071 14.5 4 14.5C2.61929 14.5 1.5 13.3807 1.5 12C1.5 10.6193 2.61929 9.5 4 9.5Z"
                                  ></path>
                                  <path
                                    d="M12 9.5C13.3807 9.5 14.5 10.6193 14.5 12C14.5 13.3807 13.3807 14.5 12 14.5C10.6193 14.5 9.5 13.3807 9.5 12C9.5 10.6193 10.6193 9.5 12 9.5Z"
                                  ></path>
                                  <path
                                    d="M22.5 12C22.5 10.6193 21.3807 9.5 20 9.5C18.6193 9.5 17.5 10.6193 17.5 12C17.5 13.3807 18.6193 14.5 20 14.5C21.3807 14.5 22.5 13.3807 22.5 12Z"
                                  ></path>
                                </g>
                              </svg>
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                 
  `;
      headerHTML.innerHTML = templateHeader;
      console.log(headerHTML);

      if (index === 0) {
        containerHeroArtist.appendChild(headerHTML);
      } else if (index < 7) {
        const containerMoreAlbums = document.getElementById("containerMoreAlbums");
        const moreAlbumHTML = document.createElement("div");
        moreAlbumHTML.classList.add("col-lg-4", "col-sm-12", "col-md-6");
        const templateMoreAlbum = `<a href="./album2.html?id=${albumInfo.id}">
<div class="row g-0 background-card mb-3" id="allCardBuonasera">
  <div class="col-4">
    <img
      src="${albumInfo.cover_medium}"
      class="img-fluid rounded-start"
      style="height: 100%; min-width: 100%"
      alt="..."
    />
  </div>
  <div class="col-8 d-flex align-items-center ps-2">
    <h6 class="card-title">${albumInfo.title}</h6>
  </div>
</div></a>
`;
        moreAlbumHTML.innerHTML = templateMoreAlbum;
        containerMoreAlbums.appendChild(moreAlbumHTML);
      } else if (index > 6 && index < 15) {
        const containerCardAlbum = document.getElementById("containerMoreAlbums");
        const cardAlbumHTML = document.createElement("div");
        cardAlbumHTML.classList.add("col-lg-3", "col-sm-12", "col-md-6", "p-3");

        const templateCardAlbum = `
        <a href="./album2.html?id=${albumInfo.id}">
<div class="card h-100" id="darker">
  <img src="${albumInfo.cover_medium}" class="card-img-top p-2" alt="..." />
  <div class="card-body">
    <h5 class="card-title">${albumInfo.title}</h5>
    <div class="d-flex align-items-baseline justify-content-between">
      <p class="card-text">${albumInfo.genre}</p>
    </div>
  </div>
</div></a>
`;

        cardAlbumHTML.innerHTML = templateCardAlbum;
        containerCardAlbum.appendChild(cardAlbumHTML);
      }

      headerHTML.addEventListener("click", function (e) {
        const previewUrl = albumInfo.previewSong;
        console.log(previewUrl);

        const songTitle = e.target.dataset.songTitle;
        const audioPlayer = document.getElementById("audio-player");
        const sourceSong = document.getElementById("sourceSong");
        const imgAudio = document.getElementById("imgalbum");
        const titleAudio = document.getElementById("titleaudio");
        titleAudio.innerText = albumInfo.title;
        const titleArtist = document.getElementById("titleartist");

        titleArtist.innerText = albumInfo.artist;
        imgAudio.src = albumInfo.cover_medium;

        sourceSong.src = previewUrl;
        audioPlayer.load();
        audioPlayer.play();
      });
    });
  });
});
