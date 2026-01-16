import { onUnmounted, reactive, ref } from "vue";

const WS_URL = import.meta.env.VITE_WS_SERVER || 'ws://localhost:8080';
const MAX_HISTORY = 60;

export function useWebSocket() {
    const status = ref('disconnected');
    const tickers= reactive({});
    const priceHistory = reactive({});

    let ws = null;
    let reconnectTimeout = null;
    let manualClose = false; // для ручного закрытия

    function connect() {
        if(ws && ws.readyState <= 1) return; // уже подключены
        manualClose = false;

        status.value = 'connecting';
        ws = new WebSocket(WS_URL);
        ws.onopen = () => {
            status.value = 'connected';
            clearTimeout(reconnectTimeout);
            reconnectTimeout = null;
        };

        ws.onmessage = (e) => {
            try {
                const msg = JSON.parse(e.data);
                // сервер присылает массив данных
                if (msg.type === 'ticker' || msg.type === 'snapshot') {
                    for(const t of msg.data) {
                        // сохраняем текущую котировку
                        tickers[t.symbol] = t;
                        // добавляем точку в историю графика
                        if (!priceHistory[t.symbol]){
                            priceHistory[t.symbol] = [];
                        }
                        priceHistory[t.symbol].push({
                            ts: t.ts,
                            price: t.price
                        });

                        if(priceHistory[t.symbol].length > MAX_HISTORY) {
                            priceHistory[t.symbol].shift();
                        }
                    }
                }
            } catch(error) {
                console.error(error);
            }
        };

        ws.onclose = () => {
            status.value = 'disconnected';
            ws = null;

            if(!manualClose) {
                reconnectTimeout = setTimeout(connect, 1000);
            }
        }
    }

    function disconnect() {
        manualClose= true;
        clearTimeout(reconnectTimeout);
        reconnectTimeout = null;
        ws.close();
        ws = null;
        status.value = 'disconnected';
    }

    // если компонент использующий композабл исчезнет (размонтируется) то нужно отключить соединение
    onUnmounted(disconnect);
    return {
        connect,
        disconnect,
        status,
        tickers,
        priceHistory
    }
}