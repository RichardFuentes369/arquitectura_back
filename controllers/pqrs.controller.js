const pqrsGlobales = require('../globales/pqrs.globales');

const dataPeticion = []

const pqrsController = {

  getPeticiones: (_nroRadicado, _dni) => {

    if(dataPeticion.length > 0){
      if(_nroRadicado == null && _dni == null){
        let pluralS = (dataPeticion.length > 1) ? 's' : ''
        response = {
          "Mensaje": `Actualmente hay (#${dataPeticion.length}) pqrs registrada${pluralS} en el sistema`,
          "Lista": dataPeticion
        }
        return response
      }

      if(_nroRadicado != null && _dni != null){
        busqueda = dataPeticion.filter((obj) => obj._nroRadicado == _nroRadicado)
        if(busqueda.length > 0){
          busqueda = busqueda.filter((obj) => obj._propietario.dni === _dni) 
          if(busqueda.length > 0){
            let pluralS = (busqueda.length > 1) ? 's' : ''
            let pluralEncuentro = (busqueda.length > 1) ? 'aron' : 'o'
            response = {
              "Mensaje": `
                Se encontr${pluralEncuentro} ${busqueda.length} pqrs asociada${pluralS} al dni #${_dni}, en el sistema
              `,
              "Lista": busqueda
            }
          }else{
            response = {
              "Mensaje": `No existen pqrs asociada al dni #${_dni}`,
            }
          }
        }else{
          response = {
            "Mensaje": `La pqrs #${_nroRadicado}, no existe en nuestro sistema`,
          }
        }
        return response
      }

      if(_nroRadicado != null){
        busqueda = dataPeticion.filter((obj) => obj._nroRadicado == _nroRadicado)
        if(busqueda.length > 0){
          let pluralEncuentro = (busqueda.length > 1) ? 'aron' : 'o'
          response = {
            "Mensaje": `
              Se encontr${pluralEncuentro} la pqrs con numero de radicado #${_nroRadicado}, 
              asociada al dni (${busqueda[0]._propietario.dni}) en el sistema
            `,
            "Lista": busqueda
          }
        }else{
          response = {
            "Mensaje": `La pqrs #${_nroRadicado}, no existe en nuestro sistema`,
          }
        }
        return response
      }

      if(_dni != null){
        busqueda = dataPeticion.filter((obj) => obj._propietario.dni === _dni) 
        if(busqueda.length > 0){
          let pluralS = (busqueda.length > 1) ? 's' : ''
          let pluralEncuentro = (busqueda.length > 1) ? 'aron' : 'o'
          response = {
            "Mensaje": `
              Se encontr${pluralEncuentro} ${busqueda.length} pqrs asociada${pluralS} al dni #${_dni}, en el sistema
            `,
            "Lista": busqueda
          }
        }else{
          response = {
            "Mensaje": `No existen pqrs asociadas al dni #${_dni}`,
          }
        }
      }


    }else{
      response = {
        "Mensaje": "El sistema no encontro pqrs registradas.",
        "Lista": null
      }
    }

    return response

  },

  addPqrs: (data) => {

    // almaceno en una variable el tamaño de las peticiones en ese momento
    tamanoAnterior = dataPeticion.length
    
    // almaceno en el objeto el numero de radicado "fecha del sistema en timestapp"
    data._nroRadicado = pqrsGlobales.getFecha(1)
    data._estado = 3
    hora_actualizacion = pqrsGlobales.getFecha(2)
    data._trazabilidad = [
      {
        "estado": 1,
        "actualizacion": hora_actualizacion,
        "respuesta": `Se crea la solicitud no ${pqrsGlobales.getFecha(1)}`
      }
    ]

    // pucheo al arreglo general las peticiones
    dataPeticion.push(data)

    // si el tamaño aumento, indica que se creo exitosamente
    if (dataPeticion.length > tamanoAnterior){
      response = {
        "Mensaje": "El sistema informa que la pqrs fue creada exitosamente.",
        "Radicado": {
          "_nroRadicado": data._nroRadicado,
          "_nombreCliente": `${data._propietario.nombres} ${data._propietario.apellidos}`,
          "_createdAt": pqrsGlobales.getFecha(2)
        }
      }
    } else{
      response = {
        "Mensaje": "Error, El sistema no puedo crear la pqrs.",
        "Radicado": null
      }
    }

    return response
  
  },
  
  updateEstado: (req, data) => {
    busqueda = dataPeticion.find((obj) => obj._nroRadicado == data._nroRadicado)

    hora_actualizacion = pqrsGlobales.getFecha(2)
    estadoTrazabilidad = {
      "estado": parseInt(data._estado),
      "actualizacion": hora_actualizacion,
      "respuesta": req._trazabilidad.respuesta
    }
    
    if(busqueda){
      if(busqueda._trazabilidad) {
        busqueda._trazabilidad.push(estadoTrazabilidad)
      }
      busqueda.estado = parseInt(data._estado)
      response = {
        "Mensaje": `El estado de la pqrs ${data._nroRadicado} fue actualizado exitosamente.`,
      }
    }else{
      response = {
        "Mensaje": `El sistema no encontro la pqrs asociadas con al radicado ${data._nroRadicado}.`,
      }
    }
    
    return response
  }
}

module.exports = pqrsController;