# CryptoRide

The goal of this project is to create a decentralized marketplace where users can buy and sell their cars. Each car has its digital identity on the blockchain which cannot be modified. This should create trust between seller and buyer even if they do not know each other.

## Getting Started

### Prerequisites

1.  [MongoDB](https://docs.mongodb.com/manual/administration/install-community/)
2.  [NodeJS + NPM](https://nodejs.org/en/download/package-manager/)
3.  Truffle

```
npm install -g truffle@4.1.11
```

### Installation

Install required dependencies

```
npm install
```

Install & Start MongoDB (macOS)

```
brew install mongodb
sudo mongod
```

Run development build

```
npm start
```

Run production build

```
npm run bs
```

Run local blockchain

```
cd ethereum
truffle develop
```

Deploy smart contracts on local blockchain

```
cd ethereum
truffle migrate
```

Run application in browser

```
npm run dev
```

## Running the tests

Run tests

```
npm test
```

Test smart contracts

```
cd ethereum
truffle test
```

## Deployment

TODO: Deployment on mainnet

## Built With

* [Truffle](http://truffleframework.com/)
* [Solidity](https://solidity.readthedocs.io/en/v0.4.23/)
* [OpenZeppelin](https://openzeppelin.org/)
* [NodeJS](https://nodejs.org/en/)
* [ExpressJS](http://expressjs.com/de/)
* [ReactJS](https://reactjs.org)
* [Webpack](https://webpack.js.org)
* [MongoDB](https://www.mongodb.com)

### Boilerplate

* [mern-starter](https://github.com/Hashnode/mern-starter)

## Learning Resources

* [React Intro](https://reactjs.org/tutorial/tutorial.html)
* [Redux (actions, reducers, store)](https://redux.js.org)

## Project Structure (Abstract)

```
├── client
│   ├── modules (groups of related components)
│   │   ├── App
│   │   ├── Car (cards, detail, ...)
│   │   └── Offer (page, detail, ...)
│   ├── util
│   ├── App.js (root component)
│   ├── index.js (injects root component into page)
│   ├── main.css
│   ├── reducers.js (root reducer)
│   ├── routes.js
│   └── store.js (state of app)
|
├── ethereum
|
├── dist (producton build for deployment)
|
├── Intl (text for client)
|
├── server
│   ├── controllers (communication with blockchain)
│   │   ├── trade.controller.js
│   │   └── car.controller.js
│   ├── models
│   │   ├── car.js
│   │   └── offer.js
│   ├── routes
│   │   ├── trade.routes.js (buy, sell, ...)
│   │   ├── car.routes.js (find, details, ...)
│   ├── util
│   ├── config.js
│   └── server.js (setup, db connection, startup, ...)
|
├── node_modules
├── README.md
├── package.json
└── .gitignore
```

## Troubleshooting
No changes after migration
* `truffle migrate --reset` to run all migrations from beginning

Contract migration failed
* remove `/build` folder and perform migration again

### Error messages
	Error: the tx doesn't have the correct nonce. account has nonce of: 4 tx has nonce of: 16
Solution: [Reset account](https://stackoverflow.com/questions/45585735/testrpc-ganache-the-tx-doesnt-have-the-correct-nonce)

## Authors

* **Hai Dang**
