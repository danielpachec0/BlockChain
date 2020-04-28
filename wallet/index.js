const ChainUtil = require('../chain-util');
const { INITIAL_BALANCE} = require('../config');

class Wallet{
    constructor(){
        this.balance = INITIAL_BALANCE;
        this.keypair = ChainUtil.genKeyPair();
        this.publicKey = this.keypair.getPublic().encode('hex');
    };

    toString(){
        return `Wallet - 
            Public Key: ${this.publicKey.toString()}
            Blance: ${this.balance}
        `
    };
}

module.exports = Wallet;