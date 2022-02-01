const tbody = document.querySelector('#t-body');
const body = document.querySelector('body');
const modal = document.querySelector('.modal-update');
const form = document.querySelector('.form-insert');
const select = form.querySelector('.type-select')

const inputs = [...form.querySelectorAll('input')].filter(input => {
  let type = input.getAttribute('type');
  if(type !== 'submit') return input
});

inputs.push(select);


function removeWorker(row) {
  let codigo = row.getAttribute('row') ;
  const formData = new FormData();
  formData.append('codigo', codigo);

  swal({
    title: "¿Está seguro de borrar este trabajador?",
    text: "Una vez que se haya borrado le notificaremos",
    icon: "warning",
    buttons: true,
    dangerMode: false,
  })
  .then((wasSaved) => {
    if (wasSaved) {
      fetch('controller/delete_worker.php', {
        method: "POST",
        body: formData
      })
        .then(res => res.json())
        .then(res => {
    
          if(res === true) {
            if(tbody.removeChild(row)){       
              swal("Trabajador borrado correctamente", {
                icon: "success",
              });
            }
            return;
          }

          swal(res.message, {
            icon: "warning",
          });
        })
    } 
  });

}


fetch('controller/getAllWorkers.php')
  .then(res => res.json())
  .then(res => {
    res.forEach(worker => {
      let tr = document.createElement('tr');
      let codigo =document.createElement('td')
      let cedula =document.createElement('td')
      let nombres =document.createElement('td')
      let apellidos =document.createElement('td')
      let tipo =document.createElement('td')
      let buttons =document.createElement('td');
      let btnEdit = document.createElement('button');
      let btnDelete = document.createElement('button');

      btnEdit.innerHTML = 'Editar';
      btnDelete.innerHTML = 'Borrar';
      btnEdit.setAttribute('row',worker[0]);
      btnDelete.setAttribute('row',worker[0]);
      btnEdit.classList.add('btn-edit')
      btnDelete.classList.add('btn-delete')
      buttons.appendChild(btnEdit);
      buttons.appendChild(btnDelete);

      codigo.innerHTML = worker[0];
      cedula.innerHTML = worker[1];
      nombres.innerHTML = worker[2]
      apellidos.innerHTML = worker[3]
      tipo.innerHTML = worker[4]
     
      tr.appendChild(codigo);
      tr.appendChild(cedula);
      tr.appendChild(nombres);
      tr.appendChild(apellidos);
      tr.appendChild(tipo);
      tr.appendChild(buttons);

      tr.setAttribute('row',worker[0]);
      tbody.appendChild(tr);


    })
  })

  body.addEventListener('click', (e) => {
    let btnClass = e.target.classList;

    if(btnClass.contains('btn-delete')) {
      let row = e.target.parentNode.parentNode;
      removeWorker(row);
    }

    if(btnClass.contains('btn-edit')) {
      modal.classList.remove('hidden');
      let row = e.target.parentNode.parentNode;
      const tds = row.querySelectorAll('td');
      inputs[0].value = tds[0].innerHTML
      inputs[1].value = tds[1].innerHTML
      inputs[2].value = tds[2].innerHTML
      inputs[3].value = tds[3].innerHTML
      inputs[4].value = tds[4].innerHTML
      modal.setAttribute('usercode', tds[0].innerHTML);
    }

    if(btnClass.contains('close')) {
      modal.classList.add('hidden');
      modal.removeAttribute('usercode');
      inputs.forEach(input => {
        input.value = "";
      })      
    }

  })

function verifyEmpties () {
  const empties = [];
  const messages = [
    "No ha ingresado el código o tiene espacios al principio",
    "No ha ingresado la cédula o tiene espacios al principio",
    "No ha ingresado los nombres o tiene espacios al principio",
    "No ha ingresado los apellidos o tiene espacios al principio",
    "No ha seleccionado el tipo",
  ]

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

function updateWorker() {
  let modalCode = modal.getAttribute('usercode');
  const formData = new FormData(form);
  formData.append('original_code', modalCode);

  fetch('controller/update_worker.php',{
    method: 'POST',
    body: formData
  })
    .then(res => res.json())
    .then(res => {
      if(res === true ) { 
        const trs = [...tbody.querySelectorAll('tr')];
        const tr = trs.filter(tr => {
          if (tr.getAttribute('row') === modalCode)  {
            return tr;
          }
        })[0];
      
        modal.removeAttribute('usercode');
        modal.setAttribute('usercode',formData.get('userCode'));
        let newCode = modal.getAttribute('usercode');
        tr.removeAttribute('row');
        tr.setAttribute('row',newCode);
        let tds = tr.querySelectorAll('td');
        tds[0].innerHTML = formData.get('userCode');
        tds[1].innerHTML = formData.get('userID');
        tds[2].innerHTML = formData.get('username');
        tds[3].innerHTML = formData.get('lastname');
        tds[4].innerHTML = formData.get('type');
        swal('Trabajador editado correctamente.', {
          icon:'success'
        })

        .then(ok => {
          modal.classList.add('hidden');
          form.reset();
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
  return;
}

form.addEventListener('submit', (e) => {
  e.preventDefault();
  if(verifyEmpties().isValid === true) {
    swal({
      title: "¿Desea editar este trabajador?",
      text: "Una vez que se haya editado le notificaremos",
      icon: "info",
      buttons: true,
      dangerMode: false,
    })
    .then((ok) => {
      if(ok){ 
        updateWorker()
      }
    })
    return;
  }

  swal(verifyEmpties().empties[0].message, {
    icon: 'warning'
  })
  .then(ok => {
    if(ok) {
      verifyEmpties().empties[0].input.focus();
    } else {
      verifyEmpties().empties[0].input.focus();
    }
  })
})