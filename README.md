# 🚀 **STRA1G-TV**

> That's a project to simulate the a live streaming platform
&emsp; 

## Setup enviroment variables
### Get the .env.example and create the .env file inserting your values to empty keys
&emsp; 

## Run this project locally
### You can test this project using docker-compose
```
docker-compose up -d
```

## Accessing APIs
### In the project's root, you can find a json file to use on insomnia software to test the available apis
&emsp; 

## Using OBS
### With OBS open, go to settings -> transmission and set in the server field the following:
```
rtmp://localhost/live
```

### In the stream key insert first your username that you created in platform
```
YOUR_USERNAME?key=YOUR_STREAM_KEY
```

### Get your stream key by accessing this following API:
```
GET - channels/:id/stream_key
```
### After this just click on start streaming and it is going to start to your server
&emsp;

## Watching the stream
### To watch your stream you can go to your browser and type following url 
```
http://localhost:8000/live/YOUR_USERNAME.flv
```
### it will download a flv file while your stream is active

### OR

### You can use a software like VLC and open media by network setting the following url
```
rtmp://localhost:1935/live/YOUR_USERNAME
```