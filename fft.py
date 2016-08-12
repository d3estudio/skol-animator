import alsaaudio
import numpy
import struct
import time
from socketIO_client import SocketIO
socketIO = SocketIO('192.168.42.10', 3000)

channels = 1
informat = alsaaudio.PCM_FORMAT_S16_LE
rate = 44100
framesize = 1024

recorder = alsaaudio.PCM(alsaaudio.PCM_CAPTURE, alsaaudio.PCM_NORMAL, 'sysdefault:CARD=Device')
recorder.setchannels(channels)
recorder.setrate(rate)
recorder.setformat(informat)
recorder.setperiodsize(framesize)

matrix = []
matrix.append(0)
matrix = matrix * 8

teste = []
teste.append(0)
teste = teste * 8

weighting = [50, 50, 500, 500, 500, 500, 500, 500]
bit_matrix = [[0 for x in xrange(8)] for x in xrange(8)]
power = []

def piff(val):
    return int(2*framesize*val/rate)

def calculate_levels(data):
    global matrix
    data = struct.unpack("%dh"%(len(data)/2), data)
    data = numpy.array(data, dtype='h')
    fourier = numpy.fft.rfft(data)
    fourier = numpy.delete(fourier,len(fourier)-1)
    power = numpy.abs(fourier)
    matrix[0] = int(numpy.mean(power[piff(0)	:piff(100):1]))
    matrix[1] = int(numpy.mean(power[piff(100)	:piff(200):1]))
    matrix[2] = int(numpy.mean(power[piff(200)	:piff(300):1]))
    matrix[3] = int(numpy.mean(power[piff(300)	:piff(400):1]))
    matrix[4] = int(numpy.mean(power[piff(400)	:piff(500):1]))
    matrix[5] = int(numpy.mean(power[piff(500)	:piff(750):1]))
    matrix[6] = int(numpy.mean(power[piff(750)	:piff(1000):1]))
    matrix[7] = int(numpy.mean(power[piff(1000) :piff(2000):1]))
    matrix = numpy.divide(numpy.multiply(matrix,weighting),10000)
    #matrix = matrix.clip(0, 8)
    print matrix
    if matrix[5] > 99:
        print "%s                                                                      BEAT" % matrix[5]
        return 1
    return 0

def process():
    l, data = recorder.read()
    while data != '':
        a = calculate_levels(data)
        #print a
        socketIO.emit('fftArray', a)
        l, data = recorder.read()
process()
