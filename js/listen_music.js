// Define audio element and variables
let currentTrackIndex = 0;
let isPlaying = false;
let isRepeating = false;
let trackList = [];
let audio = new Audio();

// On DOMContentLoaded, fetch the audio tracks and show the loader
window.addEventListener("DOMContentLoaded", async (event) => {
    document.getElementById('loader').style.display = 'block'; // Show loader
    await fetchTracks(); // Fetch tracks and wait for completion
    loadTrack(currentTrackIndex); // Load the first track
    document.getElementById('loader').style.display = 'none'; // Hide loader

    // Event For Closing The Alert
    let alertButton = document.getElementById('alert-button')
    alertButton.addEventListener('click', event => {
        MyNamespace.closeAlert(event);
    });
});


// Fetch audio tracks from FastAPI
async function fetchTracks() {
    let requestOptions = {
        method: 'GET'
    };
    let url = 'https://music-player-backend-for-music-player-ui-ux.vercel.app/tracks/';
    try {
        const response = await fetch(url, requestOptions);
        if (response.status === 503) {
            errorResponse = await response.json();
            MyNamespace.alertInfoFunction(errorResponse.details);
            return;
        } else if (response.status === 500) {
            MyNamespace.alertInfoFunction(errorResponse.details);
            return;
        }
        trackList = await response.json();
        console.log(trackList);

        // Update track info in UI
        document.getElementById('total-tracks').textContent = trackList.length;
    } catch (error) {
        console.error('Error fetching tracks:', error);
    }
}

// Load track based on index
function loadTrack(index) {
    const track = trackList[index];
    audio.src = track.url;
    document.getElementById('track-name').textContent = track.track_name;
    document.getElementById('track-artist').textContent = track.author_name || 'Unknown Artist';
    document.getElementById('current-track-index').textContent = index + 1;

    // Wait until metadata is loaded to get the duration
    audio.addEventListener('loadedmetadata', () => {
        const totalDuration = formatTime(audio.duration);
        document.querySelector('.total-duration').textContent = totalDuration;

        // Set the seek slider max to the audio duration
        document.getElementById('seek_slider').max = Math.floor(audio.duration);
    });

    audio.load();
}

// Format time helper function (mm:ss format)
function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const sec = Math.floor(seconds % 60);
    return `${minutes}:${sec < 10 ? '0' : ''}${sec}`;
}

// Play or pause track
function playpauseTrack() {
    if (isPlaying) {
        audio.pause();
        isPlaying = false;
        document.querySelector('#playpause-track i').classList.replace('fa-pause-circle', 'fa-play-circle');
    } else {
        audio.play();
        isPlaying = true;
        document.querySelector('#playpause-track i').classList.replace('fa-play-circle', 'fa-pause-circle');
    }

    // Update seek slider as the track plays
    audio.addEventListener('timeupdate', () => {
        const currentTime = formatTime(audio.currentTime);
        document.querySelector('.current-time').textContent = currentTime;

        // Update seek slider value
        document.getElementById('seek_slider').value = Math.floor(audio.currentTime);
    });
}

// Play next track
function nextTrack() {
    currentTrackIndex = (currentTrackIndex + 1) % trackList.length;
    loadTrack(currentTrackIndex);
    playpauseTrack();
}

// Play previous track
function prevTrack() {
    currentTrackIndex = (currentTrackIndex - 1 + trackList.length) % trackList.length;
    loadTrack(currentTrackIndex);
    playpauseTrack();
}

// Repeat current track
function repeatTrack() {
    isRepeating = !isRepeating;
    audio.loop = isRepeating;
}

// Play random track
function randomTrack() {
    currentTrackIndex = Math.floor(Math.random() * trackList.length);
    loadTrack(currentTrackIndex);
    playpauseTrack();
}

// Set volume
function setVolume() {
    const volume = document.getElementById('volume_slider').value;
    audio.volume = volume / 100;
}

// Seek to a specific point in the track
function seekTo() {
    const seekPosition = document.getElementById('seek_slider').value;
    audio.currentTime = (seekPosition / 100) * audio.duration;
}
