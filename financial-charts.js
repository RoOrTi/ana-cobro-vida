/**
 * financial-charts.js - Charting extension for Ana
 * Uses Chart.js to render market trends
 */

class FinancialCharts {
    static renderPriceChart(canvasId, label, data, color = '#c9a96e') {
        const ctx = document.getElementById(canvasId).getContext('2d');

        // Create gradient
        const gradient = ctx.createLinearGradient(0, 0, 0, 200);
        gradient.addColorStop(0, `${color}44`);
        gradient.addColorStop(1, `${color}00`);

        return new Chart(ctx, {
            type: 'line',
            data: {
                labels: data.map((_, i) => i),
                datasets: [{
                    label: label,
                    data: data,
                    borderColor: color,
                    backgroundColor: gradient,
                    borderWidth: 2,
                    fill: true,
                    tension: 0.4,
                    pointRadius: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false }
                },
                scales: {
                    x: { display: false },
                    y: {
                        grid: { color: 'rgba(255,255,255,0.05)' },
                        ticks: { color: '#7070a0', font: { size: 10 } }
                    }
                }
            }
        });
    }

    static createChartContainer(id) {
        const div = document.createElement('div');
        div.className = 'chart-message-wrap';
        div.style.cssText = 'width: 100%; height: 180px; margin-top: 10px; background: rgba(0,0,0,0.2); border-radius: 12px; padding: 10px;';

        const canvas = document.createElement('canvas');
        canvas.id = id;
        div.appendChild(canvas);

        return div;
    }
}
