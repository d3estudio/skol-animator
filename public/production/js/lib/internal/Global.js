window.AudioContext = window.AudioContext || window.webkitAudioContext;

var DEBUG = true;

if (!DEBUG) {
    console.log = function() {

    }
    console.info = function() {

    }
    console.warn = function() {

    }
}
