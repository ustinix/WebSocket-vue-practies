import { WebSocketServer } from "ws";

const PORT = 8080;
const TICK_INTERVAL = 1000; // интервал отправки данных
const OPEN = 1; // состояние соединения

const PAIRS = {
    BTCUSDT: {price: 97000, base: 97000, volatility: 0.002},
    ETHUSDT: {price: 3000, base: 3000, volatility: 0.003},
    SoLUSDT: {price: 100, base: 100, volatility: 0.005},
}

// протокол сообщений Сервер-клиент
// 1 snapshot (один раз при подключении)
// { type: 'snapshot', data: [{ symbol, price, change24h, ts}, ...]}
// 2 ticker (каждый тик)
// { type: 'ticker', data: [{symbol, price, change24h, ts}, ...]}

// генерируем новый тик
function makeTIck() {
    const ts = Date.now();
}

const wss = new WebSocketServer({ port: PORT});

// когда подключается новый клиент

wss.on('connection', (ws) => {
    console.log('Подключение успешное');
    ws.send(JSON.stringify({ type: 'snapshot', data: getSnapshot()}));
    ws.on('close', () => console.log('Клиент отключен'));
})

// каждый тик

setInterval(() => {
    const tick = makeTIck();
    wss.clients.forEach((client) => {
        if(client.readyState === OPEN) {
            client.send(JSON.stringify({ type: 'ticker', data: tick}))
        }
    })
}, TICK_INTERVAL)