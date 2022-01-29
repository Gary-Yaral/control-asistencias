const tbody = document.querySelector('#t-body');
const body = document.querySelector('body');
const modal = document.querySelector('.modal-update');
const form = document.querySelector('.form-insert');
const select = form.querySelector('.type-select')
const cedula = form.querySelector('#userID');
const fullname = form.querySelector('#username');

const inputs = [...form.querySelectorAll('input')].filter(input => {
  let type = input.getAttribute('type');
  if(type !== 'submit') return input
});

cedula.readOnly = true;
fullname.readOnly = true;

inputs.push(select);

function getExtraHours(horaEntrada, horaSalida) {
  let tiempoEntrada = horaEntrada.split(':').map(hour => parseInt(hour));
  let tiempoSalida = horaSalida.split(':').map(hour => parseInt(hour));    
  let horas = (tiempoSalida[0] + (tiempoSalida[1]/60)) - (tiempoEntrada[0] + (tiempoEntrada[1]/60));
  return horas.toFixed(2);
}

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
      let horasExtras =document.createElement('td');
  
      let buttons =document.createElement('td');
      let btnEdit = document.createElement('button');
      let btnDelete = document.createElement('button');

      btnEdit.innerHTML = 'Editar';
      btnDelete.innerHTML = 'Eliminar';
      btnEdit.setAttribute('row',time[0]);
      btnDelete.setAttribute('row',time[0]);
      btnEdit.classList.add('btn-edit')
      btnDelete.classList.add('btn-delete')
      buttons.appendChild(btnEdit);
      buttons.appendChild(btnDelete);

      codigo.innerHTML = time[1];
      cedula.innerHTML = time[2];
      nombre.innerHTML = time[3];
      fecha.innerHTML = time[4];
      horaEntrada.innerHTML = time[5];
      horaSalida.innerHTML = time[6];

      horasExtras.innerHTML = getExtraHours(time[5],time[6]);
     
      tr.appendChild(codigo);
      tr.appendChild(cedula);
      tr.appendChild(nombre);
      tr.appendChild(fecha);
      tr.appendChild(horaEntrada);
      tr.appendChild(horaSalida);
      tr.appendChild(horasExtras);

      tr.appendChild(buttons);

      tr.setAttribute('row',time[0]);
      tbody.appendChild(tr);

    })
  })


function removeTimer(row) {
  let codigo = row.getAttribute('row') ;
  const formData = new FormData();
  formData.append('codigo', codigo);

  fetch('controller/delete_timer.php', {
    method: "POST",
    body: formData
  })
    .then(res => res.json())
    .then(res => {
      if(res === true) {
        if(tbody.removeChild(row)){       
          alert('La asistencia ha sido eliminada')
        }
      }
    })
}

function hideModal() {
  modal.classList.add('hidden');
  modal.removeAttribute('timerCode');
  modal.removeAttribute('workerCode');
}

body.addEventListener('click', (e) => {
  let btnClass = e.target.classList;

  if(btnClass.contains('btn-delete')) {
    let row = e.target.parentNode.parentNode;
    removeTimer(row);
    return;
  }

  if(btnClass.contains('btn-edit')) {
    let row = e.target.parentNode.parentNode;
    modal.classList.remove('hidden');
    let codigo = row.getAttribute('row') ;
    const tds = row.querySelectorAll('td');
    select.innerHTML = "";
    let optionEmpty = document.createElement('option');
    optionEmpty.innerHTML ="Seleccione un código";
    optionEmpty.value = "";
    select.appendChild(optionEmpty);

    fetch('controller/getAllworkers.php')
      .then(res=> res.json())
      .then(res => {
        res.forEach(worker => {
          let option = document.createElement('option');
          option.innerHTML = worker.codigo;
          option.value = worker.codigo;
          select.appendChild(option);
        })
    select.value = tds[0].innerHTML;
    })

    cedula.readOnly = false;
    fullname.readOnly = false;

    inputs[0].value = tds[1].innerHTML
    inputs[1].value = tds[2].innerHTML
    inputs[2].value = tds[3].innerHTML
    inputs[3].value = tds[4].innerHTML
    inputs[4].value = tds[5].innerHTML

    cedula.readOnly = true;
    fullname.readOnly = true;

    modal.setAttribute('timerCode', codigo);
    modal.setAttribute('workerCode', tds[0].innerHTML);
  }

  if(btnClass.contains('close')) {
    hideModal();
    inputs.forEach(input => {
      input.value = "";
    })      
  }

})

select.addEventListener('change', () => {

  if(select.value !== ""){
    let formData = new FormData();
    formData.append('userCode', select.value);
    fetch('controller/search.php', {
      method: 'POST',
      body: formData
    })
      .then(res => res.json())
      .then(res => {
        cedula.readOnly = false;
        fullname.readOnly = false;
        cedula.value = res.cedula;
        fullname.value = res.nombres + " " + res.apellidos;
        cedula.readOnly = true;
        fullname.readOnly = true;
      })
      return;    
  }

  cedula.readOnly = false;
  fullname.readOnly = false;
  cedula.value = "";
  fullname.value = "";
  cedula.readOnly = true;
  fullname.readOnly = true;

})

function verifyEmpties () {
  const empties = [];
  const monthsages = [
    "No ha ingresado la cédula o tiene espacios al principio",
    "No ha ingresado los nombres o tiene espacios al principio",
    "No ha ingresado fecha",
    "No ha ingresado la hora de entrada",
    "No ha ingresado la hora de salida",
    "Selecciona el código",
  ]

  inputs.forEach((input, index) => {
    if (input.value === "" || input.value[0] === " ") {
      empties.push({index, input, monthsage: monthsages[index]});
    }
  })

  if(empties.length === 0) return { isValid: true, empties};
  return { isValid: false, empties};
}

function saveTimer() {
  let formData = new FormData(form);
  let codigo = modal.getAttribute('timerCode');
  let codigoActual = modal.getAttribute('workerCode');
  formData.append('timerCode', codigo);
  formData.append('actualCode', codigoActual);
  fetch('controller/update_timer.php', {
    method: 'POST',
    body: formData
  })
    .then(res => res.json())
    .then(res => {
      if(res === true){
        alert('Asistencia editada correctamente');
        const trs = [...tbody.querySelectorAll('tr')];
            const tr = trs.filter(tr => {
              if (tr.getAttribute('row') === codigo) {
                return tr;
              }
            })[0];
          
            let tds = tr.querySelectorAll('td');
            tds[0].innerHTML = formData.get('type');
            tds[1].innerHTML = formData.get('userID');
            tds[2].innerHTML = formData.get('username');
            tds[3].innerHTML = formData.get('date');
            tds[4].innerHTML = formData.get('hora_ingreso');
            tds[5].innerHTML = formData.get('hora_salida');
            tds[6].innerHTML = getExtraHours(formData.get('hora_ingreso'),formData.get('hora_salida'))

            hideModal();
            form.reset();
        return;
      }

      alert(res.message);
      inputs[0].focus();
    })
}

form.addEventListener('submit', (e) => {
  e.preventDefault();
  if (verifyEmpties().isValid) {

    if(inputs[3].value === inputs[4].value) {
      alert('La hora de salida debe ser diferente a la hora de entrada.');
      inputs[4].focus();
      return;
    }

    let hora_entrada = inputs[3].value.split(':');
    let hora_salida =inputs[4].value.split(':');

    if(hora_entrada[0] === hora_salida[0]) {
      if( hora_salida[1] > hora_entrada[1] ) {
        saveTimer();
        return;
      }

      alert('La hora de salida debe ser mayor a la hora de entrada.');
      inputs[4].focus();
      return;
    }

    if(hora_entrada[0] > hora_salida[0]) {
      alert('La hora de salida debe ser mayor a la hora de entrada.');
      inputs[4].focus();    
      return;
    }

    saveTimer();
    return;

  }

  alert(verifyEmpties().empties[0].monthsage);
  verifyEmpties().empties[0].input.focus();
})