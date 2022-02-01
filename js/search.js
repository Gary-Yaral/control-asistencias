import { getHours } from './getHours.js';

const tbody = document.querySelector('#t-body');
const body = document.querySelector('body');
const form = document.querySelector('.form-search');

function renderAll () {
tbody.innerHTML = "";
fetch('controller/getAllTimes.php')
  .then(res => res.json())
  .then(res => {
    if(res.length > 0) {

      res.forEach(time => {
        let tr = document.createElement('tr');
        let codigo =document.createElement('td');
        let cedula =document.createElement('td');
        let nombre =document.createElement('td');
        let fecha =document.createElement('td');
        let horaEntrada =document.createElement('td');
        let horaSalida =document.createElement('td');
        let almuerzo =document.createElement('td');
        let horaNormales =document.createElement('td');
        let horasExtras =document.createElement('td');

        codigo.innerHTML = time[0];
        cedula.innerHTML = time[1];
        nombre.innerHTML = time[2]+ " " + time[3];
        fecha.innerHTML = time[7];
        horaEntrada.innerHTML = time[8];
        horaSalida.innerHTML = time[9];
        horaNormales.innerHTML = getHours(time[8],time[9],time[10]).normales;
        horasExtras.innerHTML = getHours(time[8],time[9],time[10]).extras;
        
        almuerzo.innerHTML = time[10] === '1' ? 'SI' : 'NO';

        horasExtras.classList.add('last-td');
        tr.appendChild(codigo);
        tr.appendChild(cedula);
        tr.appendChild(nombre);
        tr.appendChild(fecha);
        tr.appendChild(horaEntrada);
        tr.appendChild(horaSalida);
        tr.appendChild(almuerzo);
        tr.appendChild( horaNormales);
        tr.appendChild(horasExtras);

        tr.setAttribute('row',time[5]);
        tbody.appendChild(tr);

      })

      return;
    }

  })
}

function renderEmpties() {
  let tr = document.createElement('tr');
  let codigo =document.createElement('td');
  let cedula =document.createElement('td');
  let nombre =document.createElement('td');
  let fecha =document.createElement('td');
  let horaEntrada =document.createElement('td');
  let horaSalida =document.createElement('td');
  let almuerzo =document.createElement('td');
  let horaNormales =document.createElement('td');
  let horasExtras =document.createElement('td');
  horasExtras.classList.add('last-td');

  tr.appendChild(codigo);
  tr.appendChild(cedula);
  tr.appendChild(nombre);
  tr.appendChild(fecha);
  tr.appendChild(horaEntrada);
  tr.appendChild(horaSalida);
  tr.appendChild(almuerzo);
  tr.appendChild(horaNormales);
  tr.appendChild(horasExtras);

  tbody.appendChild(tr);
}

function renderSearch (form) {
const formData = new FormData(form);
tbody.innerHTML = "";
fetch('controller/search_times.php',{
  method: 'POST',
  body: formData
})
.then(res => res.json())
.then(res => {
  if(res.length > 0) {

    res.forEach(time => {
      let tr = document.createElement('tr');
      let codigo =document.createElement('td');
      let cedula =document.createElement('td');
      let nombre =document.createElement('td');
      let fecha =document.createElement('td');
      let horaEntrada =document.createElement('td');
      let horaSalida =document.createElement('td');
      let almuerzo =document.createElement('td');
      let horaNormales =document.createElement('td');
      let horasExtras =document.createElement('td');

      codigo.innerHTML = time[0];
      cedula.innerHTML = time[1];
      nombre.innerHTML = time[2]+ " " + time[3];
      fecha.innerHTML = time[7];
      horaEntrada.innerHTML = time[8];
      horaSalida.innerHTML = time[9];
      horaNormales.innerHTML = getHours(time[8],time[9],time[10]).normales;
      horasExtras.innerHTML = getHours(time[8],time[9],time[10]).extras;
      almuerzo.innerHTML = time[10] === '1' ? 'SI' : 'NO';

      tr.appendChild(codigo);
      tr.appendChild(cedula);
      tr.appendChild(nombre);
      tr.appendChild(fecha);
      tr.appendChild(horaEntrada);
      tr.appendChild(horaSalida);
      tr.appendChild(almuerzo);
      tr.appendChild( horaNormales);
      tr.appendChild(horasExtras);

      tr.setAttribute('row',time[5]);
      tbody.appendChild(tr);

    })

    return;
  }

 swal('No hay asistencias registradas en esas fechas', {
   icon: 'warning'
 })
 .then(ok => {
   renderEmpties();
   return;    
 })
  return;    
})
}

form.addEventListener('submit', (e) => {
  e.preventDefault();
  if (form.fecha_inicial.value === "") {
    swal('No ha seleccionado fecha inicial', {
      icon: 'warning'
    })
    .then(ok => {
      form.fecha_inicial.focus();
      return;
    })
    return;
  }

  if (form.fecha_final.value === "") {
    swal('No ha seleccionado fecha final', {
      icon: 'warning'
    })
    .then(ok => {
      form.fecha_final.focus();
      return;
    })
    return;

}

renderSearch(form);
})


renderAll();