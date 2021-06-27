# Hardhat Boilerplate with Nextjs, Redux Saga, Chakra UI

A simple token which we can tranfser.

You can use this simple project as the starting point for your Ethereum projects. It provides an overview of a full stack Ethereum dapp.

This repository using [Hardhat Boilerplate](https://github.com/nomiclabs/hardhat-hackathon-boilerplate) and replace its frontend with Nextjs, Redux Saga, Chakra UI.

## Demo
https://simple-token.vercel.app/

## Quick start

The first thing you need to do is installing Metamask plugin for your browser.

Once installed, run Hardhat's testing network:

```sh
npx hardhat node
```

Then, on a new terminal, go to the repository's root folder and run this to
deploy your contract:

```sh
npx hardhat run scripts/deploy.js --network localhost
```

Finally, we can run the frontend with:

```sh
cd nextjs
npm install
npm start
```

**Happy _buidling_!**

## TODO
- Add eslint, prettier, husky for root level
