const select = document.querySelector('.type-select');
const form = document.querySelector('.form-insert');
const cedula = form.querySelector('#userID');
const fullname = form.querySelector('#username');
const data = [select];
const inputs = [...form.querySelectorAll('input')].filter(input => {
  let type = input.getAttribute('type');
  if(type !== 'submit') return input
});

data.push(...inputs);


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
  const messages = [
    "Selecciona el código",
    "No ha ingresado la cédula o tiene espacios al principio",
    "No ha ingresado los nombres o tiene espacios al principio",
    "No ha ingresado fecha",
    "No ha ingresado la hora de entrada",
    "No ha ingresado la hora de salida",
  ]

  data.forEach((input, index) => {
    if (input.value === "" || input.value[0] === " ") {
      empties.push({index, input, message: messages[index]});
    }
  })

  if(empties.length === 0) return { isValid: true, empties};
  return { isValid: false, empties};
}

form.addEventListener('submit', (e) => {
  e.preventDefault();
  if (verifyEmpties().isValid) {
    let formData = new FormData(form);
    formData.append('userCode', select.value);
    fetch('controller/save_timer.php', {
      method: 'POST',
      body: formData
    })
      .then(res => res.json())
      .then(res => {
        if(res === true){
          alert('Asistencia agregada correctamente');
          form.reset();
          data[0].focus();
          return;
        }

        alert(res.message);
        data[0].focus();
      })
    return;
  }

  alert(verifyEmpties().empties[0].message);
    verifyEmpties().empties[0].input.focus();
})