<script setup>
import { ref, computed, onMounted } from 'vue';
import { useWebSocket } from './composables/useWebSocket';
import TickerTable from './components/TickerTable.vue';
import PriceChart from './components/PriceChart.vue';

const {
    connect,
    disconnect,
    status,
    tickers,
    priceHistory } = useWebSocket();

    const actiteSymbol = ref('BTCUSDT');

    // история выбранной пары для графика
    const activeHistory = computed(()=> priceHistory[actiteSymbol.value] || [])

    // при старте приложения подключаемся
    onMounted(connect)
</script>

<template>
    <header>
        <a href="#">Crypto App</a>
        <div class="status">
            {{ status }}
            <button @click="status === 'connected' ? disconnect() : connect()">{{  status === 'connected' ? 'Disconnect' : 'Connect' }}</button>
        </div>
    </header>
    <main>
        <aside>
            <TickerTable
            :tickers="tickers"
            :active-symbol="actiteSymbol"
            @select="(s) => actiteSymbol = s" />
        </aside>
        <section>
            <PriceChart :symbol="actiteSymbol" :history="activeHistory"/>
        </section>
    </main>

</template>

<style scoped>
    main {
        display: flex;
    }
    header {
        display: flex;
        padding: 24px;
        justify-content: space-between;
    }
</style>
