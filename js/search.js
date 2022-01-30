const tbody = document.querySelector('#t-body');
const body = document.querySelector('body');
const form = document.querySelector('.form-search');

function getHours(horaEntrada, horaSalida) {
  let tiempoEntrada = horaEntrada.split(':').map(hour => parseInt(hour));
  let tiempoSalida = horaSalida.split(':').map(hour => parseInt(hour));    
  let horas = (tiempoSalida[0] + (tiempoSalida[1]/60)) - (tiempoEntrada[0] + (tiempoEntrada[1]/60));
  if(tiempoSalida[0] >= 17 && tiempoSalida[1] >= 0) {
    let horasNormales = (Math.trunc(100 * (17 - (tiempoEntrada[0] + (tiempoEntrada[1]/60))))) / 100;
    
    let extras = (Math.trunc((horas - horasNormales) * 100)) / 100
    return {
      normales:  Math.trunc(100 * (horasNormales - 1)) /100 ,
      extras
    };
  }

  if(horas > 4) {
    return {
      normales:  ((Math.trunc(100 * horas)) / 100)- 1,
      extras: 0
    };
  }

  return {
    normales:  (Math.trunc(100 * horas)) / 100,
    extras: 0
  };
}

function renderAll () {
tbody.innerHTML = "";
fetch('controller/getAllTimes.php')
.then(res => res.json())
.then(res => {
  res.forEach(time => {
    let tr = document.createElement('tr');
    let codigo =document.createElement('td');
    let cedula =document.createElement('td');
    let nombre =document.createElement('td');
    let fecha =document.createElement('td');
    let horaEntrada =document.createElement('td');
    let horaSalida =document.createElement('td');
    let horaNormales =document.createElement('td');
    let horasExtras =document.createElement('td');

    codigo.innerHTML = time[1];
    cedula.innerHTML = time[2];
    nombre.innerHTML = time[3];
    fecha.innerHTML = time[4];
    horaEntrada.innerHTML = time[5];
    horaSalida.innerHTML = time[6];
    horaNormales.innerHTML = getHours(time[5],time[6]).normales;
    horasExtras.innerHTML = getHours(time[5],time[6]).extras;
    horasExtras.classList.add('last-td');

    tr.appendChild(codigo);
    tr.appendChild(cedula);
    tr.appendChild(nombre);
    tr.appendChild(fecha);
    tr.appendChild(horaEntrada);
    tr.appendChild(horaSalida);
    tr.appendChild( horaNormales);
    tr.appendChild(horasExtras);

    tr.setAttribute('row',time[0]);
    tbody.appendChild(tr);

  })
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
let horaNormales =document.createElement('td');
let horasExtras =document.createElement('td');
horasExtras.classList.add('last-td');

tr.appendChild(codigo);
tr.appendChild(cedula);
tr.appendChild(nombre);
tr.appendChild(fecha);
tr.appendChild(horaEntrada);
tr.appendChild(horaSalida);
tr.appendChild( horaNormales);
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
  if (res.length > 0) {
    res.forEach(time => { 
      let tr = document.createElement('tr');
      let codigo =document.createElement('td');
      let cedula =document.createElement('td');
      let nombre =document.createElement('td');
      let fecha =document.createElement('td');
      let horaEntrada =document.createElement('td');
      let horaSalida =document.createElement('td');
      let horaNormales =document.createElement('td');
      let horasExtras =document.createElement('td');

      codigo.innerHTML = time[1];
      cedula.innerHTML = time[2];
      nombre.innerHTML = time[3];
      fecha.innerHTML = time[4];
      horaEntrada.innerHTML = time[5];
      horaSalida.innerHTML = time[6];
      horaNormales.innerHTML = getHours(time[5],time[6]).normales;
      horasExtras.innerHTML = getHours(time[5],time[6]).extras;
      horasExtras.classList.add('last-td');

      tr.appendChild(codigo);
      tr.appendChild(cedula);
      tr.appendChild(nombre);
      tr.appendChild(fecha);
      tr.appendChild(horaEntrada);
      tr.appendChild(horaSalida);
      tr.appendChild( horaNormales);
      tr.appendChild(horasExtras);

      tr.setAttribute('row',time[0]);
      tbody.appendChild(tr);
    }) 
    return;
  }
  alert('No hay asistencias registradas en esas fechas');
  renderEmpties();
  return;    
})
}

form.addEventListener('submit', (e) => {
  e.preventDefault();
  if (form.fecha_inicial.value === "") {
    alert('No ha seleccionado fecha inicial');
  form.fecha_inicial.focus();
  return;
  }

  if (form.fecha_final.value === "") {
  alert('No ha seleccionado fecha final');
  form.fecha_final.focus();
  return;
}

renderSearch(form);
})


renderAll();
