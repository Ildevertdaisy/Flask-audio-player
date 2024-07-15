
console.log("**************** Audio player scripts ****************");


// Data structure definition 


class Node {
    constructor(audio) {
        this.audio = audio;
        this.next = null;
    }
}


class LinkedList {

    constructor(){
        this.head = null;
        this.tail = null;
    }

    add(audio) {
      const newNode = new Node(audio);
      if (!this.head) {
        this.head = newNode;
        this.tail = newNode;
      } else {
        this.tail.next = newNode;
        this.tail = newNode;
      }
    }

    getFirst() {
        return this.head;
    }

}





// Logic for fetching data and controlling audio player 

const audioPlayer = document.getElementById("player");
const nextButton = document.getElementById("next");


const playlist = new LinkedList();


// SSE connection
const events = new EventSource("/stream");


fetch('/audios/filenames')
.then(response => response.json())
.then(data => {
    let audios = data["audios"];
    console.log(audios);

    audios.forEach(audio => playlist.add(audio));

    // Select the first song inside the playlist
    let currentAudio = playlist.getFirst();

    audioPlayer.src = `/audios/${currentAudio.audio}`;

    nextButton.addEventListener("click", () => {
        if (currentAudio.next) {
            currentAudio = currentAudio.next;
            audioPlayer.src = `/audios/${currentAudio.audio}`;
        } else {
            currentAudio = playlist.getFirst();
            audioPlayer.src = currentAudio.audio;
        }
    });
    


})
.catch(error => console.log(error));


function updatePlaylist(audio){
    playlist.add(audio);
}


// custom events listeners

events.addEventListener("open", () => {
    console.log('La connexion est ouverte');
});


events.addEventListener("error", (event) => {
    console.log(event);
});


events.addEventListener("new_audio", (event) => {
    
  let eventData = JSON.parse(event.data);
  let newAudio = eventData["file"];

  // Update the current playlist
  updatePlaylist(newAudio);

  Toastify({
    text: `Une nouvelle chanson nommée ${newAudio} vient d'être rajoutée à la playlist`,
    duration: 3000,
    newWindow: true,
    close: true,
    gravity: "top", // `top` or `bottom`
    position: "right", // `left`, `center` or `right`
    stopOnFocus: true, // Prevents dismissing of toast on hover
    style: {
      background: "linear-gradient(to right, #00b09b, #96c93d)",
    },
    onClick: function () {}, // Callback after click
  }).showToast();


});

