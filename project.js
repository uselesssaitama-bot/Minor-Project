const bar = document.querySelector(".bar");
const progressCircle = document.querySelector(".circle");
const songs = [
{
    title: "Midnight Coding",
    artist: "Code Music",
    cover: "midnight1.jpg",
    audio: "midnightAudio.opus"
},
{
    title: "Rainy Night",
    artist: "Lofi Cafe • Rain Sounds",
    cover: "rain1.jpg",
    audio: "rainyAudio.opus"
},

{
    title: "Coffee Time",
    artist: "Study Beats",
    cover: "coffee2.jpg",
    audio: "coffeeAudio.opus"
}

];

const audio = document.getElementById("audio");
const cover = document.getElementById("cover");
const title = document.getElementById("title");
const artist = document.getElementById("artist");
const playBtn = document.getElementById("play");
const prevBtn = document.getElementById("prev");
const nextBtn = document.getElementById("next");
const cards = document.querySelectorAll(".song-card");
const volume = document.getElementById("volume");
const volumeIcon = document.getElementById("volume-icon");
audio.volume=1;
let previousVolume = 1; 

let currentSong = 0;

function loadSong(index){

    currentSong = index;
    title.innerText = songs[index].title;
    artist.innerText = songs[index].artist;
    cover.src = songs[index].cover;
    audio.src = songs[index].audio;
    cards.forEach(card=>card.classList.remove("active"));
    cards[index].classList.add("active");
}

function playSong() {
    audio.play()
        .catch(error => {
            console.log("Playback failed:", error);
        });
}

function pauseSong() {
    audio.pause();
}


audio.addEventListener("play", () => {
    playBtn.textContent = "❚❚";
    cover.classList.add("playing");
});

audio.addEventListener("pause", () => {
    playBtn.textContent = "▶";
    cover.classList.remove("playing");
});


playBtn.addEventListener("click",()=>{

    if(audio.paused){
        playSong();
    }else{
        pauseSong();
    }

});

nextBtn.addEventListener("click",()=>{

    currentSong++;

    if(currentSong>=songs.length){

        currentSong=0;

    }

    loadSong(currentSong);

    playSong();

});

prevBtn.addEventListener("click",()=>{
    currentSong--;
    if(currentSong<0){
        currentSong=songs.length-1;

    }
    loadSong(currentSong);
    playSong();

});

cards.forEach((card,index)=>{

    card.addEventListener("click",()=>{

        loadSong(index);

        playSong();

    });

});

volume.addEventListener("input", () => {

    const volumeValue = Number(volume.value);

    audio.volume = volume.value;

    if (volumeValue>0) {
        previousVolume=volumeValue;
        
    }
    if (audio.volume === 0) {
        volumeIcon.textContent = "🔇";
    } else if (audio.volume < 0.5) {
        volumeIcon.textContent = "🔉";
    } else {
        volumeIcon.textContent = "🔊";
    }

});

volumeIcon.addEventListener("click", () => {

    if (audio.volume > 0) {

        previousVolume = audio.volume;
        audio.volume = 0;
        volume.value = 0;
        volumeIcon.textContent = "🔇";

    } else {

        audio.volume = previousVolume;
        volume.value = previousVolume;

        if (audio.volume < 0.5) {
            volumeIcon.textContent = "🔉";
        } else {
            volumeIcon.textContent = "🔊";
        }

    }

});

const progressContainer = document.querySelector(".progress");

progressContainer.addEventListener("click", (e) => {
  if (!audio.duration) return;
  const rect = progressContainer.getBoundingClientRect();
  const percent = (e.clientX - rect.left) / rect.width;
  audio.currentTime = percent * audio.duration;
});

let isDragging = false;

progressCircle.addEventListener("pointerdown", (e) => {
    isDragging = true;
    progressCircle.setPointerCapture(e.pointerId);
    progressCircle.classList.add("dragging");
});

progressCircle.addEventListener("pointerup", () => {
    isDragging = false;
    progressCircle.classList.remove("dragging");
});

progressCircle.addEventListener("pointermove", (e) => {

    if (!isDragging || !audio.duration) return;

    const rect = progressContainer.getBoundingClientRect();

    let percent = (e.clientX - rect.left) / rect.width;

    percent = Math.max(0, Math.min(1, percent));

    audio.currentTime = percent * audio.duration;
});

loadSong(0);

audio.addEventListener("ended", () => {

    currentSong++;

    if(currentSong >= songs.length){

        currentSong = 0;

    }

    loadSong(currentSong);

    playSong();

});

const currentTime = document.getElementById("current-time");
const duration = document.getElementById("duration");
audio.addEventListener("loadedmetadata", () => {
    duration.textContent =
        Math.floor(audio.duration / 60) + ":" +
        String(Math.floor(audio.duration % 60)).padStart(2,"0");
});

audio.addEventListener("timeupdate", () => {

    if(audio.duration){

        const progress =
            (audio.currentTime / audio.duration) * 100;

        bar.style.width = progress + "%";

        currentTime.textContent =
            Math.floor(audio.currentTime / 60) + ":" +
            String(Math.floor(audio.currentTime % 60)).padStart(2,"0");

    }

});
document.addEventListener("keydown", (e) => {
  if (e.code === "Space") {
    e.preventDefault();
    audio.paused ? playSong() : pauseSong();
  } else if (e.code === "ArrowRight") {
    nextBtn.click();
  } else if (e.code === "ArrowLeft") {
    prevBtn.click();
  }
});
