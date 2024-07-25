document.addEventListener("DOMContentLoaded", () => {
    const initSpeedometrChart = async () => {
        const speedometrElement = document.querySelector("[data-speedometr-chart]");
        if (!speedometrElement) return;

        const chartSettings = {
            data: {
                currentPostion: 25,
                speedometrBarsColors: ["#ff6384", "#ff9f40", "#ffcd56", "#91e891", "#4bc04b"],
                speedometrBarsWidth: [20, 20, 20, 20, 20],
                barLabels: ["Label 1", "Label 2", "Label 3", "Label 4", "Label 5"],
                mainLabel: "Speedometr",
            },
            chart: {
                type: "doughnut",
                aspectRatio: 1.4,
                hoverOffset: 4,
                circumference: 180,
                rotation: 270,
                circleRadius: 30,
                needleWidth: 15,
                labelsFontSize: 20,
                needleColor: "#000",
                circleColor: "#000",
                styles: {
                    padding: {
                        left: 20,
                        right: 20,
                        bottom: 0,
                        top: 0,
                    },
                }
            }
        }

        const draw = (chart) => {
            const PI = Math.PI;
            const ctx = chart.ctx;
            const width = chart.width;
            const height = chart.height;
            const centerX = width / 2;
            const centerY = height / 1.2;

            const needleAngle = ((chartSettings.data.currentPostion) / 100) * PI - PI;
            const needleLength = height * 0.6;
            const needleX = centerX + Math.cos(needleAngle) * needleLength;
            const needleY = centerY + Math.sin(needleAngle) * needleLength;

            // Draw central circle
            ctx.save();
            ctx.beginPath();
            ctx.arc(centerX, centerY, chartSettings.chart.circleRadius, 0, 2 * PI);
            ctx.fillStyle = chartSettings.chart.circleColor;
            ctx.fill();
            ctx.restore();

            // Draw the needle
            ctx.save();
            ctx.beginPath();
            ctx.moveTo(centerX, centerY);
            ctx.lineTo(needleX, needleY);
            ctx.lineWidth = chartSettings.chart.needleWidth;
            ctx.strokeStyle = chartSettings.chart.needleColor;
            ctx.stroke();
            ctx.restore();
        }

        const chartCtx = speedometrElement.getContext("2d");
        new Chart(chartCtx, {
            type: chartSettings.chart.type,
            data: {
                datasets: [{
                    label: chartSettings.data.mainLabel,
                    data: chartSettings.data.speedometrBarsWidth,
                    backgroundColor: chartSettings.data.speedometrBarsColors,
                    hoverOffset: chartSettings.chart.hoverOffset,
                    circumference: chartSettings.chart.circumference,
                    rotation: chartSettings.chart.rotation
                }],
            },
            options: {
                responsive: true,
                layout: chartSettings.chart.styles,
                aspectRatio: chartSettings.chart.aspectRatio,
                plugins: {
                    legend: {
                        display: false,
                    },
                    tooltip: {
                        callbacks: {
                            label: (context) => {
                                const labels = chartSettings.data.barLabels || [];
                                return labels[context.dataIndex] || '';
                            }
                        },
                        bodyFont: {
                            size: chartSettings.chart.labelsFontSize,
                        },
                        titleFont: {
                            size: chartSettings.chart.labelsFontSize,
                        },
                    }
                },
            },
            plugins: [{
                id: "centralCircle",
                afterDatasetsDraw: (chart) => draw(chart),
            }],
        });
    };
    initSpeedometrChart();
});
