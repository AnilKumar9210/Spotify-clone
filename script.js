let curSong = new Audio();
let songs = []
let isPause;
let curFolder;
async function getSongs(folder) {
    curFolder = `http://127.0.0.1:5500/Spotify-clone/${folder}/`;
    let a = await fetch(`http://127.0.0.1:5500/Spotify-clone/${folder}/`);
    let response = await a.text();
    let div = document.createElement("div");
    div.innerHTML = response;
    let as = div.getElementsByTagName("a");
    songs = [];
    for (let i = 0; i < as.length; i++) {
        let element = as[i];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split(`/${folder}/`)[1]);
        }
    }

    let songUL = document.querySelector(".songList");
    songUL.innerHTML = "";

    for (const song of songs) {
        songUL.innerHTML = songUL.innerHTML + `<li>
                    <img class="invert m-10" src="Images/music.svg" alt="">
                    <div class="name">
                        ${song.replaceAll("%20", " ")}
                    </div>
                    <img class="invert m-10" src="Images/play-button.svg" alt="">
                </li>`
    }


    Array.from(document.querySelector(".songList").getElementsByTagName("li")).forEach(e => {
        e.addEventListener("click", (element) => {
            playMusic(e.querySelector(".name").innerHTML.trim())
        })
    })

}

function previousSong() {
    let index = songs.indexOf(curSong.src.split("/").slice(-1)[0])
    if ((index - 1) >= 0) {
        playMusic(songs[index - 1].replaceAll("%20", " "))
    }
}



function playPauseMusic() {
    if (!isPause) {
        curSong.pause();
        isPause = true
        document.querySelector(".playSong").src = "Images/play-button.svg"
    } else {
        curSong.play();
        isPause = false;
        document.querySelector(".playSong").src = "Images/pause.svg"
    }
}

function playNextSong() {
    let index = songs.indexOf(curSong.src.split("/").slice(-1)[0])
    if ((index + 1) <= songs.length - 1) {
        playMusic(songs[index + 1].replaceAll("%20", " "))
    }
}

function playMusic(track, pause = false) {
    curSong.src = `${curFolder}/` + track;
    if (!pause) {
        curSong.play();
        document.querySelector(".playSong").src = "Images/pause.svg"
        isPause = false;
    }
    document.querySelector(".songName").innerHTML = track;
    document.querySelector(".time").textContent = "00:00/00:00";
}

function secondsToMinutesSeconds(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "00:00";
    }

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');

    return `${formattedMinutes}:${formattedSeconds}`;
}

curSong.addEventListener ("timeupdate", ()=> {
    document.querySelector (".time").innerHTML = `${secondsToMinutesSeconds (curSong.duration)} / ${secondsToMinutesSeconds (curSong.currentTime)}`;
    document.querySelector (".circle").style.left = (curSong.currentTime/curSong.duration) * 100 + "%";
})

document.addEventListener ("DOMContentLoaded", function () {
    document.querySelector("#seekBar").addEventListener("click", e => {
        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
        document.querySelector(".circle").style.left = percent + "%";
        currentSong.currentTime = ((curSong.duration) * percent) / 100;
    })
})

// getSongs ("songs/Devara")
function loadSongs () {
    Array.from (document.getElementsByClassName ('card')).forEach (e=> {
        e.addEventListener ('click', async (item)=> {
            await getSongs (`songs/${item.currentTarget.dataset.folder}`)
        })
    })
}

async function displayAlbums () {
    let a = await fetch(`http://127.0.0.1:5500/Spotify-clone/songs/`);
    let response = await a.text();
    let div = document.createElement("div");
    div.innerHTML = response;
    let as = div.getElementsByTagName("a");
    let array = Array.from (as);
    let cardContainer = document.querySelector (".cardList");
    for (let i=0; i<array.length; i++) {
        let element = array[i];
        if (element.href.includes ("/songs/")) {
            let folder = element.href.split ("songs/").slice (-1);
            let a = await fetch (`http://127.0.0.1:5500/Spotify-clone/songs/${folder}/info.json`);
            let response = await a.json ();
            cardContainer.innerHTML = cardContainer.innerHTML + `<div class="card" data-folder="${folder}" onclick="loadSongs ()">
              <img
                src="/songs/${folder}/cover"
                width="200"
                height="200"
                alt=""
              />
              <h1>${response.title}</h1>
              <h4>${response.description}</h4>
            </div>`
        }
    }

}

async function main () {
    await displayAlbums  ();
}

main ();