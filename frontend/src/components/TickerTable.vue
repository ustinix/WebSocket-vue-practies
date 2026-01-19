<template>
    <div>
        <table class="table">
            <thead>
                <tr>
                    <th>Пара</th>
                    <th>Цена</th>
                    <th>Изменение за 24ч</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="symbol in symbols" :key="symbol" @click="emit('select', symbol)" :class="{'is-active': symbol === activeSymbol}">
                    <td>{{ symbol }}</td>
                    <td>{{ props.tickers[symbol].price }}</td>
                    <td :class="props.tickers[symbol].change24h >= 0 ? 'green' : 'red'">{{ props.tickers[symbol].change24h >= 0 ? '+' : '' }} {{ props.tickers[symbol].change24h }}%</td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
    tickers: Object,
    activeSymbol: String // выбранная пара
});

const emit = defineEmits(['select']);

const symbols = computed(() => {
    return Object.keys(props.tickers).sort()
});

</script>

<style scoped>
.is-active {
  text-decoration: underline;
}
.green {
    color: green;
}
.red {
    color: red;
}
</style>