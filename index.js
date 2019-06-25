const express = require('express')
const app = express()
const bodyParser = require('body-parser')

const Sequelize = require('sequelize')
const sequelize = new Sequelize('postgres://postgres:secret@localhost:5432/postgres', {define: { timestamps: false }})

app.use(bodyParser.json())

const Customer = sequelize.define('customer', {
  firstname: Sequelize.STRING,
  lastname: Sequelize.STRING,
  bio: Sequelize.STRING,
  address1: Sequelize.STRING,
  address2: Sequelize.STRING,
  city: Sequelize.STRING
}, {
  tableName: 'customers'
})

Customer.sync()

const port = 4000

app.get('/customers', function(req, res, next){
  Customer.findAll()
          .then(customer => res.status(200).json({customer}))

})

const data4post = {
  firstname: 'newData',
  lastname: 'newData',
  bio: 'newData',
  address1: 'newData',
  address2: 'newData',
  city: 'newData'
}

app.post('/customers', (req, res, next) => {
  Customer
    .create(data4post)
    .then(customer => res.status(200).json(customer))
    .catch(err => res.status(500).json({
      message: 'Error posting smt',
      error: err
    }))
})

app.put('/customers/:id', function(req, res) {
  const id = req.params.id

  Customer.findByPk(id)
    .then( customer => {
        customer
        .update(req.body)
        .then(customer => res.status(200).json(customer).send(customer))
    })
    .catch(err => res.status(500).json(err))
});


app.delete('/customers/:id', (req, res) => {
  const id = req.params.id;

  Customer.destroy({
    where: {id}
  })
   .then(customerDeleted => {
     res.status(200).json(customerDeleted)
   })
   .catch(err => res.status(500).json(err))

})



app.listen(port, () => `Listening on  Port: ${port}`);

