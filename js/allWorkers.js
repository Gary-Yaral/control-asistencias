const tbody = document.querySelector('#t-body');
const body = document.querySelector('body');

function removeWorker(row) {
  let codigo = row.getAttribute('row') ;
  const formData = new FormData();
  formData.append('codigo', codigo);

  fetch('controller/delete_worker.php', {
    method: "POST",
    body: formData
  })
    .then(res => res.json())
    .then(res => {
      if(res === true) {
        if(tbody.removeChild(row)){       
          alert('Se eliminado el trabajador')
        }
      }
    })
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
      btnDelete.innerHTML = 'Eliminar';
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
  })