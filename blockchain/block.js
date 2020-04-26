CryptoJS = require('crypto-js');
const SHA256 = require('crypto-js/sha256');

const { DIFFICULTY } = require('../config');

class Block {
    constructor(timeStamp, lastHash, hash, data, nonce){
        this.timeStamp = timeStamp;
        this.lastHash = lastHash;
        this.hash = hash;
        this.data = data;
        this.nonce = nonce;
    }

    toString(){
        return `Block -
                Timestamp: ${this.timeStamp}
                Last Hash: ${this.lastHash}
                Hash     : ${this.hash}
                Nonce    : ${this.nonce}
                Data     : ${this.data}`
    }

    static genesis(){
        return new this('geneis', '---', 'f1r57-h45h', [], 0);
    }

    static mineBlock(lastBlock, data){
        let hash, timeStamp;
        const lastHash = lastBlock.hash;
        let nonce = 0;
        do{
            nonce = nonce +1;
            timeStamp = Date.now();
            hash = Block.hash(timeStamp, lastHash, data, nonce);
        }while(hash.substr(0, DIFFICULTY) !== '0'.repeat(DIFFICULTY));

        return new this(timeStamp, lastHash, hash, data, nonce);
    }

    static hash(timeStamp,lastHash, data, nonce){
        return `${SHA256(`${timeStamp}${lastHash}${data}${nonce}`.toString())}`;
    }

    static blockHash(block){
        const { timeStamp, lastHash, data, nonce} = block;
        return Block.hash(timeStamp, lastHash, data, nonce);
    }
    
}

module.exports = Block;