# Installation

brew install nginx
brew install rabbitmq
brew install zookeeper
brew install redis
brew services start redis
brew install mongo
brew services start mongodb

npm install
npm run gen-nginx-conf
npm run main

# Zookeeper

To have launchd start zookeeper now and restart at login:
  brew services start zookeeper
Or, if you don't want/need a background service you can just run:
  zkServer start

# rabbitmq
You can also reset the queue:

sudo service rabbitmq-server start
sudo rabbitmqctl stop_app
sudo rabbitmqctl reset
sudo rabbitmqctl start_app

#redis
brew install redis
brew services start redis
#mongodb
brew install mongo

To have launchd start mongodb now and restart at login:

brew services start mongodb
  
Or, if you don't want/need a background service you can just run:
  mongod --config /usr/local/etc/mongod.conf
