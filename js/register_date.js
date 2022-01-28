const select = document.querySelector('.type-select');

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

select.addEventListener('chenge', () => {
  console.log(select.value);
})