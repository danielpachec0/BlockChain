const ChainUtil = require('../chain-util');

const { DIFFICULTY, MINE_RATE } = require('../config');

class Block {
    constructor(timeStamp, lastHash, hash, data, nonce, difficulty){
        this.timeStamp = timeStamp;
        this.lastHash = lastHash;
        this.hash = hash;
        this.data = data;
        this.nonce = nonce;
        this.difficulty = difficulty || DIFFICULTY;
    }

    toString(){
        return `Block -
                TimeStamp : ${this.timeStamp}
                Last Hash : ${this.lastHash}
                Hash      : ${this.hash}
                Nonce     : ${this.nonce}
                Difficulty: ${this.difficulty}
                Data      : ${this.data}`
    }

    static genesis(){
        return new this('geneis', '---', 'f1r57-h45h', [], 0, DIFFICULTY);
    }

    static mineBlock(lastBlock, data){
        let hash, timeStamp;
        const lastHash = lastBlock.hash;
        let { difficulty } = lastBlock;
        let nonce = 0;
        do{
            nonce = nonce +1;
            timeStamp = Date.now();
            difficulty = Block.adjustDif(lastBlock, timeStamp);
            hash = Block.hash(timeStamp, lastHash, data, nonce, difficulty);
        }while(hash.substr(0, difficulty) !== '0'.repeat(difficulty));

        return new this(timeStamp, lastHash, hash, data, nonce, difficulty);
    }

    static hash(timeStamp,lastHash, data, nonce, difficulty){
        return `${ChainUtil.hash(`${timeStamp}${lastHash}${data}${nonce}${difficulty}`.toString())}`;
    }

    static blockHash(block){
        const { timeStamp, lastHash, data, nonce, difficulty} = block;
        return Block.hash(timeStamp, lastHash, data, nonce, difficulty);
    }

    static adjustDif(lastBlock, currentTime){
        let { difficulty } = lastBlock;
        difficulty = lastBlock.timeStamp + MINE_RATE > currentTime ? difficulty+1 : difficulty-1;
        return difficulty;
    }
    
}

module.exports = Block;