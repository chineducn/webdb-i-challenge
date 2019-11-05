const express = require('express');

const db = require('./data/dbConfig.js');

const server = express();

server.use(express.json());

server.get('/', (req, res) => {
    const { limit, offset, orderBy, orderDir } = req.query
    db('accounts').limit(limit).offset(offset).orderBy(orderBy, orderDir)
        .then(accounts => {
            res.status(200).json(accounts)
        })
        .catch(error => {
            res
                .status(500)
                .json("Error in getting accounts")
        });
})

server.get('/', (req, res) => {
    db('accounts')
        .then(accounts => {
            res.status(200).json(accounts)
        })
        .catch(error => {
            res
                .status(500)
                .json("Error in getting accounts")
        });
})


server.post('/', (req, res) => {
    db('accounts').insert({ name: req.body.name, budget: req.body.budget})
        .then(newId => {
            db('accounts').where({ id: newId[0] })
                .then(account => {
                    res.status(201).json(account[0])
                })
                .catch(error => {
                    res
                        .status(500)
                        .json("Error in getting the created account")
                });
        })
        .catch(error => {
            res
                .status(500)
                .json("Error in creating the  account")
        });
})

server.put('/:id', (req, res) => {
    db('accounts').where({ id: req.params.id }).update({ name: req.body.name, budget: req.body.budget})
        .then(numberOfUpdates => {
            db('accounts').where({ id: req.params.id })
                .then(account => {
                    res.status(200).json({message: `${numberOfUpdates} account has been successfully updated`, updatedAccount:account[0]})
                })
                .catch(error => {
                    res
                        .status(500)
                        .json("Error in getting the updated account")
                });
        })
        .catch(error => {
            res
                .status(500)
                .json("Error in updating the  account")
        });
})

server.delete('/:id', (req, res) => {
    db('accounts').where({ id:req.params.id }).del()
        .then(amtDeleted => {
            res
                .status(200)
                .json({message: `${amtDeleted} account has been deleted.`})
        })
        .catch(error => {
            res
                .status(500)
                .json("Error in deleting the account")
        });
})

server.get('/:id', (req, res) => {
    db('accounts').where({ id:req.params.id })
        .then(account => {
            res
                .status(200)
                .json(account[0])
        })
        .catch(error => {
            res
                .status(500)
                .json("Error in getting the account")
        });
})

module.exports = server;