sudo supervisorctl stop ppv4
echo 'Stopped Patch PanelPanel'
sudo supervisorctl stop animation
echo 'Stopped Animation Mapper'
sudo forever stop app.js
echo 'Stopped Simulator and Websocket'
sudo forever stop processor.js
echo 'Stopped Animation Processor'
sudo forever stop fft.py
echo 'Stopped Sound Processor'
