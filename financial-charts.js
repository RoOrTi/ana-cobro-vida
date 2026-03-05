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

    static renderVariationChart(canvasId, labels, data) {
        const ctx = document.getElementById(canvasId).getContext('2d');

        return new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    data: data,
                    backgroundColor: data.map(v => v >= 0 ? 'rgba(74, 222, 128, 0.6)' : 'rgba(239, 68, 68, 0.6)'),
                    borderColor: data.map(v => v >= 0 ? '#4ade80' : '#ef4444'),
                    borderWidth: 1,
                    borderRadius: 4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        callbacks: {
                            label: (context) => ` Variación: ${context.parsed.y > 0 ? '+' : ''}${context.parsed.y}%`
                        }
                    }
                },
                scales: {
                    x: {
                        grid: { display: false },
                        ticks: { color: '#e8e8f0', font: { size: 10, weight: 'bold' } }
                    },
                    y: {
                        grid: { color: 'rgba(255,255,255,0.05)', drawBorder: false },
                        ticks: {
                            color: '#7070a0',
                            font: { size: 10 },
                            callback: (value) => `${value}%`
                        }
                    }
                },
                animation: {
                    duration: 2000,
                    easing: 'easeOutQuart'
                }
            }
        });
    }

    static createChartContainer(id) {
        const div = document.createElement('div');
        div.className = 'chart-message-wrap';

        const canvas = document.createElement('canvas');
        canvas.id = id;
        div.appendChild(canvas);

        return div;
    }
}
