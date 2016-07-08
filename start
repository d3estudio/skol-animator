sudo supervisorctl start ppv4
echo 'Started PatchPanel'
sudo supervisorctl start animation
echo 'Started Animation Mapper'
sudo forever start -o ./logs/app.js.log -e ./logs/app.js.err.log app.js
echo 'Started Simulator and Websocket'
sudo forever start -o ./logs/Processor.js.log -e ./logs/Processor.js.err.log processor.js
echo 'Started Animation Processor'
sudo forever start -o ./logs/fft.py.log -e ./logs/fft.py.err.log -c python fft.py
echo 'Started Sound Processor'
