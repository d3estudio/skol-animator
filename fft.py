import alsaaudio
import numpy
import struct
import time
from socketIO_client import SocketIO
socketIO = SocketIO('192.168.0.110', 3000)

channels = 1
informat = alsaaudio.PCM_FORMAT_S16_LE
rate = 44100
framesize = 1024

recorder = alsaaudio.PCM(alsaaudio.PCM_CAPTURE, alsaaudio.PCM_NORMAL, 'sysdefault:CARD=Device')
recorder.setchannels(channels)
recorder.setrate(rate)
recorder.setformat(informat)
recorder.setperiodsize(framesize)

low_freq_avg_list = []
prev_beat  = time.clock()

def calculate_levels(data):
    data = struct.unpack("%dh" % (len(data) / 2), data)
    data = numpy.array(data, dtype='h')
    fourier = numpy.fft.rfft(data)
    matrix = 0

    y_avg = numpy.mean(fourier)

    low_freq = [fourier[i] for i in range(len(fourier)) if fourier[i] < 1000]
    low_freq_avg = numpy.mean(low_freq)

    global low_freq_avg_list
    low_freq_avg_list.append(low_freq_avg)
    cumulative_avg = numpy.mean(low_freq_avg_list)

    bass = low_freq[:int(len(low_freq)/2)]
    bass_avg = numpy.mean(bass)

    if (y_avg > 10 and (bass_avg > cumulative_avg * 1.5 or (low_freq_avg < y_avg * 1.2 and bass_avg > cumulative_avg))):
        global prev_beat
        curr_time = time.clock()
        if curr_time - prev_beat > 60/180: # 180 BPM max
            prev_beat = curr_time
            matrix = 1

    if len(low_freq_avg_list) > 50:
        low_freq_avg_list = low_freq_avg_list[25:]

    return matrix

def process():
    l, data = recorder.read()
    while data != '':
        a = calculate_levels(data)
        print a
        socketIO.emit('fftArray', a)
        l, data = recorder.read()
process()
