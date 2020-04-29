const Transaction = require('../wallet/transaction');
const Wallet = require('../wallet');

class Miner{
    constructor(blockchain, transactionpool, wallet, p2pServer){
        this.blockchain = blockchain;
        this.transactionpool = transactionpool;
        this.wallet = wallet;
        this.p2pServer = p2pServer;
    }

    mine(){
        const validTransactions = this.transactionpool.validTransactions();
        //include a reward for the miner
        validTransactions.push(
            Transaction.rewardTransaction(this.wallet, Wallet.blockChainWallet())
        );
        //create block consisting of a valid transaction
        const block = this.blockchain.addBlock(validTransactions);
        //sync chains in p2p
        this.p2pServer.syncChains();
        //clear the pool of the miner
        this.transactionpool.clear();
        //and broadcast
        this.p2pServer.broadcastClearTransaction();

        return block;
    }
}

module.exports = Miner;