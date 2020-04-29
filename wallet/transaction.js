const ChainUtil = require('../chain-util');
const { MINING_REWARD } = require('../config');

class Transaction{
    constructor(){
        this.id = ChainUtil.id();
        this.input = null;
        this.outputs = [];
    }

    update(senderWallet, recipient, amount){
        const senderOutput = this.outputs.find(output => output.address === senderWallet.publicKey);
        if(amount > senderOutput.amount){
            console.log('amount is exeding the sender balance');
            return;
        }

        senderOutput.amount = senderOutput.amount - amount;
        this.outputs.push({ amount, address: recipient });
        Transaction.signTransaction(this, senderWallet);
        return this;
    };

    static transactionWithOutputs(senderWallet, outputs){
        const transaction = new this();
        transaction.outputs.push(...outputs);
        Transaction.signTransaction(transaction, senderWallet);
        return transaction;
    }

    static newTransaction(senderWallet, recipient, amount){
        if(amount > senderWallet.balance){
            console.log('amount is exeding the sender balance');
            return;
        }
        
        return Transaction.transactionWithOutputs(senderWallet, [
            { amount: senderWallet.balance - amount, address: senderWallet.publicKey},
            { amount, address: recipient}
        ]);

    }

    static rewardTransaction(minerWallet, blockChainWallet){
        return Transaction.transactionWithOutputs(blockChainWallet, [{
            amount: MINING_REWARD,
            address: minerWallet.publicKey
        }]);
    }

    static signTransaction(transaction, senderWallet){
        transaction.input = {
            timeStamp: Date.now(),
            amount: senderWallet.balance,
            address: senderWallet.publicKey,
            signature: senderWallet.sign(ChainUtil.hash(transaction.outputs))
        }
    }

    static verifyTransaction(transaction){
        return ChainUtil.verfySignature(
            transaction.input.address,
            transaction.input.signature,
            ChainUtil.hash(transaction.outputs)
        );
    }
}

module.exports = Transaction;
