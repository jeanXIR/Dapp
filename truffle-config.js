const path = require("path");

const HDWalletProvider = require('@truffle/hdwallet-provider');
require('dotenv').config();

module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration!
  contracts_build_directory: path.join(__dirname, "client/src/contracts"),
  networks: {
    development: {
     host: "127.0.0.1",     // Localhost (default: none)
     port: 8545,            // Standard Ethereum port (default: none)
     network_id: "*",       // Any network (default: none)
    },

    ropsten: {
      // provider: function() {return new HDWalletProvider({mnemonic:{phrase:'${process.env.MNEMONIC'}'}, providerOrUrl:'https://ropsten.infura.io/v3/$)}
      // provider: function() {return new HDWalletProvider('${process.env.MNEMONIC}','URLRPC/${process.env.INFURA_ID}')
         provider: function() {return new HDWalletProvider({mnemonic:{phrase:`${process.env.MNEMONIC}`}, providerOrUrl: `https://ropsten.infura.io/v3/${process.env.INFURA_ID}`})},
         network_id:3,
    },

    kovan: {
      // provider: function() {return new HDWalletProvider({mnemonic:{phrase:'${process.env.MNEMONIC'}'}, providerOrUrl:'https://ropsten.infura.io/v3/$)}
      // provider: function() {return new HDWalletProvider('${process.env.MNEMONIC}','URLRPC/${process.env.INFURA_ID}')
         provider: function() {return new HDWalletProvider({mnemonic:{phrase:`${process.env.MNEMONIC}`}, providerOrUrl: `https://kovan.infura.io/v3/${process.env.INFURA_ID}`})},
         network_id:42,
    },

  },

  mocha: {

  },

  // Configure your compilers
  compilers: {
    solc: {
      version: "0.8.13",    // Fetch exact version from solc-bin (default: truffle's version)
    }
  },
};
