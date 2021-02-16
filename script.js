//elements du DOM sur lesquels on va interagir
const player = document.getElementById('player');
const playBtn = document.getElementById('play');
const stopBtn = document.getElementById('stop');
const prevBtn = document.getElementById('prev');
const nextBtn = document.getElementById('next');
const volUpBtn = document.getElementById('vol-up');
const volDownBtn = document.getElementById('vol-down');
const loopBtn = document.getElementById('loop');
const audio = document.getElementById('audio');
const title = document.getElementById('title');
const cover = document.getElementById('cover');
const progressContainer = document.getElementById('progress-container');
const progress = document.getElementById('progress');
const volContainer = document.getElementById('vol-container');
const volProgress = document.getElementById('vol-progress');

//Tous les titres présents dans le dossier à lire
const songs = ['Billie Eilish - bellyache', 'Linkin Park - Wasteland', 'Sia - Dressed In Black'];

//Variables
let songIndex = 0;
let isStoppped = true;
let islooping = true;

//Volume
volProgress.style.width = `${audio.volume * 100}%`;
loopBtn.querySelector('i.fas').style.color = '#00FF00';

const currentSong = songs[songIndex];

//Chargement des détails du song
loadSong(currentSong);

//Permet de recuperer les détails du song à jouer
function loadSong(song) {
    title.innerText = song;
    audio.src = `music/${song}.mp3`;
    cover.src = `cover/${song}.jpg`;
}

//Liste des événement du DOM
audio.addEventListener('error', audioError);
audio.addEventListener('timeupdate', updateProgressBar);
audio.addEventListener('ended', playLoop);
playBtn.addEventListener('click', playPause);
stopBtn.addEventListener('click', stopSong);
prevBtn.addEventListener('click', prevSong);
nextBtn.addEventListener('click', nextSong);
volDownBtn.addEventListener('click', reduceSongVol);
volUpBtn.addEventListener('click', increaseSongVol);
progressContainer.addEventListener('click', setProgress);
volContainer.addEventListener('click', updateVol);
loopBtn.addEventListener('click', changeLoopState);

function changeClasses(e, c1, c2) {
    e.classList.remove(c1);
    e.classList.add(c2);
}

//fonction de permettant de jouer un son
function playSong(song) {
    if (isStoppped) {
        loadSong(song);
        cover.alt = song;
    }

    changeClasses(playBtn.querySelector('i.fas'), 'fa-play', 'fa-pause');
    changeClasses(player, 'stop', 'play');
    playBtn.querySelector('i.fas').style.color = '#00FF00';
    document.getElementById('music-container').classList.remove('disable-animation');

    audio.play();
}

//Permet de mettre le son en pause
function pauseSong() {
    if (!audio.paused) {
        player.classList.remove('play');
        changeClasses(playBtn.querySelector('i.fas'), 'fa-pause', 'fa-play');
        playBtn.querySelector('i.fas').style.color = '#fff';
        document.getElementById('music-container').classList.add('disable-animation');

        audio.pause();
        isStoppped = false;
    }
}

//Permte d'arreter un son en cour de lecture
function stopSong() {
    document.getElementById('music-container').classList.add('disable-animation');
    changeClasses(playBtn.querySelector('i.fas'), 'fa-pause', 'fa-play');;
    playBtn.querySelector('i.fas').style.color = '#fff';
    changeClasses(player, 'play', 'stop');
    title.innerText = 'Titre'


    audio.pause();
    audio.currentTime = 0;
    cover.alt = '';
    isStoppped = true;
}

//Permet de lancer ou d'arreter le son en fonction de l'état dans lequel il se trouve
function playPause() {
    const isPlaying = player.classList.contains('play');
    isPlaying ? pauseSong() : playSong(currentSong);
}

//Permte d'aller au son précédent
function prevSong() {
    stopSong();
    songIndex--;
    songIndex < 0 ? songIndex = songs.length - 1 : songIndex;
    loadSong(songs[songIndex]);
    playSong(songs[songIndex]);
}


//Permte d'aller au son suivant
function nextSong() {
    stopSong();
    songIndex++;
    songIndex > songs.length - 1 ? songIndex = 0 : songIndex;
    loadSong(songs[songIndex]);
    playSong(songs[songIndex]);
}

//Met à jour la barre de progression du son
function updateProgressBar(e) {
    const { duration, currentTime } = e.target;
    const progressPercent = (currentTime / duration) * 100;
    progress.style.width = `${progressPercent}%`;
}

//Met à jour la barre de progression en fonction du click de l'utilisateur
function setProgress(e) {
    const width = this.clientWidth;
    const clickX = e.offsetX;

    if (!player.classList.contains('stop')) {
        audio.currentTime = (clickX / width) * audio.duration;
    }
}

//Permet de diminuer le volume
function reduceSongVol() {
    if (audio.volume > .1) {
        audio.volume -= .1;
        volProgress.style.width = `${audio.volume * 100}%`;
    }

    if (audio.volume <= .1) {
        audio.volume = 0.0;
        audio.muted = true;
        volProgress.style.width = `0`;
        changeClasses(volDownBtn.querySelector('i.fas'), 'fa-volume-down', 'fa-volume-mute');
    }

    if (audio.volume <= .5) {
        changeClasses(volUpBtn.querySelector('i.fas'), 'fa-volume-up', 'fa-volume-down');
    }

    console.log(audio.volume);
}


//Permet d'augmenter le volume 
function increaseSongVol() {
    if (audio.volume < .9) {
        audio.muted = false;
        audio.volume += .1;
        volProgress.style.width = `${audio.volume * 100}%`;
        changeClasses(volDownBtn.querySelector('i.fas'), 'fa-volume-mute', 'fa-volume-down');
    }

    if (audio.volume > .5) {
        changeClasses(volUpBtn.querySelector('i.fas'), 'fa-volume-down', 'fa-volume-up');

    }

    if (audio.volume > .9) {
        audio.volume = 1.0;
        volProgress.style.width = `100%`;
    }
}

//Met à jour le volume par click de l'utilisateur
function updateVol(e) {
    const width = this.clientWidth;
    const clickX = e.offsetX;

    audio.volume = (clickX / width);
    volProgress.style.width = `${audio.volume * 100}%`;
}

//Interrupteur pour déclencer ou désactiver la lecture en boucle
function changeLoopState() {
    islooping === true ? islooping = false : islooping = true;

    if (islooping) {
        loopBtn.querySelector('i.fas').style.color = '#00FF00';
    } else {
        loopBtn.querySelector('i.fas').style.color = '#FFF';
    }
}

//Définie la lecture en boucle ou non
function playLoop() {
    if (songIndex >= songs.length - 1 && islooping) {
        nextSong();
    } else {
        stopSong();
    }
}

//Permet de renvoyer une erreur si le son n'a pas été trouvé
function audioError() {
    title.innerText = "Erreur lors du chargement";
}