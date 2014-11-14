USER=`stat -c %u package.json`
sudo -u "#$USER" /bin/bash
