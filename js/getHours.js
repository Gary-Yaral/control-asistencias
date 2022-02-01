export function getHours(horaEntrada, horaSalida, almuerzo) {
  let tiempoEntrada = horaEntrada.split(':').map(n => parseInt(n));
  let tiempoSalida = horaSalida.split(':').map(n => parseInt(n));
  let horas = (tiempoSalida[0] + (tiempoSalida[1]/60)) - (tiempoEntrada[0] + (tiempoEntrada[1]/60));
  if(almuerzo === '1') {
    let totalHoras =  horas - 1;
    if( totalHoras > 8 ) {
      let extras = (Math.trunc((totalHoras - 8) * 100))/100;
      return {
        normales: 8,
        extras
      }
    }
    return {
      normales: (Math.trunc(totalHoras * 100))/100,
      extras: 0
    }
  }

  if(almuerzo === '0') {
    let totalHoras =  horas;
    if( totalHoras > 8 ) {
      let extras = (Math.trunc((totalHoras - 8) * 100))/100;
      return {
        normales: 8,
        extras
      }
    }
    
    return {
      normales: (Math.trunc(horas * 100))/100,
      extras: 0
    }
  }
  
}