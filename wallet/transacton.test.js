const Transaction = require('./transaction');
const Wallet = require('./index');

describe('Transaction', () => {
    let transaction, wallet, recipient, amount;

    beforeEach(() => {
        wallet = new Wallet;
        amount = 50;
        recipient = 'recipient';
        transaction = Transaction.newTransaction(wallet, recipient, amount);
    });

    it('output the `amount` subtracted from the wallet balance', () => {
        expect(
            transaction.outputs.find(output => output.address === wallet.publicKey).amount).toEqual(wallet.balance - amount);
    });

    it('output the `amount` added to the recipient', () => {
        expect(transaction.outputs.find(output => output.address === recipient).amount).toEqual(amount);
    });

    it('inputs the balance of the wallet', () => {
        expect(transaction.input.amount).toEqual(wallet.balance);
    });

    it('validates a valid transaction', () => {
        expect(Transaction.verifyTransaction(transaction)).toBe(true);
    });

    it('invalidates a invalid transaction', () => {
        transaction.outputs[0].amount = 5000000;
        expect(Transaction.verifyTransaction(transaction)).toBe(false);
    });

    describe('Transacting with a amount that exceeds the balance', () => {

        beforeEach(() => {
            amount = 5011312313;
            transaction = Transaction.newTransaction(wallet, recipient, amount);
        });

        it('does not create a transaction as a result', () => {
            expect(transaction).toEqual(undefined);
        });
    
    });


    describe('and updating the transaction', () => {
        let nextAmount, nextRecipient;


        beforeEach(() => {
            nextAmount = 50;
            nextRecipient = 'nextRecipient';
            transaction.update(wallet, nextRecipient, nextAmount);
        });

        it('subtracts the next amount from the sender', () => {
            expect(transaction.outputs.find(output => output.address === wallet.publicKey).amount)
            .toEqual(wallet.balance - amount - nextAmount);
        });

        it('subtracts the next amount from the sender', () => {
            expect(transaction.outputs.find(output => output.address === nextRecipient).amount)
            .toEqual(nextAmount);
        });
    
    });
});

