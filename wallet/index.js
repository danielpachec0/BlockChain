const ChainUtil = require('../chain-util');
const Transaction = require('./transaction');
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

    sign(dataHash){
        return this.keypair.sign(dataHash);
    }

    createTransaction(recipient, amount, blockchain, transactionPool){
        this.balance = this.calculateBalance(blockchain);
        if(amount > this.balance){
            console.log('Amount exceds the current balance');
            return;
        }
        let transaction = transactionPool.existingTransaction(this.publicKey);

        if(transaction){
            transaction.update(this, recipient, amount);
        }else{
            
            transaction = Transaction.newTransaction(this, recipient, amount);
            transactionPool.updateOrAddTransaction(transaction);
        }

        return transaction;
    }

    calculateBalance(blockchain){
        let balance = this.balance;
        let transactions = [];
        blockchain.chain.forEach(block => block.data.forEach(transaction => {
            transactions.push(transaction);
        }));

        const walletInputTransactions = transactions.filter(transaction => transaction.input.address === this.publicKey);
        
        let startTime = 0;
        
        if(walletInputTransactions.length > 0){
            const recentInputTransaction = walletInputTransactions.reduce(
                (prev, current) => prev.input.timeStamp > current.input.timeStamp ? prev : current 
            );
            balance = recentInputTransaction.outputs.find(output => output.address === this.publicKey).amount; 
            startTime = recentInputTransaction.input.timeStamp;
        }

        transactions.forEach(transaction => {
            if(transaction.input.timeStamp > startTime){
                transaction.outputs.find(output => {
                    if(output.address === this.publicKey){
                        balance = balance + output.amount;
                    }
                })
            }
        });

        return balance;
    }

    static blockChainWallet(){
        const blockChainWallet = new this();
        blockChainWallet.address = 'blockchain-wallet';
        return blockChainWallet;
    }
}

module.exports = Wallet;