const express = require('express');
const router = express.Router();

const pqrsController = require('../controllers/pqrs.controller');

router.get('/', (req, res) => {
  res.send('Página de inicio');
});

router.get('/pqrs-activas', (req, res) => {
  let _nroRadicado = (req.query._nroRadicado) ? req.query._nroRadicado : null
  let _dni = (req.query._dni) ? req.query._dni : null 
  const listaPeticiones = pqrsController.getPeticiones(_nroRadicado, _dni)

  res.send(`
    ${
      JSON.stringify(listaPeticiones)
    }
  `)
});

router.post('/pqrs-crear', (req, res) => {

  const peticion = pqrsController.addPqrs(req.body)

  res.send(`
    ${
      JSON.stringify(peticion)
    }
  `)

});


router.put('/pqrs-estado', (req, res) => {
  let _nroRadicado = req.query._nroRadicado 
  let _estado = req.query._estado 

  data = {
    "_nroRadicado": _nroRadicado,
    "_estado": _estado
  }

  const listaPeticiones = pqrsController.updateEstado(req.body, data)

  res.send(`
    ${
      JSON.stringify(listaPeticiones)
    }
  `)
});


module.exports = router;
