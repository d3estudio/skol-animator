# import alsaaudio
# import numpy
# import struct
# import wave
# import serial
# import time

from socketIO_client import SocketIO, LoggingNamespace

with SocketIO('localhost', 3000, LoggingNamespace) as socketIO:
    socketIO.emit('ackHealth', { "healthy": True })
    socketIO.wait()

# serdev = '/dev/ttyACM0'
# s = serial.Serial(serdev, baudrate=921600)
#
# channels = 1
# informat = alsaaudio.PCM_FORMAT_S16_LE
# rate = 44100
# framesize = 1024
#
# matrix = []
# matrix.append(0)
# #matrix = matrix * 42
# matrix = matrix * 8
#
# teste = []
# teste.append(0)
# teste = teste * 8
#
# weighting = [50, 50, 500, 500, 500, 500, 500, 500]
# #weighting = []
# # weighting.append(100)
# #weighting = weighting * 42
#
# bit_matrix = [[0 for x in xrange(8)] for x in xrange(8)]
#
# power = []
#
# #mic = 'sysdefault:CARD=Device'
# #mic = 'dmix:CARD=SB,DEV=0'
# #wavfile = wave.open('/home/pi/test.wav','r')
#
# #recorder = alsaaudio.PCM(type=alsaaudio.PCM_CAPTURE, mode=alsaaudio.PCM_NORMAL, card=mic)
# recorder = alsaaudio.PCM(type=alsaaudio.PCM_CAPTURE, mode=alsaaudio.PCM_NORMAL)
# recorder.setchannels(channels)
# recorder.setrate(rate)
# recorder.setformat(informat)
# recorder.setperiodsize(framesize)
#
#
# def piff(val):
#     return int(2 * framesize * val / rate)
#
#
# def calculate_levels(data, framesize, rate):
#     global matrix
#     data = struct.unpack("%dh" % (len(data) / 2), data)
#     data = numpy.array(data, dtype='h')
#     fourier = numpy.fft.rfft(data)
#     fourier = numpy.delete(fourier, len(fourier) - 1)
#     power = numpy.abs(fourier)
#     matrix[0] = int(numpy.mean(power[piff(0)	:piff(100):1]))
#     matrix[1] = int(numpy.mean(power[piff(100)	:piff(200):1]))
#     matrix[2] = int(numpy.mean(power[piff(200)	:piff(300):1]))
#     matrix[3] = int(numpy.mean(power[piff(300)	:piff(400):1]))
#     matrix[4] = int(numpy.mean(power[piff(400)	:piff(500):1]))
#     matrix[5] = int(numpy.mean(power[piff(500)	:piff(750):1]))
#     matrix[6] = int(numpy.mean(power[piff(750)	:piff(1000):1]))
#     matrix[7] = int(numpy.mean(power[piff(1000):piff(2000):1]))
#     matrix = numpy.divide(numpy.multiply(matrix, weighting), 1000000)
#     matrix = matrix.clip(0, 8)
#     return matrix
#
# print "Processando.."
# #data = wavfile.readframes(framesize)
# l, data = recorder.read()
#
# print data
# while data != '':
#     matrix = calculate_levels(data, framesize, rate)
#
#     for y in range(0, 8):
#         for x in range(0, 8):
#             if x < matrix[y]:
#                 bit_matrix[y][x] = 1
#                 s.write(chr(255))
#             else:
#                 bit_matrix[y][x] = 0
#                 s.write(chr(0))
#             # time.sleep(0.0020)
#     print matrix
#
#     l, data = recorder.read()
#     #data = wavfile.readframes(framesize)
