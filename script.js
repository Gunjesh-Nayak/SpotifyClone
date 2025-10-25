console.log("hrllo")
let currentSong = new Audio();


function parseSongInfo(url) {
    let filename = url.split("/").pop().replace(".mp3", "");
    let cleaned = filename.replace(/^128-/, "");
    cleaned = decodeURIComponent(cleaned);

    // Match only up to "Stree 2" or the second " - " (title - artist)
    let match = cleaned.match(/^(.+?)\s*-\s*(.+?)(\s|$)/);
    let title = match ? match[1].trim() : "Unknown";
    let artist = match ? match[2].trim() : "Unknown";

    return { title, artist, url };
}

const playsong = (track) => {
    // let audio = new Audio(track);
    currentSong.src = track;
    currentSong.play();
    // audio.play();
    if (currentSong.played) {
        play.src = "pause.svg";
    }
}


async function getsongs() {
    try {
        let a = await fetch("http://127.0.0.1:5500/songs/");
        let response = await a.text();

        let div = document.createElement("div");
        div.innerHTML = response;

        let as = div.getElementsByTagName("a");
        var songs = [];

        for (let element of as) {
            if (element.href.endsWith(".mp3")) {
                songs.push(element.href);
            }
        }

        // console.log(songs);
    } catch (error) {
        console.error("Error fetching songs:", error);
    }
    return songs;

}
async function main() {
    let song = await getsongs();

    // console.log(song)

    let songcard = document.querySelector(".cardContainer").getElementsByTagName("div")[0];
    let html = "";

    for (const element of song) {
        let { title, artist, url } = parseSongInfo(element);

        html += `
                <div class="card" data-url="${url}">

                    <div class="play">
                        <svg width="50" height="50" viewBox="0 0 50 50">
                            <circle cx="25" cy="25" r="24" fill="#1fdf64" />
                            <polygon points="20,15 35,25 20,35" fill="black" />
                        </svg>
                    </div>
                    <img src="https://i.scdn.co/image/ab67616d00001e026fbb60d6a7e03ccb940a518e" alt="song"
                            srcset="">
                            
                        <h3>${title}</h3>
                        
                        <p><a draggable="true" dir="auto" href="/artist/6eUKZXaKkcviH0Ku9w2n3V">${artist}</a></p>
                    </div>
            `;
    }

    songcard.innerHTML = html;

    document.querySelectorAll(".card").forEach(card => {
        card.addEventListener("click", () => {
            if (currentSong.paused || currentSong.src !== card.dataset.url) {

                const url = card.dataset.url;
                console.log("Playing:", card.querySelector("h3").innerText);
                playsong(url);
                document.getElementsByClassName("songName")[0].innerHTML = `<b>${card.querySelector("h3").innerText}</b>`;

                console.log(card.querySelector("h3").innerText);
                play.src = "pause.svg";
                document.querySelector("title").innerText = "Spotify: " + card.querySelector("h3").innerText;
            }
            else {
                if (currentSong.src === card.dataset.url) {
                    currentSong.pause();
                    play.src = "play.svg";
                    document.querySelector("title").innerText = "Spotify - Web Player: Music for everyone";
                }
            }
        });
    })


    play.addEventListener("click", () => {
        if (currentSong.paused) {
            currentSong.play();
            // play.classList.add("playing");
            play.src = "pause.svg";
        } else {
            currentSong.pause();
            play.src = "play.svg";
            // play.classList.remove("playing");
        }
    });
    previous.addEventListener("click", () => {
        // Logic for previous song
        console.log("Previous song clicked");
        let idx = song.indexOf(currentSong.src);

        if (idx !== -1 && idx > 0) {
            let prevSong = song[idx - 1];
            playsong(prevSong);
            document.getElementsByClassName("songName")[0].innerHTML = `<b>${parseSongInfo(prevSong).title}</b>`;
            document.querySelector("title").innerText = "Spotify: " + parseSongInfo(prevSong).title;
        }
    });
    next.addEventListener("click", () => {
        // Logic for next song
        console.log("Next song clicked");
        let idx = song.indexOf(currentSong.src);
        if (idx !== -1 && idx < song.length - 1) {
            let nextSong = song[idx + 1];
            playsong(nextSong);
            document.getElementsByClassName("songName")[0].innerHTML = `<b>${parseSongInfo(nextSong).title}</b>`;
            document.querySelector("title").innerText = "Spotify: " + parseSongInfo(nextSong).title;
        }
    });


    currentSong.addEventListener("timeupdate", () => {
        console.log("Current time:", currentSong.currentTime, "Duration:", currentSong.duration);
        document.getElementsByClassName("duration")[0].innerHTML = `
  <div>
    ${Math.floor(currentSong.currentTime / 60)}:${Math.floor(currentSong.currentTime % 60).toString().padStart(2, '0')}
     / 
    ${Math.floor(currentSong.duration / 60)}:${Math.floor(currentSong.duration % 60).toString().padStart(2, '0')}
  </div>`;
        document.querySelector(".seeker").style.left = `${(currentSong.currentTime / currentSong.duration) * 100}%`;

    })

    document.querySelector(".timestamp").addEventListener("click", (e) => {
        const rect = e.target.getBoundingClientRect();
        const x = e.clientX - rect.left; // x position within the element
        const width = rect.width;
        const percentage = x / width;
        currentSong.currentTime = percentage * currentSong.duration;
    });

}


main();

