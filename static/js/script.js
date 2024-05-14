
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


fetch('/audios/filenames')
.then(response => response.json())
.then(data => {
    let audios = data["audios"];
    console.log(audios);

    audios.forEach(audio => playlist.add(audio));

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