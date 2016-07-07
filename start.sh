sudo forever start -o ./logs/app.js.log -e ./logs/app.js.err.log app.js
sudo forever start -o ./logs/Processor.js.log -e ./logs/Processor.js.err.log processor.js
sudo forever start -o ./logs/fft.py.log -e ./logs/fft.py.err.log -c python fft.py
