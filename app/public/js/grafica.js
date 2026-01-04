import Tabla from './tabla.js';


let miGrafica;

// Generar colores aleatorios
function generarColorAleatorio(cantidad) {
  const colores = [];
  for (let i = 0; i < cantidad; i++) {
    const color = '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
    colores.push(color);
  }
  return colores;
}

// Crear la gráfica
export function crearGrafica(etiquetas, valores, ingresos, mes, Balance) {
  const colores = generarColorAleatorio(etiquetas.length);

  if (miGrafica) miGrafica.destroy();

  const ctx = document.getElementById('graficoCircular').getContext('2d');

  miGrafica = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: etiquetas,
      datasets: [{
        data: valores,
        backgroundColor: colores,
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { position: 'bottom' },
        tooltip: {
          callbacks: {
            label: function (context) {
              const total = valores.reduce((a, b) => a + b, 0);
              const porcentaje = ((context.raw / total) * 100).toFixed(1);
              return `${context.label}: ₡${context.raw.toLocaleString("es-CR")} (${porcentaje}%)`;
            }
          }
        },
        centerText: {
          display: true,
          text: `Ingresos ₡${(ingresos ?? 0).toLocaleString("es-CR")}
                \nBalance ₡${(Balance ?? 0).toLocaleString("es-CR")}`,
          color: '#fff',
          fontStyle: 'bold',
          fontSize: 18
        }
      }
    },
    plugins: [{
      id: 'centerText',
      beforeDraw: function (chart) {
        if (chart.config.options.plugins.centerText.display !== true) return;

        const width = chart.width;
        const height = chart.height;
        const ctx = chart.ctx;
        ctx.restore();

        // Dividir el texto en líneas
        const textLines = chart.config.options.plugins.centerText.text.split('\n');

        ctx.font = "bold 18px sans-serif";
        ctx.textBaseline = 'middle';
        ctx.fillStyle = '#000';
        ctx.textAlign = 'center';

        const lineHeight = 22; // espacio entre líneas
        const startY = height / 2 - (lineHeight * (textLines.length - 1)) / 2;

        // Dibujar cada línea
        textLines.forEach((line, i) => {
          ctx.fillText(line, width / 2, startY + (i * lineHeight));
        });

        ctx.save();
      }
    }]
  });
}

// Cargar datos desde API
export async function cargarDatos(mes) {
  const username = localStorage.getItem("username");
  try {
    console.log(localStorage.getItem("username"))
    const res = await fetch(`/api/obtenerDatos?mes=${mes}&username=${username}`);
    const data = await res.json();

    if (!res.ok) {
      Swal.fire({ icon: 'error', title: 'Error', text: data.message || 'Error al obtener los datos.' });
      return;
    }

    if (data.length === 0) {
      Swal.fire({ icon: 'info', title: 'Sin datos', text: `No hay registros para ${mes}` });
      //reiniciar gráfica vacía
      crearGrafica([], [], 0, mes, 0);
      Tabla([], mes);
      return;
    }

    const ingresos = data
      .filter(d => d.tipo === "Ingreso")
      .reduce((sum, d) => sum + d.monto, 0);

    const gastos = data.filter(d => d.tipo === "Gasto");
    const etiquetas = gastos.map(g => g.categoria);
    const valores = gastos.map(g => g.monto);
    const Balance = ingresos - valores.reduce((a, b) => a + b, 0);


    crearGrafica(etiquetas, valores, ingresos, mes, Balance);
    Tabla(data, mes);
  } catch (error) {
    console.error("Error al obtener datos:", error);
    Swal.fire({ icon: 'error', title: 'Error', text: 'No se pudo conectar con el servidor.' });
  }

}
