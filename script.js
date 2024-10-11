let curSong = new Audio();
let songs = []
let isPause;
async function getSongs() {
    let a = await fetch("http://127.0.0.1:5500/Spotify-clone/songs/");
    let response = await a.text();
    let div = document.createElement("div");
    div.innerHTML = response;
    let as = div.getElementsByTagName("a");
    // let songs = [];
    for (let i = 0; i < as.length; i++) {
        let element = as[i];
        if (element.href.endsWith("mp3")) {
            songs.push(element.href.split("/songs/")[1]);
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

// function timeUpdate ()


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
    curSong.src = "http://127.0.0.1:5500/Spotify-clone/songs/" + track;
    if (!pause) {
        curSong.play();
        document.querySelector(".playSong").src = "Images/pause.svg"
        isPause = false;
    }
    document.querySelector(".songName").innerHTML = track;
    document.querySelector(".time").textContent = "00:00/00:00";
}


getSongs()