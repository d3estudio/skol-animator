window.AudioContext = window.AudioContext || window.webkitAudioContext;

var DEBUG = false;

if (!DEBUG) {
    console.log = function() {

    }
    console.info = function() {

    }
    console.warn = function() {

    }
}
