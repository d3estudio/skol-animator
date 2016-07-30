import alsaaudio
import numpy
import struct
import wave
import serial
import time
from random import randint
from socketIO_client import SocketIO
socketIO = SocketIO('127.0.0.1', 3000)

channels = 1
informat = alsaaudio.PCM_FORMAT_S16_LE
rate = 44100
framesize = 1024

matrix = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]

weighting = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]

def receive_lidar(*args):
    weighting = [args[0], args[0], args[0], args[0], args[0], args[0], args[0], args[0], args[0], args[0], args[0], args[0], args[0]]
socketIO.on('lidar', receive_lidar)

socketIO.wait()

bit_matrix = [[0 for x in xrange(13)] for x in xrange(13)]

power = []

card = 'sysdefault:CARD=Device'

recorder = alsaaudio.PCM(alsaaudio.PCM_CAPTURE, alsaaudio.PCM_NORMAL, card)
recorder.setchannels(channels)
recorder.setrate(rate)
recorder.setformat(informat)
recorder.setperiodsize(framesize)

def piff(val):
    return int(2 * framesize * val / rate)

def calculate_levels(data, framesize, rate):
    global matrix
    data = struct.unpack("%dh" % (len(data) / 2), data)
    data = numpy.array(data, dtype='h')
    fourier = numpy.fft.rfft(data)
    fourier = numpy.delete(fourier, len(fourier) - 1)
    power = numpy.abs(fourier)
    matrix[0] = int(numpy.mean(power[piff(0):piff(250):1]))
    matrix[1] = int(numpy.mean(power[piff(250):piff(500):1]))
    matrix[2] = int(numpy.mean(power[piff(500):piff(750):1]))
    matrix[3] = int(numpy.mean(power[piff(750):piff(1000):1]))
    matrix[4] = int(numpy.mean(power[piff(1000):piff(1250):1]))
    matrix[5] = int(numpy.mean(power[piff(1250):piff(1500):1]))
    matrix[6] = int(numpy.mean(power[piff(1500):piff(1750):1]))
    matrix[7] = int(numpy.mean(power[piff(1750):piff(2000):1]))
    matrix[8] = int(numpy.mean(power[piff(2000):piff(2250):1]))
    matrix[9] = int(numpy.mean(power[piff(2250):piff(2500):1]))
    matrix[10] = int(numpy.mean(power[piff(2500):piff(2750):1]))
    matrix[11] = int(numpy.mean(power[piff(2750):piff(3000):1]))
    matrix[12] = int(numpy.mean(power[piff(3000):piff(3250):1]))
    #we have to test this division with real data
    matrix = numpy.divide(numpy.multiply(matrix, weighting), 100000)
    return [x for x in matrix]

l, data = recorder.read()
while data != '':
    matrix = calculate_levels(data, framesize, rate)
    socketIO.emit('fftArray', matrix)
    time.sleep(0.3)
    l, data = recorder.read()
