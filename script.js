const trackTitle = document.getElementById('track-title');
const playPauseBtn = document.getElementById('play-pause');
const progressBar = document.getElementById('progress');
const currentTimeDisplay = document.getElementById('current-time');
const durationDisplay = document.getElementById('duration');
const volumeControl = document.getElementById('volume');
const resultsList = document.getElementById('results');
const accountMenu = document.getElementById('account-menu');

const API_KEY = 'AIzaSyDnA3TwKXNDlx-HqEgbMYwnBVuhNFfJX1Y';
const tracks = [];
let currentTrackIndex = 0;
let player;

function loadTrack(index) {
    const track = tracks[index];
    player.loadVideoById(track.src);
    trackTitle.textContent = track.title;
}

function playPause() {
    const playerState = player.getPlayerState();
    if (playerState === 1) { // 1 means playing
        player.pauseVideo();
        playPauseBtn.textContent = '▶️';
    } else {
        player.playVideo();
        playPauseBtn.textContent = '⏸️';
    }
}

function nextTrack() {
    currentTrackIndex = (currentTrackIndex + 1) % tracks.length;
    loadTrack(currentTrackIndex);
    player.playVideo();
}

function prevTrack() {
    currentTrackIndex = (currentTrackIndex - 1 + tracks.length) % tracks.length;
    loadTrack(currentTrackIndex);
    player.playVideo();
}

function updateProgress() {
    const currentTime = player.getCurrentTime();
    const duration = player.getDuration();
    const progressPercent = (currentTime / duration) * 100;
    progressBar.value = progressPercent;

    currentTimeDisplay.textContent = formatTime(currentTime);
    durationDisplay.textContent = formatTime(duration);
}

function seekTrack(value) {
    const seekTime = (value / 100) * player.getDuration();
    player.seekTo(seekTime);
}

function setVolume(value) {
    player.setVolume(value);
}

function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
}

function searchSongs(event) {
    if (event.key === 'Enter') {
        const query = event.target.value;
        fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&q=${encodeURIComponent(query)}&key=${API_KEY}`)
            .then(response => response.json())
            .then(data => {
                resultsList.innerHTML = '';
                tracks.length = 0; // Clear current tracks
                data.items.forEach(item => {
                    const track = {
                        title: item.snippet.title,
                        src: item.id.videoId
                    };
                    tracks.push(track);
                    const listItem = document.createElement('li');
                    listItem.textContent = track.title;
                    listItem.onclick = () => {
                        currentTrackIndex = tracks.indexOf(track);
                        loadTrack(currentTrackIndex);
                        player.playVideo();
                    };
                    resultsList.appendChild(listItem);
                });
            })
            .catch(error => console.error('Error fetching data:', error));
    }
}

// YouTube Iframe API ready event
function onYouTubeIframeAPIReady() {
    player = new YT.Player('player', {
        height: '0',
        width: '0',
        events: {
            'onReady': onPlayerReady,
            'onStateChange': onPlayerStateChange,
            'onError': onPlayerError
        }
    });
}

function onPlayerReady(event) {
    loadTrack(currentTrackIndex);
}

function onPlayerStateChange(event) {
    if (event.data === YT.PlayerState.PLAYING) {
        playPauseBtn.textContent = '⏸️';
    } else {
        playPauseBtn.textContent = '▶️';
    }
}

function onPlayerError(event) {
    alert('An error occurred while playing the video. This video may be restricted or unavailable.');
}

// Update progress bar as the video plays
setInterval(updateProgress, 1000);

function toggleAccountMenu() {
    accountMenu.style.display = accountMenu.style.display === 'block' ? 'none' : 'block';
}

function openLoginModal() {
    document.getElementById('login-modal').style.display = 'flex';
}

function openCreateAccountModal() {
    document.getElementById('create-account-modal').style.display = 'flex';
}

function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
}

function login(event) {
    event.preventDefault();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    // Here you would typically send a request to your server to log the user in
    alert(`Logged in with email: ${email}`);
    closeModal('login-modal');
}

function createAccount(event) {
    event.preventDefault();
    const email = document.getElementById('create-email').value;
    const password = document.getElementById('create-password').value;
    // Here you would typically send a request to your server to create the account
    alert(`Account created for email: ${email}`);
    closeModal('create-account-modal');
}
