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
// change24h - процент от стартовой цены base
// чтобы наглядно видеть рост или падение без внешних API


function getSnapshot() {
    const ts = Date.now();
    return Object.entries(PAIRS).map(([symbol, p]) => {
        return {
            symbol,
            price: p.price.toFixed(2),
            change24h: +((p.price - p.base) / p.base * 100).toFixed(2),
            ts
        }
    });
}

// генерируем новый тик
function makeTIck() {
    const ts = Date.now();
    return Object.entries(PAIRS).map(([symbol, p]) => {
        const delta = (Math.random() - 0.5) * 2 * p.volatility;
        // новая цена
        p.price += p.price * delta;
        return  {
            symbol,
            price: p.price.toFixed(2),
            change24h: +((p.price - p.base) / p.base * 100).toFixed(2),
            ts
        };
    });
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
            client.send(JSON.stringify({ type: 'ticker', data: tick}));
        }
    })
}, TICK_INTERVAL)

console.log(`WS server listening on ${PORT}`);