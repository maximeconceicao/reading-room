# Reading Room 📚

<p align="center">
  This repository contains the <strong>Reading Room</strong> source code.
  Reading Room is a tiny voice-controlled note-taking react app that uses Alpha Cephei's <a href="https://github.com/alphacep/vosk-server"></a><strong>Vosk Server</strong> for offline speech-to-text functionnality.
</p>

## What is Reading Room ?

Reading Room is a WebSocket client intended to be used with the open-source Vosk Server from Alpha Cephei.
The main idea of this project is to allow taking notes while reading a book, without having to even put it down to write them.
After starting a "reading session" by clicking on the microphone button, the app will listen to the incoming audio stream, and thanks to a set of preconfigured commands we will be able to tell it what type of note we want to take (title, excerpt, quote...), and the app will take care of listening and directly transcribing the content into a new text block. At the end of the session, we can adjust our notes, reorganize them, and finally export them in markdown format by clicking on the copy button.

## Getting Started

### Dependencies

- This project is designed to work with the [Vosk Server](https://github.com/alphacep/vosk-server).
  You can install and start the server using

```

docker run -d -p 2700:2700 alphacep/kaldi-fr:latest
```

Here, **kaldi-fr** refers to the French language recognition model, but other languages ​​are available on [Docker Hub](https://hub.docker.com/u/alphacep)

### Installing

- Install the dependencies

```

npm install

```

### Executing Program

- Run the app

```

npm run dev

```

## Usage

If you ever want to bring some customization, here are the main constants of the file **transcription.ts** :

| Name              | Default value                     | Description                                                                                                                                                                                                 |
| ----------------- | --------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| SERVER_URL        | ws://localhost:2700               | The url of the WebSocket server which transcribes                                                                                                                                                           |
| INPUT_SAMPLE_RATE | 48000                             | The sampling frequency of your audio input, may need to be modified if you encounter transcription problems                                                                                                 |
| BlockType         | titre, sous-titre, citation, note | The different styles of blocks that can be added                                                                                                                                                            |
| CommandKeyword    | titre, sous-titre, citation, note | Commands that trigger the writing of a block. Its values ​​are the same as BlockType, but it is entirely possible to implement other commands to, for example, delete the last block, copy the content, etc |

## Credits

This project uses the following open source tools:

- [React](https://react.dev/)
- [Vite](https://vitejs.dev/)
- [MUI](https://mui.com/)
- [react-beautiful-dnd](https://github.com/atlassian/react-beautiful-dnd)
- [Iconify](https://iconify.design/)
