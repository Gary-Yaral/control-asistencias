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


form.addEventListener('submit', (e) => {
  e.preventDefault();
  if (verifyEmpties().isValid) {

  let  data = new FormData(form); 

  fetch('controller/save_worker.php', {
    method: 'POST',
    body: data
  })
    .then(res => res.json())
    .then(res => { 
      if(res === true) {
        alert('Trabajador ha sido agregado');
        firstInput.focus();
        form.reset();
        return;
      }

      if(res.type === 'repeated' ) {
        alert('El código ingresado ya existe.');
        firstInput.focus();
      }
    });
    return;
  }

  alert(verifyEmpties().empties[0].message);
  verifyEmpties().empties[0].input.focus();

})