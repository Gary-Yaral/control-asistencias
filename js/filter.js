import { getHours } from './getHours.js';

const tbody = document.querySelector('#t-body');
const body = document.querySelector('body');
const form = document.querySelector('.form-search');

function renderEmpties() {
  let tr = document.createElement('tr');
  let codigo =document.createElement('td');
  let cedula =document.createElement('td');
  let nombre =document.createElement('td');
  let fechaInicial =document.createElement('td');
  let fechaFinal =document.createElement('td');
  let horasTotales =document.createElement('td');
  let horasExtrasTotales =document.createElement('td');

  tr.appendChild(codigo);
  tr.appendChild(cedula);
  tr.appendChild(nombre);
  tr.appendChild(fechaInicial);
  tr.appendChild(fechaFinal);
  tr.appendChild(horasTotales);
  tr.appendChild(horasExtrasTotales);

  tbody.appendChild(tr);
}

renderEmpties();

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
    let data = {};
    res.forEach(time => {

      data[time[0]] ??= {
        codigo: time[0],
        cedula: time[1],
        nombre: time[2] + " " + time[3], 
        fecha_inicial: formData.get('fecha_inicial'),
        fecha_final: formData.get('fecha_final'),
        normales: 0,
        extras:0
      }

      let normales = getHours(time[8],time[9],time[10]).normales;
      let extras = getHours(time[8],time[9],time[10]).extras;

      data[time[0]].normales += normales;
      data[time[0]].extras += extras;

    })
  
    data = Object.values(data).sort((a,b) => a.codigo-b.codigo)
    data.forEach(time => {
      let tr = document.createElement('tr');
      let codigo =document.createElement('td');
      let cedula =document.createElement('td');
      let nombre =document.createElement('td');
      let fechaInicial =document.createElement('td');
      let fechaFinal =document.createElement('td');
      let horasTotales =document.createElement('td');
      let horasExtrasTotales =document.createElement('td');
      horasExtrasTotales.classList.add('last-td');

      codigo.innerHTML = time.codigo;
      cedula.innerHTML = time.cedula;
      nombre.innerHTML = time.nombre;
      fechaInicial.innerHTML = time.fecha_inicial;
      fechaFinal.innerHTML = time.fecha_final;
      horasTotales.innerHTML = (Math.trunc(100 * time.normales)) / 100;
      horasExtrasTotales.innerHTML = (Math.trunc(100 * time.extras)) /100;

      tr.appendChild(codigo);
      tr.appendChild(cedula);
      tr.appendChild(nombre);
      tr.appendChild(fechaInicial);
      tr.appendChild(fechaFinal);
      tr.appendChild(horasTotales);
      tr.appendChild(horasExtrasTotales);

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

/* 
renderAll(); */