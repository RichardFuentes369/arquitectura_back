const getFecha = (opcion) => {
  const now = new Date()
  let response

  if(opcion == 1){
   response = Math.floor(now.getTime() / 1000)
  }

  if(opcion == 2){
    const año = now.getFullYear(); 
    const mes = now.getMonth() + 1;
    const dia = now.getDate();
    const hora = now.getHours(); 
    const min = now.getMinutes(); 
    const seg = now.getSeconds(); 

    response = `${año}-${mes}-${dia} ${hora}:${min}:${seg}`
  }

  return response
}

module.exports = { getFecha }