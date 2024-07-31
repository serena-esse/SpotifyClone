document.getElementById("searchForm5").addEventListener("submit", function (event) {
  event.preventDefault();

  const artistName = document.getElementById("artistName5").value;

  //encodeURIComponent lho usato per far si che se nel form vengano inseriti degli spazi o dei caratteri speciali essi vengano convertiti senza causa problemi durante il reindirazzamento
  window.location.href = `artistpage.html?artist=${encodeURIComponent(artistName)}`;
});

document.getElementById("searchForm6").addEventListener("submit", function (event) {
  event.preventDefault();

  const artistName = document.getElementById("artistName6").value;

  //encodeURIComponent lho usato per far si che se nel form vengano inseriti degli spazi o dei caratteri speciali essi vengano convertiti senza causa problemi durante il reindirazzamento
  window.location.href = `artistpage.html?artist=${encodeURIComponent(artistName)}`;
});

document.addEventListener("DOMContentLoaded", function () {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);

  const albumId = urlParams.get("id");

  if (albumId) {
    displayAlbumInfo(albumId);
  } else {
    console.error("ID dell'album non fornito");
  }
});

async function displayAlbumInfo(albumId) {
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
        logoartist: data.artist.picture,
        releaseIn: data.release_date,
        duration: data.duration,
        numberOfTracks: data.nb_tracks,
      };
      console.log(data);
      return albumInfo;
    } catch (errore) {
      console.error(errore.message);
      return null;
    }
  }

  try {
    const albumInfo = await getAlbumInfo(albumId);

    if (albumInfo) {
      const containerHeaderPage = document.getElementById("albumHeader");
      const hdPgHTML = document.createElement("div");
      hdPgHTML.classList.add("albumInfo", "ms-2", "d-flex", "flex-column", "flex-md-row", "align-items-md-center");
      const logoArtistP = albumInfo.logoartist;
      const albumImage = albumInfo.cover_medium;
      const albumTitle = albumInfo.title;
      const artistName = albumInfo.artist;
      const durationAlb = albumInfo.duration;
      const releaseDate = albumInfo.releaseIn;
      const allTracks = albumInfo.numberOfTracks;
      const tracks = albumInfo.tracks;
      console.log(tracks);
      const headerPageTemplate = `
      <img
      src="${albumImage}"
      class="img-fluid albumImgContainer mb-3 mb-md-0"
      style="max-width: 220px; align-self: flex-start"
      />
      
      <div class="flex-column ms-md-3">
      <div class="mb-3 mb-md-0">
      <p class="bodyText gap-1 d-md-block d-none">Album</p>
      <p class="albumName text-md">${albumTitle}</p>
      </div>
      
      <div class="d-flex flex-row-md">
      <p class="m-0"></p>
      <p class="px-1 m-0">
      <img
      src="${logoArtistP}"
      alt="logo artista"
      class="rounded-pill border border-light me-2"
      style="max-width: 24px"
      />${artistName}
      </p>
      <p class="px-1 m-0 text-white-50">${releaseDate}</p>
      <p class="px-1 d-md-block d-none">${allTracks}</p>
      <p class="px-1 d-md-block d-none text-white-50">${durationAlb + " s"}</p>
      </div>
      </div>
      `;
      hdPgHTML.innerHTML = headerPageTemplate;
      containerHeaderPage.appendChild(hdPgHTML);

      albumInfo.tracks.forEach((track, index) => {
        const containerSongs = document.getElementById("containerSongsAlbum");
        const trackHTML = document.createElement("div");
        trackHTML.classList.add("col-12", "d-flex", "pb-3");

        const templateTracks = `
        
          <div class="container" data-preview=${track.preview}>            
            <div class="row d-flex justify-content-between">
              <div class="col-1 text-center d-md-block d-none">${index + 1}</div>
              <div class="col-6 text-start">
                <p class="m-0" >${track.title}</p>
                <p class="text-white-50">${track.artist.name}</p>
              </div>
              <div class="col-2 text-center text-white-50 d-md-block d-none">${track.rank}</div>
              <div class="col-3 text-end text-white-50 d-md-block d-none">${track.duration + " s"}</div>
              <div class="col-3 text-end text-white-50 d-md-none d-block">
                <svg
                  opacity="0.5"
                  width="25px"
                  viewBox="0 0 16 16"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="#ffffff"
                  class="bi bi-three-dots-vertical"
                >
                  <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                  <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
                  <g id="SVGRepo_iconCarrier">
                    <path
                      d="M9.5 13a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z"
                    ></path>
                  </g>
                </svg>
              </div>
            </div>         
       `;
        trackHTML.innerHTML = templateTracks;
        containerSongs.appendChild(trackHTML);

        trackHTML.addEventListener("click", function (e) {
          const previewUrl = track.preview;

          const songTitle = track.title;
          const audioPlayer = document.getElementById("audio-player");
          const sourceSong = document.getElementById("sourceSong");
          const imgAudio = document.getElementById("imgalbum");
          const titleAudio = document.getElementById("titleaudio");
          titleAudio.innerText = albumInfo.title;
          const titleArtist = document.getElementById("titleartist");

          titleArtist.innerText = albumInfo.artist;
          imgAudio.src = albumImage;

          sourceSong.src = previewUrl;
          audioPlayer.load();
          audioPlayer.play();
        });
      });
    } else {
      console.error("Informazioni sull'album non disponibili");
    }
  } catch (error) {
    console.error(error.message);
  }
}
