const form = document.getElementById('form-insert');
const firstInput = form.querySelector('#userCode');
const select = form.querySelector('select');

firstInput.focus();

function verifyEmpties () {
  const empties = [];
  const messages = [
    "No ha ingresado el código o tiene espacios al principio",
    "No ha ingresado la cédula o tiene espacios al principio",
    "No ha ingresado los nombres o tiene espacios al principio",
    "No ha ingresado los apellidos o tiene espacios al principio",
    "No ha seleccionado el tipo",
  ]

  const inputs = form.querySelectorAll('input');
  inputs.forEach((input, index) => {
    if (input.value === "" || input.value[0] === " ") {
      empties.push({index, input, message: messages[index]});
    }
  })

  if(select.value ==="") {
    empties.push({index: 4, input: select, message: messages[4]
    })
  } 

  if(empties.length === 0) return { isValid: true, empties};
  return { isValid: false, empties};
}

function saveData(form) {
  let  data = new FormData(form); 
  fetch('controller/save_worker.php', {
    method: 'POST',
    body: data
  })
    .then(res => res.json())
    .then(res => { 
      if(res === true) {
        swal("Trabajador registrado correctamente", {
          icon: "success",
        })
        .then(ok => {
          if(ok) {
            form.reset();
            firstInput.focus();
            return;
          }else {
              form.reset();
              firstInput.focus();
              return;
          }            
       })
      }

      if(res.type === 'repeated' ) {
        swal('El código ingresado ya existe', {
          icon: "warning", 
          buttons:true
        })
        .then(ok => {
          if(ok) {
            firstInput.focus();
          } else {
            firstInput.focus();
          }
          return;
        })
      }
    });
}


form.addEventListener('submit', (e) => {
  e.preventDefault();
  if (verifyEmpties().isValid) {
    swal({
      title: "¿Desea registrar este trabajador?",
      text: "Una vez que se haya registrado le notificaremos",
      icon: "info",
      buttons: true,
      dangerMode: false,
    })
    .then((wasSaved) => {
      if (wasSaved) {
        saveData(form);
      } 
    });
  
    return;
  }

  swal(verifyEmpties().empties[0].message, {
    icon: "warning", 
    buttons:true
  })
  .then(ok => {
    if(ok) verifyEmpties().empties[0].input.focus();
  })
  
  

})