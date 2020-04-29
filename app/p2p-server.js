const Websocket = require('ws');

const P2P_PORT = process.env.P2P_PORT || 5001;
const peers = process.env.PEERS ? process.env.PEERS.split(','): [];

const MESSAGE_TYPES = { 
    chain: 'CHAIN',
    transaction: 'TRANSACTION',
    clear_transactions: 'CLEAR_TRANSACTIONS'
};

class P2pServer {
    constructor(blockchain, tranasctionPool){
        this.blockchain = blockchain;
        this.tranasctionPool = tranasctionPool;
        this.sockets = [];
    }

    listen(){
        const server = new Websocket.Server({ port: P2P_PORT });
        server.on('connection', socket => this.connectSocket(socket));

        this.connectToPeers();

        console.log(`Listenning for peer-to-peer conection on: ${P2P_PORT}`);
    }

    connectSocket(socket){
        this.sockets.push(socket);
        console.log('Socket connected');

        this.messageHandler(socket);

        this.sendChain(socket);
    
    }

    connectToPeers(){
        peers.forEach(peer => {
            // ws://localhost:5001 - peer exemple
            const socket = new Websocket(peer);
            socket.on('open', () => this.connectSocket(socket));
        })
    }

    messageHandler(socket){
        socket.on('message', message => {
            const data = JSON.parse(message);
            switch(data.type){
                case MESSAGE_TYPES.chain:
                    this.blockchain.replaceChain(data.chain);
                break;
                case MESSAGE_TYPES.transaction:
                    this.tranasctionPool.updateOrAddTransaction(data.tranasction);
                break;
                case MESSAGE_TYPES.clear_transactions:
                    this.tranasctionPool.clear();
                break;
            }            
        });
    }

    sendChain(socket){
        socket.send(JSON.stringify({
            type: MESSAGE_TYPES.chain,
            chain: this.blockchain.chain
        }));
    }

    syncChains() {
        this.sockets.forEach(socket => {
            this.sendChain(socket);
        });
    }

    sendTransaction(socket, transaction){
        socket.send(JSON.stringify({
            type: MESSAGE_TYPES.transaction,
            tranasction: transaction
        }));
    }

    broadcastTransaction(transaction){
        this.sockets.forEach(socket => {
            this.sendTransaction(socket, transaction);
        });
    }

    broadcastClearTransaction(){
        this.sockets.forEach(socket => socket.send(JSON.stringify({
            type: MESSAGE_TYPES.clear_transactions
        })));
    }
}

module.exports = P2pServer;

