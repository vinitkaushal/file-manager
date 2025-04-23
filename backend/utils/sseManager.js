const clients = [];

function addClient(res, req) {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders();
    // res.write('retry: 10000\n\n');
    clients.push(res);
    req.on('close', () => {
        clients.splice(clients.indexOf(res), 1);
    });
}

function sendProgress(data) {
    clients.forEach(client => {
        client.write(`data: ${JSON.stringify(data)}\n\n`);
    });
}

module.exports = {
    addClient,
    sendProgress
};
