import alsaaudio
import numpy
import struct
import wave
import serial
import time
from random import randint
from socketIO_client import SocketIO
socketIO = SocketIO('192.168.0.110', 3000)

channels = 1
informat = alsaaudio.PCM_FORMAT_S16_LE
rate = 44100
framesize = 1024

matrix = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]

weighting = [500, 500, 500, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000]

bit_matrix = [[0 for x in xrange(13)] for x in xrange(13)]

power = []

recorder = alsaaudio.PCM(alsaaudio.PCM_CAPTURE, alsaaudio.PCM_NORMAL, 'sysdefault:CARD=Device')
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
    max_piff = 10140/4 #this is the max piff for a power of length 470, so we do not be out of index

    matrix[0] = int(numpy.mean(power[piff(0):piff((max_piff/13)*1):1]))
    matrix[1] = int(numpy.mean(power[piff((max_piff/13)*1):piff((max_piff/13)*2):1]))
    matrix[2] = int(numpy.mean(power[piff((max_piff/13)*2):piff((max_piff/13)*3):1]))
    matrix[3] = int(numpy.mean(power[piff((max_piff/13)*3):piff((max_piff/13)*4):1]))
    matrix[4] = int(numpy.mean(power[piff((max_piff/13)*4):piff((max_piff/13)*5):1]))
    matrix[5] = int(numpy.mean(power[piff((max_piff/13)*5):piff((max_piff/13)*6):1]))
    matrix[6] = int(numpy.mean(power[piff((max_piff/13)*6):piff((max_piff/13)*7):1]))
    matrix[7] = int(numpy.mean(power[piff((max_piff/13)*7):piff((max_piff/13)*8):1]))
    matrix[8] = int(numpy.mean(power[piff((max_piff/13)*8):piff((max_piff/13)*9):1]))
    matrix[9] = int(numpy.mean(power[piff((max_piff/13)*9):piff((max_piff/13)*10):1]))
    matrix[10] = int(numpy.mean(power[piff((max_piff/13)*10):piff((max_piff/13)*11):1]))
    matrix[11] = int(numpy.mean(power[piff((max_piff/13)*11):piff((max_piff/13)*12):1]))
    matrix[12] = int(numpy.mean(power[piff((max_piff/13)*12):piff((max_piff/13)*13):1]))
    matrix = numpy.divide(numpy.multiply(matrix, weighting), 100000)

    return [x for x in matrix]

def process():
    l, data = recorder.read()
    while data != '':
        try:
            matrix = calculate_levels(data, framesize, rate)
            print matrix
            socketIO.emit('fftArray', matrix)
        except Exception as e:
            raise
        l, data = recorder.read()
process()
