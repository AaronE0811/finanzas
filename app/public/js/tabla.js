function Tabla(data, mes) {
    const tabla = document.getElementById('tablaDatos');
    const tbody = tabla.querySelector('tbody');
    tbody.innerHTML = '';

    //verificar si hay datos

    if (data.length === 0) {
        const filaVacia = document.createElement('tr');
        const celdaVacia = document.createElement('td');
        celdaVacia.colSpan = 4;
        celdaVacia.textContent = `No hay datos para ${mes}`;
        filaVacia.appendChild(celdaVacia);
        tbody.appendChild(filaVacia);
        //reiniciar tabla vacía
        tabla.querySelector('tbody').innerHTML = '';
        return;
    }
    //agregar datos
    data.forEach(dato => {
        const fila = document.createElement('tr');
        fila.setAttribute('data-id', dato._id);
        fila.innerHTML = `
            <td>${dato.categoria}</td>
            <td>${dato.monto.toLocaleString("es-CR")}</td>
            <td>${dato.tipo}</td>
            <td>
                <button class="btn btn-danger btn-sm">Eliminar</button>
            </td>

        `;
        tbody.appendChild(fila);
    });
}export default Tabla;