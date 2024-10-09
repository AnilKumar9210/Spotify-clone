async function getSongs() {
    let a = await fetch("http://127.0.0.1:5500/Spotify-clone/songs/");
    let response = await a.text();
    let div = document.createElement("div");
    div.innerHTML = response;
    let as = div.getElementsByTagName("a");
    let songs = [];
    for (let i = 0; i < as.length; i++) {
        let element = as[i];
        if (element.href.endsWith("mp3")) {
            songs.push(element.href);
        }
    }

    let songUL = document.querySelector(".songList");
    songUL.innerHTML = "";

    for (const song of songs) {
        songUL.innerHTML = songUL.innerHTML + `<li>
                    <img class="invert m-10" src="Images/music.svg" alt="">
                    <div class="name">
                        ${song.split("/songs/")[1].replaceAll("%20")}
                    </div>
                    <img class="invert m-10" src="Images/play-button.svg" alt="">
                </li>`
    }
}

getSongs()