var RealTimeAudio = function(size, type) {
    var _this = this;
    _this.audioContext = new AudioContext();
    _this.audioInput = null;
    _this.realAudioInput = null;
    _this.inputPoint = null;
    _this.analyserNode = null;
    _this.freqByteData = null;
    _this.zeroGain = null;
    _this.running = false;
    _this.bpm = 0;
    _this.size = size;
    _this.getSample = function(data) {
        //callback for externao data parsing
    }
    _this.updateAnalysers = function(time) {
        if (_this.running) {
            _this.freqByteData = new Uint8Array(_this.analyserNode.frequencyBinCount);
            _this.analyserNode.getByteFrequencyData(_this.freqByteData);
            var data = [];
            var multiplier = _this.analyserNode.frequencyBinCount / _this.size;
            for (var i = 0; i < _this.size; ++i) {
                var offset = Math.floor(i * multiplier);
                var magnitude = _this.freqByteData[offset];
                data.push(magnitude);
            }
            //set the current BPM
            var max = _this.arrayMax(data);
            var min = _this.arrayMin(data);
            var threshold = min + (max - min) * 0.98;
            var peaks = _this.getPeaksAtThreshold(data, threshold);
            var intervalCounts = _this.countIntervalsBetweenNearbyPeaks(peaks);
            var tempoCounts = _this.groupNeighborsByTempo(intervalCounts);
            tempoCounts.sort(function(a, b) {
                return b.count - a.count;
            });
            if (tempoCounts.length) {
                _this.bpm = tempoCounts[0].tempo;
            }
            _this.getSample(data);
        }
        window.requestAnimationFrame(_this.updateAnalysers);
    }
    _this.gotStream = function(stream) {
        _this.inputPoint = _this.audioContext.createGain();
        _this.realAudioInput = _this.audioContext.createMediaStreamSource(stream);
        _this.audioInput = _this.realAudioInput;
        _this.audioInput.connect(_this.inputPoint);
        _this.analyserNode = _this.audioContext.createAnalyser();
        _this.analyserNode.fftSize = 2048;
        _this.inputPoint.connect(_this.analyserNode);
        _this.zeroGain = _this.audioContext.createGain();
        _this.zeroGain.gain.value = 0.0;
        _this.inputPoint.connect(_this.zeroGain);
        _this.zeroGain.connect(_this.audioContext.destination);
        _this.updateAnalysers();
    }
    _this.getPeaksAtThreshold = function(data, threshold) {
        var peaksArray = [];
        var length = data.length;
        for (var i = 0; i < length; i++) {
            if (data[i] > threshold) {
                peaksArray.push(i);
            }
        }
        return peaksArray;
    }
    _this.countIntervalsBetweenNearbyPeaks = function(peaks) {
        var intervalCounts = [];
        peaks.forEach(function(peak, index) {
            for (var i = 0; i < 10; i++) {
                var interval = peaks[index + i] - peak;
                var foundInterval = intervalCounts.some(function(intervalCount) {
                    if (intervalCount.interval === interval) return intervalCount.count++;
                });
                //Additional checks to avoid infinite loops in later processing
                if (!isNaN(interval) && interval !== 0 && !foundInterval) {
                    intervalCounts.push({
                        interval: interval,
                        count: 1
                    });
                }
            }
        });
        return intervalCounts;
    }
    _this.groupNeighborsByTempo = function(intervalCounts) {
        var tempoCounts = [];
        intervalCounts.forEach(function(intervalCount) {
            //Convert an interval to tempo
            var theoreticalTempo = 60 / (intervalCount.interval / 44100);
            theoreticalTempo = Math.round(theoreticalTempo);
            if (theoreticalTempo === 0) {
                return;
            }
            // Adjust the tempo to fit within the 90-180 BPM range
            while (theoreticalTempo < 90) theoreticalTempo *= 2;
            while (theoreticalTempo > 180) theoreticalTempo /= 2;

            var foundTempo = tempoCounts.some(function(tempoCount) {
                if (tempoCount.tempo === theoreticalTempo) return tempoCount.count += intervalCount.count;
            });
            if (!foundTempo) {
                tempoCounts.push({
                    tempo: theoreticalTempo,
                    count: intervalCount.count
                });
            }
        });
        return tempoCounts;
    }
    _this.arrayMin = function(arr) {
        var len = arr.length,
            min = Infinity;
        while (len--) {
            if (arr[len] < min) {
                min = arr[len];
            }
        }
        return min;
    }
    _this.arrayMax = function(arr) {
        var len = arr.length,
            max = -Infinity;
        while (len--) {
            if (arr[len] > max) {
                max = arr[len];
            }
        }
        return max;
    }
    _this.init = function() {
        if (!navigator.getUserMedia) {
            navigator.getUserMedia = navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
        } else if (!navigator.cancelAnimationFrame) {
            navigator.cancelAnimationFrame = navigator.webkitCancelAnimationFrame || navigator.mozCancelAnimationFrame;
        } else if (!navigator.requestAnimationFrame) {
            navigator.requestAnimationFrame = navigator.webkitRequestAnimationFrame || navigator.mozRequestAnimationFrame;
        }
        _this.running = true;
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
        }, _this.gotStream, function(e) {
            console.debug(e);
        });
    }
    _this.continue = function() {
        _this.running = true;
    }
    _this.pause = function() {
        _this.running = false;
    }
}
