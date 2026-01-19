<template>
    <div>
        <h2 class="chart">Грфик {{ symbol }}</h2>
        <VueApexCharts type="area" height="350" :options="options" :series="series" />

    </div>
</template>

<script setup>
    import VueApexCharts from 'vue3-apexcharts';
    import { computed } from 'vue';

    const props = defineProps({
        symbol: String,
        history: {type: Array, default: ()=>[]}
    })

    // превращаем историю в формат для графика
const series = computed(() => [
    {
        name: 'Цена',
        data: props.history.map(item => [item.ts, item.price])
    }
])

// настройки графика
const options = {
    chart: {
        type: 'area',
        toolbar: {
            show: false
        },
        animations: {
            enabled: false
        }
    },
    stroke: {
        curve: 'smooth',
        width: 2
    },
    color: ['#234567'],
    tooltip: {
         x: {
            format: 'HH:mm'
        }
    },
    xaxis: {
        type: 'datetime',
        labels: {
            format: 'HH:mm'
        }
    },
    yaxis: {
        labels: {
            style: {
                colors: '#234567'
            },
            formatter: function(value) {
                return value.toFixed(2);
            }
        }
    },
    grid: {
        borderColor: '#e0e0e0',
        strokeDashArray: 4
    }
}
</script>

<style scoped>
.chart-title {
    margin-bottom: 20px;
    color: #234567;
}
.chart {
    width: 800px;
}
</style>