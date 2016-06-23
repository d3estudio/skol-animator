window.AudioContext = window.AudioContext || window.webkitAudioContext;

var audioContext = new AudioContext();
var audioInput = null,
    realAudioInput = null,
    inputPoint = null,
    audioRecorder = null;
var analyserContext = null;

function updateAnalysers(time) {
    var freqByteData = new Uint8Array(analyserNode.frequencyBinCount);
    analyserNode.getByteFrequencyData(freqByteData);
    var multiplier = analyserNode.frequencyBinCount;
    var magnitude = 0;
    for (var j = 0; j < multiplier; j++) {
        magnitude += freqByteData[j];
    }
    magnitude = magnitude / multiplier;
    if (magnitude > 40) {
        var music = new Music('fast_boom', 18, [rightWall, frontWall, leftWall, roof], true, false);
        music.init();
        var steps = 6; // 1 step is 9deg
        setTimeout(updateAnalysers, (roof.motors[0].getFPS() * steps) + 10);
    } else {
        window.requestAnimationFrame(updateAnalysers);
    }
}

function gotStream(stream) {
    inputPoint = audioContext.createGain();
    realAudioInput = audioContext.createMediaStreamSource(stream);
    audioInput = realAudioInput;
    audioInput.connect(inputPoint);
    analyserNode = audioContext.createAnalyser();
    analyserNode.fftSize = 2048;
    inputPoint.connect(analyserNode);
    audioRecorder = new Recorder(inputPoint);
    zeroGain = audioContext.createGain();
    zeroGain.gain.value = 0.0;
    inputPoint.connect(zeroGain);
    zeroGain.connect(audioContext.destination);
    updateAnalysers();
}

function initAudio() {
    if (!navigator.getUserMedia)
        navigator.getUserMedia = navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
    if (!navigator.cancelAnimationFrame)
        navigator.cancelAnimationFrame = navigator.webkitCancelAnimationFrame || navigator.mozCancelAnimationFrame;
    if (!navigator.requestAnimationFrame)
        navigator.requestAnimationFrame = navigator.webkitRequestAnimationFrame || navigator.mozRequestAnimationFrame;

    navigator.getUserMedia({
        "audio": {
            "mandatory": {
                "googEchoCancellation": "false",
                "googAutoGainControl": "false",
                "googNoiseSuppression": "false",
                "googHighpassFilter": "false"
            },
            "optional": []
        },
    }, gotStream, function(e) {
        alert('Error getting audio');
        console.log(e);
    });
}
