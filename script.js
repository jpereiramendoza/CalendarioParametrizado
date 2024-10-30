// Generar el calendario cuando cambien los inputs
document.getElementById('startDate').addEventListener('input', generateCalendar);
document.getElementById('endDate').addEventListener('input', generateCalendar);
document.getElementById('monthsPerRow').addEventListener('input', generateCalendar);

function generateCalendar() {
    const startDateInput = document.getElementById('startDate');
    const endDateInput = document.getElementById('endDate');

    // Si no se ha seleccionado una fecha, establece la fecha de hoy como la fecha de inicio por defecto
    if (!startDateInput.value) {
        const today = new Date();
        const todayFormatted = today.toISOString().split('T')[0];
        startDateInput.value = todayFormatted;
    }

    // Si no se ha seleccionado una fecha de término, establece la fecha 12 meses después como por defecto
    if (!endDateInput.value) {
        const endDate = new Date(startDateInput.value);
        endDate.setMonth(endDate.getMonth() + 12);
        const endDateFormatted = endDate.toISOString().split('T')[0];
        endDateInput.value = endDateFormatted;
    }

    const startDate = new Date(startDateInput.value);
    const endDate = new Date(endDateInput.value);
    const monthsPerRow = parseInt(document.getElementById('monthsPerRow').value);
    const calendarContainer = document.getElementById('calendarContainer');
    
    if (!startDate || !endDate || isNaN(monthsPerRow) || startDate > endDate) {
        alert("Por favor, asegúrate de que las fechas y el número de meses por fila sean válidos.");
        return;
    }

    calendarContainer.innerHTML = '';

    let currentDate = new Date(startDate);
    let months = [];

    // Generar los meses entre la fecha de inicio y fin
    while (currentDate <= endDate) {
        months.push(new Date(currentDate)); // Agregar el mes actual al array
        currentDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1); // Crear nueva fecha para el siguiente mes    
    }

    // Ajustar grid layout basado en la cantidad de meses por fila
    calendarContainer.style.gridTemplateColumns = `repeat(${monthsPerRow}, 1fr)`;

    // Crear el HTML para cada mes
    months.forEach((month, index) => {
        const monthElement = document.createElement('div');
        const monthClass = `month-${(index % 12) + 1}`; // Clase cíclica para más de 12 meses
        monthElement.className = `month col ${monthClass}`;
        monthElement.innerHTML = generateMonthHTML(month);
        calendarContainer.appendChild(monthElement);
    });
}

function generateMonthHTML(date) {
    const monthName = date.toLocaleString('default', { month: 'long' });
    const capitalizedMonthName = monthName.charAt(0).toUpperCase() + monthName.slice(1); // Poner la primera letra en mayúscula
    const year = date.getFullYear();
    const firstDay = new Date(date.getFullYear(), date.getMonth(), 1).getDay();
    const daysInMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    const daysOfWeek = ['Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sá', 'Do'];

    let html = `<h3>${capitalizedMonthName} ${year}</h3>`;
    html += `<table class="table table-bordered"><thead><tr>`;

    daysOfWeek.forEach(day => {
        html += `<th>${day}</th>`;
    });

    html += `</tr></thead><tbody><tr>`;

    // Agregar celdas vacías para los días antes del inicio del mes
    for (let i = 0; i < (firstDay === 0 ? 6 : firstDay - 1); i++) {
        html += `<td></td>`;
    }

    // Agregar días del mes
    for (let day = 1; day <= daysInMonth; day++) {
        const dayOfWeek = new Date(date.getFullYear(), date.getMonth(), day).getDay();
        let className = '';

        if (dayOfWeek === 6) { // Sábado
            className = 'sabado';
        } else if (dayOfWeek === 0) { // Domingo
            className = 'domingo';
        }

        html += `<td class="${className}">${day}</td>`;

        if (dayOfWeek === 0 && day !== daysInMonth) {
            html += `</tr><tr>`;
        }
    }

    html += `</tr></tbody></table>`;
    return html;
}

// Inicializar el calendario con las fechas por defecto al cargar la página
window.onload = generateCalendar;
