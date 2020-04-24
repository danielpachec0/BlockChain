const SHA256 = require('crypto-js/sha256')

class Block {
    constructor(timeStamp, lastHash, hash, data){
        this.timeStamp = timeStamp;
        this.lastHash = lastHash;
        this.hash = hash;
        this.data = data;
    }

    toString(){
        return `Block -
                Timestamp: ${this.timeStamp}
                Last Hash: ${this.lastHash}
                Hash     : ${this.hash}
                Data     : ${this.data}`
    }

    static genesis(){
        return new this('geneis', '---', 'f1r57-h45h', []);
    }

    static mineBlock(lastBlock, data){
        const timeStamp = Date.now();
        const lastHash = lastBlock.hash;
        const hash = Block.hash(timeStamp, lastBlock, data);

        return new this(timeStamp, lastHash, hash, data);
    }

    static hash(timeStamp,lasthash, data){
        return SHA256(`${timeStamp}${lasthash}${data}`.toString());
    }
}

module.exports = Block;