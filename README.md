# Spotify Manager

Control spotify via a discord bot! What could go wrong? Allow anyone to queue songs, manage playback statusm and more
all from a discord bot. This application uses [Discord.js v14](https://www.npmjs.com/package/discord.js) and the
[Spotify Web API](https://developer.spotify.com/documentation/web-api/).

## Table of Contents

- [Requirements](#requirements)
- [Creating a Spotify Developer App](#creating-a-spotify-developer-app)
  - [Getting Client Id](#getting-client-id)
- [Creating a Discord Bot](#creating-a-discord-bot)
- [Installation](#installation)
  - [Git](#git)
  - [Node.js](#nodejs)
  - [pnpm](#pnpm)
- [Setup](#setup)

## Requirements

- [Git](https://git-scm.com/)
- [Node.js](https://nodejs.org/en/) v20.16.0 or higher (Built/Test on Node v20.17.0)
- [pnpm](https://pnpm.io/installation) v9.9.0 or higher (Built/Test on pnpm v9.10.0)
- [Spotify Premium Account](https://www.spotify.com/us/premium/)
- [Discord Bot](https://discord.com/developers/applications)

## Creating a Spotify Developer App

1. Go to the [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
2. Click on `Create an App`
3. Fill out the form with the following information:
   - App Name: `Spotify Manager`
   - App Description:
     `Control spotify via a discord bot! What could go wrong? Allow anyone to queue songs, manage playback statusm and more all from a discord bot.`
   - Redirect URIs: `http://localhost:18173/auth/callback`
   - Which API/SDKs are you planning to use?: `Web API`
4. Click on `Save`

From here, you will be able to see your `Client ID`. You will need these to run the application.

### Getting Client Id

1. Go to the [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
2. Click on `Spotify Manager`
3. Click on `Settings`
4. Copy the `Client ID` and save them into a safe place. These will be used later on in the setup process.

## Creating a Discord Bot

1. Go to the [Discord Developer Portal](https://discord.com/developers/applications)
2. Select new application and give it a name.
3. Go to the `Bot` tab and click on `Reset Token`
4. Save the token in a safe place. You will need this later on in the setup process.

## Installation

### Git

1. Download the installer from [Git Website](https://git-scm.com/).
2. Run the installer and leave all the default settings.

### Node.js

1. Download the installer from [Node.js Website](https://nodejs.org/en/).
2. Run the installer and leave all the default settings.

### pnpm

1. Open a terminal
2. Run the following command:

```bash
npm install -g pnpm
```

## Setup

1. Clone the repository

```bash
git clone https://github.com/kathund/Spotify-Manager.git
```

2. Change directory to the project

```bash
cd Spotify-Manager
```

3. Install the dependencies

```bash
pnpm install
```

4. Setup the configuration by running the following command:

```bash
pnpm setup-config
```
This is where you will input the `Client ID` and `Discord Bot Token` that you saved earlier.

:warning: Note if you dont use the default emojis for the bot you will need go to the Discord Application's portal and add emojis with the same names as the emojis in the emoji folder.

5. Start the application

```bash
pnpm start
```
