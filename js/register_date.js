const select = document.querySelector('.type-select');
const form = document.querySelector('.form-insert');
const cedula = form.querySelector('#userID');
const fullname = form.querySelector('#username');

const modal = document.querySelector('.modal-update');

const data = [select];
const inputs = [...form.querySelectorAll('input')].filter(input => {
  let type = input.getAttribute('type');
  if(type !== 'submit') return input
});

data.push(...inputs);

function resetDate(input){
  let actualDate = new Date();
  let day = actualDate.getDate() < 10 ? '0'+actualDate.getDate():actualDate.getDate()
  let month = actualDate.getMonth() < 10 ? '0'+(actualDate.getMonth() + 1):actualDate.getMonth() + 1
  let year = actualDate.getFullYear();
  let fullDate =  year+'-'+month+'-'+day;
  input.value = fullDate; 
}

resetDate(inputs[2]);
cedula.readOnly = true;
fullname.readOnly = true;

fetch('controller/getAllWorkers.php')
  .then(res => res.json())
  .then(res => {
    if(res.length > 0) {
      res.forEach(worker => {
        let option = document.createElement('option');
        option.innerHTML = worker.codigo;
        option.value = worker.codigo;
        select.appendChild(option);
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
    "Selecciona el código",
    "No ha ingresado la cédula o tiene espacios al principio",
    "No ha ingresado los nombres o tiene espacios al principio",
    "No ha ingresado fecha",
    "No ha ingresado la hora de entrada",
    "No ha ingresado la hora de salida",
  ]

  data.forEach((input, index) => {
    if (input.value === "" || input.value[0] === " ") {
      empties.push({index, input, monthsage: monthsages[index]});
    }
  })

  if(empties.length === 0) return { isValid: true, empties};
  return { isValid: false, empties};
}

function processData() {
  let formData = new FormData(form);
  formData.append('userCode', select.value);
  fetch('controller/save_timer.php', {
    method: 'POST',
    body: formData
  })
    .then(res => res.json())
    .then(res => {
      if(res === true){
        swal("Asistencia registrada correctamente", {
          icon: "success",
        })
        .then(ok => {  
          form.reset();
          resetDate(inputs[2]);
          data[0].focus();                 
        })
        return;
      }

      swal(res.message, {
        icon: 'warning'
      })
        .then(ok => {
          if(ok) {
            data[0].focus() 
          } else {
            data[0].focus();
          }
        }) 
        return; 
    })
}

function saveDate() {
  swal({
    title: "¿Desea registrar esta asistencia?",
    text: "Una vez que se haya registrado le notificaremos",
    icon: "info",
    buttons: true,
    dangerMode: false,
  })
  .then((wasSaved) => {
    if(wasSaved) processData();
  })
}

form.addEventListener('submit', (e) => {
  e.preventDefault();
  if (verifyEmpties().isValid) {

    if(data[4].value === data[5].value) {
      alert('La hora de salida debe ser diferente a la hora de entrada.');
      data[5].focus();
      return;
    }

    let hora_entrada = data[4].value.split(':');
    let hora_salida =data[5].value.split(':');

    if(hora_entrada[0] === hora_salida[0]) {
      if( hora_salida[1] > hora_entrada[1] ) {
        saveDate();
        return;
      }

      alert('La hora de salida debe ser mayor a la hora de entrada.');
      data[5].focus();
      return;
    }

    if(hora_entrada[0] > hora_salida[0]) {
      alert('La hora de salida debe ser mayor a la hora de entrada.');
      data[5].focus();    
      return;
    }

    saveDate();      
    return;

  }

  swal(verifyEmpties().empties[0].monthsage ,{
    icon: 'warning'
  })
    .then(ok => {
      if(ok) return verifyEmpties().empties[0].input.focus();
      verifyEmpties().empties[0].input.focus()
    })
})


