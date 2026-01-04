import {  cargarDatos } from './grafica.js';
import { crearGraficaBarras } from './graficoBarras.js';

let datosPorMesGlobal = [];
// FORMULARIO: Guardar datos
document.getElementById("form-1").addEventListener("submit", async (e) => {
    e.preventDefault();

    const loader = document.getElementById("loader");
    const monto = parseFloat(document.getElementById("IngresarMonto").value);
    const tipo = document.getElementById("tipo").value;
    const categoria = document.getElementById("elegirCategoria").value.trim();
    const mes = document.getElementById("mes").value;

    // VALIDACIÓN DE MONTO
    if (isNaN(monto) || monto <= 0) {
        Swal.fire({ icon: 'error', title: 'Error', text: 'El monto debe ser un número mayor a 0.' });
        return;
    }

    // VALIDACIÓN DE CATEGORÍA (solo si es Gasto)
    if (tipo !== "Ingreso") {
        if (categoria.length < 3 || categoria.length > 20) {
            Swal.fire({ icon: 'error', title: 'Error', text: 'La categoría debe tener entre 3 y 20 caracteres.' });
            return;
        }
    }
    const username=localStorage.getItem("username");
    const datos = { monto, categoria, tipo, mes,username };
    if (tipo === "Ingreso") datos.categoria = "";

    try {
        loader.style.display = "inline-block";

        const res = await fetch("/api/ingresarDatos", {
            method: "POST",
            headers: { "Content-type": "application/json" },
            body: JSON.stringify(datos),
        });

        const data = await res.json();

        if (!res.ok) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: data.message || 'Error al guardar los datos.'
            });
            loader.style.display = "none";
            return;
        }

        Swal.fire({
            icon: 'success',
            title: 'Éxito',
            text: 'Datos guardados correctamente.'
        });

        document.getElementById("form-1").reset();
        loader.style.display = "none";

        //  refrescar gráfica del mes activo
        const mesActivo = document.querySelector("#mes-tabs .nav-link.active")?.getAttribute("data-mes") || mes;
        cargarDatos(mesActivo);
        cargarAnual();

        

    } catch (error) {
        Swal.fire({ icon: 'error', title: 'Error', text: 'No se pudo conectar con el servidor.' });
        console.error(error);
        loader.style.display = "none";
    }

    
    
});
//cargas anual
async function cargarAnual() {
        try {
            const username=localStorage.getItem("username");
            
            const res = await fetch('/api/obtenerDatosAnuales?username='+username);
            const datos = await res.json();

            if (!res.ok) {
                Swal.fire({ icon: 'error', title: 'Error', text: datos.message || 'Error al obtener los datos anuales.' });
                return;
            }
            if (datos.length === 0) {
                Swal.fire({ icon: 'info', title: 'Información', text: 'No hay datos disponibles para el gráfico anual.' });
                return;
            }

            //agruar datos por mes
            const meses = ['enero','febrero','marzo','abril','mayo','junio',
               'julio','agosto','septiembre','octubre','noviembre','diciembre'];

            const datosPorMes = meses.map(m => {
                const registrosMes = datos.filter(d => d.mes === m);
                const ingresos = registrosMes.filter(d => d.tipo === "Ingreso")
                    .reduce((sum, d) => sum + Number(d.monto|| 0), 0);
                const gastos = registrosMes.filter(d => d.tipo === "Gasto")
                    .reduce((sum, d) => sum + Number(d.monto|| 0), 0);
                return { mes: m, ingresos, gastos };
            });
            console.log("datosPorMes ", datosPorMes);
            datosPorMesGlobal = datosPorMes;
            crearGraficaBarras(datosPorMesGlobal);

        }catch (error) {
            console.error('Error al cargar datos anuales:', error);
            Swal.fire({ icon: 'error', title: 'Error', text: 'No se pudo cargar los datos anuales.' });
        }
    }

// CARGAR MES POR DEFECTO
document.addEventListener("DOMContentLoaded", () => {
    document.querySelector('[data-mes="enero"]').classList.add("active");
    cargarDatos("enero");
    cargarAnual();
});

// EVENTOS DE LOS TABS
document.querySelectorAll("#mes-tabs .nav-link").forEach(link => {
    link.addEventListener("click", (e) => {
        e.preventDefault();
        const mes = e.target.getAttribute("data-mes");

        // activar visualmente el tab seleccionado
        document.querySelectorAll("#mes-tabs .nav-link").forEach(l => l.classList.remove("active"));
        e.target.classList.add("active");

        // cargar datos y dibujar gráfica
        cargarDatos(mes);
    });
});
//eliminar fila de tabla
document.addEventListener("DOMContentLoaded", () => {
    const tbody = document.querySelector('#tablaDatos tbody');
    if (tbody) {
        tbody.addEventListener('click', async (e) => {
            if (e.target && e.target.classList.contains('btn-danger')) {
                const fila = e.target.closest('tr');

                try {
                    const id = fila.getAttribute('data-id');
                    console.log("body ", tbody)
                    const username=localStorage.getItem("username");
                    const res = await fetch('/api/eliminarDato', {
                        method: 'DELETE',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ id, username })
                    });

                    const data = await res.json();

                    if (res.ok) {
                        Swal.fire({ icon: 'success', title: 'Éxito', text: 'Dato eliminado correctamente.' });
                        fila.remove();
                        //refrescar pagina
                        const mesActivo = document.querySelector("#mes-tabs .nav-link.active")?.getAttribute("data-mes");
                        cargarDatos(mesActivo);

                    } else {
                        Swal.fire({ icon: 'error', title: 'Error', text: data.message || 'Error al eliminar el dato.' });
                    }

                } catch (error) {
                    console.error('Error al eliminar el dato:', error);
                    Swal.fire({ icon: 'error', title: 'Error', text: 'No se pudo conectar con el servidor.' });
                }
            }
        });
    }
});


