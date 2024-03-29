<p align="center">
  <a href="https://www.typescriptlang.org/" target="blank"><img src="https://upload.wikimedia.org/wikipedia/commons/4/4c/Typescript_logo_2020.svg" width="200" alt="Typescript logo" /></a>
</p>

<p align="center">
  Server-side app providing live streaming video platform implementing RBAC
</p>

<p align="center">
  <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white"/>
  <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" />
  <img src="https://img.shields.io/badge/adonis%20js-220052?style=for-the-badge&logo=adonisjs&logoColor=white" />
  <img src="https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white" />
  <img src="https://img.shields.io/badge/Docker-2CA5E0?style=for-the-badge&logo=docker&logoColor=white" />
</p>

<p align="center">
  <img src="assets/streaming.gif"/>
</p>

## Table of contents

- [Database modeling](#database-modeling)
- [Use Cases](#use-cases)
- [Technologies](#technologies)
- [Setup](#setup)
- [See the magic](#see-the-magic-star)
- [Automated Tests](#automated-tests)

## Database modeling

<p align="center">
  <img src="assets/diagram.png"/>
</p>

## Use Cases

- Users can create an account;
- Users can recover their password;
- Users can see all the other users availables;
- Users can check their own profiles;
- Users can create, edit and check their channels;
- Users can check other online channels;
- Users can start a stream to the server :star: :rocket:

## Technologies

- Typescript
- Node.js
- AdonisJS
- PostgreSQL
- Docker / Docker Compose

# Setup
```
$ cp .env.example .env
$ docker-compose up -d
$ docker exec -it stra1g-tv /bin/sh
$ node ace migration:run
```

###### Obs: env variables available on # Mail section needs to be filled by you if you want to test mail send

###### Obs: All endpoints are available in insomnia_apis.json file in root folder. Use insomnia software to test it

## See the magic :star:
#### Call the following APIS
 - POST - /users | Create your account
 - POST - /sessions | Log in
 - POST - /channels | Create your channel
 - POST - /streamings | Create a new streaming
 - GET - /channels/:id/stream_key | Get your stream_key

#### Using OBS
##### With OBS open, go to settings -> transmission and set in the server field the following:

```
rtmp://localhost/live
```

##### In the stream key insert first your username created in platform

```
YOUR_USERNAME?key=YOUR_STREAM_KEY
```
###### Obs: copy your stream key by the last HTTP request called

##### After this just click on start streaming and it is going to start!
#### Watching the stream
##### To watch your stream you can go to your browser and type following url

```
http://localhost:8000/live/YOUR_USERNAME.flv
```

###### It will download a .flv file while your stream is active

##### OR

##### You can use a software like VLC and open media by network inserting the following url

```
rtmp://localhost:1935/live/YOUR_USERNAME
```

## Automated Tests

```bash
$ npm install
$ npm run test
or
$ yarn
$ yarn test
```

## License

[MIT licensed](LICENSE).
