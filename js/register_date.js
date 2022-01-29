const select = document.querySelector('.type-select');
const form = document.querySelector('.form-insert');
const cedula = form.querySelector('#userID');
const fullname = form.querySelector('#username');

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