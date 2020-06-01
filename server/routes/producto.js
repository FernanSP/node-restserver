const express = require('express');

const { verificaToken } = require('../middlewares/autenticacion');

let app = express();

let Producto = require('../models/producto');

//==============================
// Obtener todos los productos
//==============================

app.get('/productos', verificaToken, (req, res) => {
    //trae todos los productos
    //populate: usuario categoria
    //paginado
    let desde = req.query.desde || 0;
    desde = Number(desde);

    Producto.find({ disponible: true })
        .skip(desde)
        .limit(5)
        //.sort('nombre')
        //.populate(['usuario', 'categoria'], ['nombre email', 'descripcion'])
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
        .exec((err, producto) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                producto
            });


        });
});

//==============================
// Obtener un producto por id
//==============================

app.get('/productos/:id', verificaToken, (req, res) => {
    //populate: usuario categoria

    let id = req.params.id;

    Producto.findById(id)
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
        .exec((err, productoDB) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            if (!productoDB) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        mensaje: 'El producto no es válido'
                    }
                });
            }

            res.json({
                ok: true,
                producto: productoDB
            });


        });

});

//==============================
// Buscar productos
//==============================

app.get('/productos/buscar/:termino', verificaToken, (req, res) => {

    let termino = req.params.termino;

    let regex = new RegExp(termino, 'i');

    Producto.find({ nombre: regex })
        .populate('categoria', 'nombre')
        .exec((err, productos) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                productos
            })

        })
})

//==============================
// Crear un nuevo producto
//==============================

app.post('/productos', verificaToken, (req, res) => {
    //grabar el usuario 
    //grabar una categoria del listado
    let body = req.body;

    let producto = new Producto({
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        disponible: body.disponible,
        categoria: body.categoria,
        usuario: req.usuario._id
    });

    producto.save((err, productoDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.status(201).json({
            ok: true,
            producto: productoDB
        });

    });

});

//==============================
// Actualizar un producto
//==============================

app.put('/productos/:id', verificaToken, (req, res) => {
    //grabar el usuario 
    //grabar una categoria del listado
    let id = req.params.id;
    let body = req.body;

    let descProducto = {
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        disponible: body.disponible,
        categoria: body.categoria
    };

    Producto.findByIdAndUpdate(id, descProducto, { new: true, runValidators: true, useFindAndModify: false }, (err, productoDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    mensaje: 'El producto no es válido'
                }
            });
        }
        res.json({
            ok: true,
            producto: productoDB
        });
    });


    // Producto.findById((err, productoGuardad) => {
    //     productoDB.nombre = body.nombre;
    //     productoDB.precioUni = body.precioUni;
    //     productoDB.categoria = body.categoria;
    //     productoDB.disponible = body.disponible;
    //     productoDB.descripcion = body.descripcion;

    //     productoDB.save((err, productoGuardado) => {
    //         if (err) {
    //             return res.status(500).json({
    //                 ok: false,
    //                 err
    //             });
    //         }
    //         res.json({
    //             ok: true,
    //             producto: productoGuardado
    //         });
    //     })
    // });

});

//==============================
// Borrar un producto
//==============================

app.delete('/productos/:id', verificaToken, (req, res) => {
    //grabar el usuario 
    //grabar una categoria del listado
    let id = req.params.id;

    //Producto.useFindAndDelete(id, { useFindAndModify: false }, (err, productoDB) => {
    Producto.findById(id, (err, productoDB) => {


        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    mensaje: 'El producto no es válido'
                }
            });
        }

        productoDB.disponible = false;

        productoDB.save((err, productoBorrado) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                producto: productoBorrado,
                mensaje: 'Producto borrado'
            });
        })

    })
});



module.exports = app;