const tbody = document.querySelector('#t-body');
const body = document.querySelector('body');
const form = document.querySelector('.form-search');

function getHours(horaEntrada, horaSalida, almuerzo) {
  let tiempoEntrada = horaEntrada.split(':').map(n => parseInt(n));
  let tiempoSalida = horaSalida.split(':').map(n => parseInt(n));
  let horas = (tiempoSalida[0] + (tiempoSalida[1]/60)) - (tiempoEntrada[0] + (tiempoEntrada[1]/60));
  if(almuerzo === '1') {
    let totalHoras =  horas - 1;
    if( totalHoras > 8 ) {
      let extras = (Math.trunc((totalHoras - 8) * 100))/100;
      return {
        normales: 8,
        extras
      }
    }
    return {
      normales: (Math.trunc(horas * 100))/100,
      extras: 0
    }
  }

  if(almuerzo === '0') {
    let totalHoras =  horas;
    if( totalHoras > 8 ) {
      let extras = (Math.trunc((totalHoras - 8) * 100))/100;
      return {
        normales: 8,
        extras
      }
    }
    
    return {
      normales: (Math.trunc(horas * 100))/100,
      extras: 0
    }
  }
  
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
      let almuerzo =document.createElement('td');
      let horaNormales =document.createElement('td');
      let horasExtras =document.createElement('td');

      codigo.innerHTML = time[1];
      cedula.innerHTML = time[2];
      nombre.innerHTML = time[3];
      fecha.innerHTML = time[4];
      horaEntrada.innerHTML = time[5];
      horaSalida.innerHTML = time[6];
      horaNormales.innerHTML = getHours(time[5],time[6],time[7]).normales;
      horasExtras.innerHTML = getHours(time[5],time[6],time[7]).extras;
      almuerzo.innerHTML = time[7] === '1' ? 'SI' : 'NO';

      tr.appendChild(codigo);
      tr.appendChild(cedula);
      tr.appendChild(nombre);
      tr.appendChild(fecha);
      tr.appendChild(horaEntrada);
      tr.appendChild(horaSalida);
      tr.appendChild(almuerzo);
      tr.appendChild(horaNormales);
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
  if (res.length > 0) {
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

      codigo.innerHTML = time[1];
      cedula.innerHTML = time[2];
      nombre.innerHTML = time[3];
      fecha.innerHTML = time[4];
      horaEntrada.innerHTML = time[5];
      horaSalida.innerHTML = time[6];
      
      horaNormales.innerHTML = getHours(time[5],time[6],time[7]).normales;
      horasExtras.innerHTML = getHours(time[5],time[6],time[7]).extras;
      almuerzo.innerHTML = time[7] === '1' ? 'SI' : 'NO';
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

      tr.setAttribute('row',time[0]);
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