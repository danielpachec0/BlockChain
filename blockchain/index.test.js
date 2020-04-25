const BlockChain = require('./index')
const Block = require('./block')


describe('BlockChain', () => {
    let bc, bc2;

    beforeEach(() => {
        bc = new BlockChain();
        bc2 = new BlockChain();
    });

    it("Starts with the genesis block", () => {
        expect(bc.chain[0]).toEqual(Block.genesis())
    })

    it("Adds a new block", () => {
        const data = 'data';
        bc.addBlock(data)
        
        expect(bc.chain[bc.chain.length-1].data).toEqual(data)
    })

    it('validates a valid chain', () => {
	    bc2.addBlock('foo');
	    expect(BlockChain.isValidChain(bc2.chain)).toBe(true);
    });

    it('invalidates a chain with a corrupt genesis block', () => {
	    bc2.chain[0].data = 'Bad data';
        expect(BlockChain.isValidChain(bc2.chain)).toBe(false);
    });

    it('invalidates a corrupt chain', () => {
        bc2.addBlock('foo');
        bc2.chain[1].data = 'Not foo';
        expect(BlockChain.isValidChain(bc2.chain)).toBe(false);
    });

    it('replaces the Chain with a valid Chain', () => {
        bc2.addBlock('data');
        bc.replaceChain(bc2.chain);
        expect(bc.chain).toEqual(bc2.chain);
    });

    it('does not replace the chain with one of less than o r equal length', () => {
        bc.addBlock("data");
        bc.addBlock("data");
        bc2.addBlock('data');
        bc.replaceChain(bc2.chain);

        expect(bc.chain).not.toEqual(bc2.chain);
    });
});