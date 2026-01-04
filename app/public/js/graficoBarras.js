let graficaBarras = null;
export function crearGraficaBarras(datosPorMes) {
  const ctx = document.getElementById('graficoBarras').getContext('2d');

  if (graficaBarras instanceof Chart) {
        graficaBarras.destroy();
    }

  const labels = datosPorMes.map(d => d.mes.charAt(0).toUpperCase() + d.mes.slice(1));
  const ingresosData = datosPorMes.map(d => Number(d.ingresos) || 0);
  const gastosData = datosPorMes.map(d => Number(d.gastos) || 0);


  graficaBarras =new Chart(ctx, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [
        {
          label: 'Ingresos',
          data: ingresosData,
          backgroundColor: 'rgba(75, 192, 192, 0.6)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1
        },
        {
          label: 'Gastos',
          data: gastosData,
          backgroundColor: 'rgba(255, 99, 132, 0.6)',
          borderColor: 'rgba(255, 99, 132, 1)',
          borderWidth: 1
        }
      ]
    },
    options: {
      responsive: true,
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            stepSize: 100000,
            callback: value => {
              const num = Number(value);
              return '₡' + (isNaN(num) ? 0 : num).toLocaleString("es-CR");
            }

          }
        }
      },
      plugins: {
        title: {
          display: true,
          text: 'Ingresos vs Gastos por Mes'
        },
        legend: { position: 'bottom' },
        tooltip: {
          callbacks: {
            label: context => {
              const raw = context.raw;
              const val = (raw === undefined || raw === null || isNaN(Number(raw)))
                ? 0
                : Number(raw);

              return `${context.dataset.label}: ₡${val.toLocaleString("es-CR")}`;
            }
          }
        }
      }
    }
  });
}
