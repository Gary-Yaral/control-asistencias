import { getHours } from './gethours.js'

const tbody = document.querySelector('#t-body');
const body = document.querySelector('body');
const modal = document.querySelector('.modal-update');
const form = document.querySelector('.form-insert');
const select = form.querySelector('#type-select');
const selectAlmuerzo = document.querySelector('#almuerzo');
const cedula = form.querySelector('#userID');
const fullname = form.querySelector('#username');

const inputs = [...form.querySelectorAll('input')].filter(input => {
  let type = input.getAttribute('type');
  if(type !== 'submit') return input
});

cedula.readOnly = true;
fullname.readOnly = true;

inputs.push(select);
inputs.push(selectAlmuerzo);


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
    
        let buttons =document.createElement('td');
        let btnEdit = document.createElement('button');
        let btnDelete = document.createElement('button');

        btnEdit.innerHTML = 'Editar';
        btnDelete.innerHTML = 'Borrar';
        btnEdit.setAttribute('row',time[5]);
        btnDelete.setAttribute('row',time[5]);
        btnEdit.classList.add('btn-edit')
        btnDelete.classList.add('btn-delete')
        buttons.appendChild(btnEdit);
        buttons.appendChild(btnDelete);

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
        tr.appendChild(buttons);

        tr.setAttribute('row',time[5]);
        tbody.appendChild(tr);

      })
    }
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
          swal('La asistencia ha sido eliminada',{
            icon:'success'
          })
          return;
        }
        
        swal('Ha ocurrido un error al eliminar la asistencia',{
          icon:'warning'
        })
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
    swal({
      title: "¿Está seguro de borrar esta asistencia?",
      text: "Una vez que se haya borrado le notificaremos",
      icon: "warning",
      buttons: true,
      dangerMode: false,
    })
    .then((wasSaved) => {
      if(wasSaved) removeTimer(row);
    })
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
    selectAlmuerzo.value = tds[6].innerHTML === 'SI' ? 1 : 0

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
  const messages = [
    "No ha ingresado la cédula o tiene espacios al principio",
    "No ha ingresado los nombres o tiene espacios al principio",
    "No ha ingresado fecha",
    "No ha ingresado la hora de entrada",
    "No ha ingresado la hora de salida",
    "Selecciona el código",
    "No has indicado si tuvo o no receso",
  ]

  inputs.forEach((input, index) => {
    if (input.value === "" || input.value[0] === " ") {
      empties.push({index, input, message: messages[index]});
    }
  })

  if(empties.length === 0) return { isValid: true, empties};
  return { isValid: false, empties};
}

function saveTimer() {
  let formData = new FormData(form);
  let codigo = modal.getAttribute('timerCode');
  let codigoActual = modal.getAttribute('workerCode');
  let almuerzo = parseInt(selectAlmuerzo.value);
  formData.append('timerCode', codigo);
  formData.append('actualCode', codigoActual);
  formData.append('almuerzo', almuerzo);
  fetch('controller/update_timer.php', {
    method: 'POST',
    body: formData
  })
    .then(res => res.json())
    .then(res => {
      if(res === true){
        swal('Asistencia editada correctamente',{
          icon: "success",
        })
        .then((wasSaved) => {
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
          tds[6].innerHTML = formData.get('almuerzo') === '1' ? 'SI' :'NO'
          tds[7].innerHTML = getHours(formData.get('hora_ingreso'),formData.get('hora_salida'),formData.get('almuerzo')).normales;
          tds[8].innerHTML = getHours(formData.get('hora_ingreso'),formData.get('hora_salida'),formData.get('almuerzo')).extras;

          hideModal();
          form.reset();
          return;
        })

        return;
      }

      swal(res.message, {
        icon: 'warning'
      })
        .then(ok => {
          inputs[0].focus();
        })
    })
}

form.addEventListener('submit', (e) => {
  e.preventDefault();
  if (verifyEmpties().isValid) {

    if(inputs[3].value === inputs[4].value) {
      swal('La hora de salida debe ser diferente a la hora de entrada.', {
        icon: 'warning'
      })
        .then(ok => {
          inputs[4].focus();
        })
      return;
    }

    let hora_entrada = inputs[3].value.split(':');
    let hora_salida =inputs[4].value.split(':');

    if(hora_entrada[0] === hora_salida[0]) {
      if( hora_salida[1] > hora_entrada[1] ) {
        swal({
          title: "¿Desea editar esta asistencia?",
          text: "Una vez que se haya editada le notificaremos",
          icon: "warning",
          buttons: true,
          dangerMode: false,
        })
        .then((wasSaved) => {
          if(wasSaved) saveTimer();
        })
    
        return;
      }

      swal('La hora de salida debe ser diferente a la hora de entrada.', {
        icon: 'warning'
      })
        .then(ok => {
          inputs[4].focus();
        })
      return;
    }

    if(hora_entrada[0] > hora_salida[0]) {
      swal('La hora de salida debe ser diferente a la hora de entrada.', {
        icon: 'warning'
      })
        .then(ok => {
          inputs[4].focus();
        })
      return;
    }

    swal({
      title: "¿Desea editar esta asistencia?",
      text: "Una vez que se haya editada le notificaremos",
      icon: "warning",
      buttons: true,
      dangerMode: false,
    })
    .then((wasSaved) => {
      if(wasSaved) saveTimer();
    })
    return;

  }

  swal(verifyEmpties().empties[0].message, {
    icon: 'warning'
  })
    .then(ok => {
      verifyEmpties().empties[0].input.focus()
    })
  return;

})