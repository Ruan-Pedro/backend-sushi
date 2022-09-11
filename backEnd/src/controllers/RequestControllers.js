const Request = require('../models/Requests');
const Menu = require('../models/Menu');
const User = require('../models/Users');
const date = require('../utils/date');
let moment = require('moment-timezone');
const Clients = require('../models/Clients');
let dateNow = moment.tz('America/Sao_Paulo').format('MMMM Do YYYY, h:mm:ss a');

const getRequests = async (req, res) => {
    if (!req.headers.authorization) return res.status(401).send({ error: "Acess Denied" });

    switch (req.user.privilege) {
        case 'cliente':
            req.query['clientId'] = req.user.id;
            try {
                let requests = await Request.find(req.query);
                if (!requests) res.status(404).send({ error: 'Requests not found' });

                res.status(200).send({
                    data: requests.map((req) => ({
                        id: req.id,
                        tipo: req.type,
                        tipo: req.type,
                        pedidos: req.menu,
                        menuIds: req.menuId,
                        clientId: req.clientId,
                        preco: req.price,
                        situação: req.status,
                        forma_pagamento: req.peymentMethod,
                        endereco: req.addres,
                        criado_em: moment.tz(req.createdAt, 'America/Sao_Paulo')
                    })
                    )
                });
            } catch (error) {
                console.error(error);
                res.status(500).send({ error: 'Fail in read requests' });
            }
            break;

        case 'entregador':
            req.query['deliveryManId'] = req.user.id;
            try {
                let requests = await Request.find(req.query);
                if (!requests) res.status(404).send({ error: 'Requests not found' });

                res.status(200).send({
                    data: requests.map((req) => ({
                        id: req.id,
                        tipo: req.type,
                        tipo: req.type,
                        pedidos: req.menu,
                        menuIds: req.menuId,
                        clientId: req.clientId,
                        preco: req.price,
                        situação: req.status,
                        forma_pagamento: req.peymentMethod,
                        endereco: req.addres,
                        criado_em: moment.tz(req.createdAt, 'America/Sao_Paulo')
                    })
                    )
                });
            } catch (error) {
                console.error(error);
                res.status(500).send({ error: 'Fail in read requests' });
            }
            break;

        case 'operador': case 'admin':
            try {
                let requests = await Request.find(req.query);
                if (!requests) res.status(404).send({ error: 'Requests not found' });
                res.status(200).send({
                    data: requests.map((req) => ({
                        id: req.id,
                        tipo: req.type,
                        tipo: req.type,
                        pedidos: req.menu,
                        menuIds: req.menuId,
                        clientId: req.clientId,
                        preco: req.price,
                        situação: req.status,
                        forma_pagamento: req.peymentMethod,
                        endereco: req.addres,
                        criado_em: moment.tz(req.createdAt, 'America/Sao_Paulo')
                    })
                    )
                });
            } catch (error) {
                console.error(error);
                res.status(500).send({ error: 'Fail in read requests' });
            }
            break;
    }
}

const getRequest = async (req, res) => {
    if (!req.headers.authorization) return res.status(401).send({ error: "Acess Denied" });

    switch (req.user.privilege) {
        case 'cliente':
            try {
                let request = await Request.findById(req.params.id);
                if (!request || request.clientId != req.user.id) res.status(404).send({ error: 'Request not found' });

                res.status(200).send({ data: request });
            } catch (error) {
                console.error(error);
                res.status(500).send({ error: 'Fail in read requests' });
            }
            break;

        case 'entregador':
            try {
                let request = await Request.findById(req.params.id);
                if (!request || request.deliveryManId != req.user.id) res.status(404).send({ error: 'Requests not found' });

                res.status(200).send({ data: requests });
            } catch (error) {
                console.error(error);
                res.status(500).send({ error: 'Fail in read requests' });
            }
            break;

        case 'operador': case 'admin':
            try {
                let request = await Request.findById(req.body.id);
                if (!request) res.status(404).send({ error: 'Requests not found' });

                res.status(200).send({ data: request });
            } catch (error) {
                console.error(error);
                res.status(500).send({ error: 'Fail in read requests' });
            }
            break;
    }
}

const makeRequest = async (req, res) => {
    if (!req.body.menu && !req.body.drink) return res.status(404).send({ msg: 'Menu or drink is required' });
    switch (req.user.privilege) {
        case 'entregador':
            res.status(401).send({ error: "Acess Denied" });
            break;
        case 'cliente':
            try {
                let menu = await Menu.find({ name: req.body.menu });
                if (!menu) return res.status(404).send({ msg: 'Menu not found' });

                let client = await Clients.find({ id: req.user.id });
                if (!client) return res.status(404).send({ msg: 'Client not found' });

                let price = req.body.tax ? parseInt(req.body.tax) : 0;
                let menuIds = [];
                menu.map((menu) => {
                    price += menu.price;
                    menuIds.push(menu.id);
                });
                if (req.body.type == 'delivery') {
                    let request = new Request({
                        type: 'delivery',
                        menu: req.body.menu,
                        menuId: menuIds,
                        client: req.user.name,
                        clientId: req.user.id,
                        price,
                        deliveryTax: req.body.tax,
                        paymentMethod: req.body.peyment,
                        address: req.body.address ? req.body.address : client.address
                    })
                    try {
                        let newRequest = await request.save();
                        return res.status(201).send({ msg: 'Request sended successfully', newRequest });
                    } catch (error) {
                        console.error(error);
                        return res.status(500).send({ error: 'Fail in make request' });
                    }
                }

                if (req.body.type == 'withdrawal') {
                    let request = new Request({
                        type: 'withdrawal',
                        menu: req.body.menu,
                        menuId: menuIds,
                        clientId: req.user.id,
                        price,
                        paymentMethod: req.body.peyment,
                    })
                    try {
                        let newRequest = await request.save();
                        return res.status(200).send({ msg: 'Request sended successfully', newRequest });
                    } catch (error) {
                        console.error(error);
                        return res.status(500).send({ error: 'Fail in make request' });
                    }
                }

            } catch (error) {
                console.error(error);
                res.status(500).send({ error: 'Internal Error' });
            }

        case 'operador':
        case 'admin':
            try {
                let menu = await Menu.find({ name: req.body.menu });
                if (!menu) return res.status(404).send({ msg: 'Menu not found' });

                let client = await User.findById(req.body.clientId);
                if (!client) return res.status(404).send({ msg: 'Client not found' });

                let price = req.body.tax ? parseInt(req.body.tax) : 0;
                let menuIds = [];
                menu.map((menu) => {
                    price += menu.price;
                    menuIds.push(menu.id);
                });
                if (req.body.type == 'delivery') {
                    let request = new Request({
                        type: 'delivery',
                        menu: req.body.menu,
                        menuId: menuIds,
                        status: 'em preparo',
                        client: client.name,
                        clientId: client.id,
                        price,
                        deliveryTax: req.body.tax,
                        deliveryManId: req.body.deliveryManId,
                        paymentMethod: req.body.peyment,
                        address: req.body.address
                    })
                    try {
                        let newRequest = await request.save();
                        res.status(200).send({ msg: 'Request sended successfully', newRequest });
                    } catch (error) {
                        console.error(error);
                        res.status(500).send({ error: 'Fail in make request' });
                    }
                }

                if (req.body.type == 'withdrawal') {
                    let request = new Request({
                        type: 'withdrawal',
                        menu: req.body.menu,
                        menuId: menuIds,
                        status: 'em preparo',
                        client: client.name,
                        clientId: client.id,
                        price,
                        paymentMethod: req.body.peyment,
                    })
                    try {
                        let newRequest = await request.save();
                        res.status(200).send({ msg: 'Request sended successfully', newRequest });
                    } catch (error) {
                        console.error(error);
                        res.status(500).send({ error: 'Erro ao enviar pedido' });
                    }
                }

            } catch (error) {
                console.error(error);
                res.status(500).send({ error: 'Internal Error' });
            }
            break;
    }
}

const confirmRequest = async (req, res) => {
    if (!req.headers.authorization) return res.status(401).send({ error: "Acess Denied" });

    switch (req.user.privilege) {
        case 'cliente':
        case 'entregador':
            return res.status(401).send({ error: 'Access Denied' });
        case 'admin':
        case 'operador':
            let request = await Request.findByIdAndUpdate(req.params.id);
            if (!request) return res.status(404).send({ error: 'Request not found' });
            try {
                if (request.type == 'withdrawal') {
                    try {
                        Object.assign(request, {
                            status: req.body.status,
                            preparationTime: req.body.preparationTime,
                        });
                        request.save();
                        res.status(200).send({ msg: `Pedido alterado para ${req.body.status}` });
                    } catch (error) {
                        console.error(error);
                        res.status(500).send({ error: "Fail in confirm withdrawal request" });
                    }

                }
                if (request.type == 'delivery') {
                    try {
                        Object.assign(request, {
                            status: req.body.status,
                            preparationTime: req.body.preparationTime,
                            deliveryManId: req.body.deliveryManId
                        });
                        request.save();
                        res.status(200).send({ msg: `Pedido alterado para ${req.body.status}` });
                    } catch (error) {
                        console.error(error);
                        res.status(500).send({ error: "Fail in confirm delivery request" });
                    }
                }
            } catch (error) {
                console.error(error);
                res.status(500).send({ error: 'Internal Error' });
            }
            break;
    }
}

const updateRequest = async (req, res) => {
    if (!req.headers.authorization) return res.status(401).send({ error: "Acess Denied" });

    switch (req.user.privilege) {
        case 'cliente':
        case 'entregador':
            return res.status(401).send({ error: 'Access Denied' });
        case 'admin':
        case 'operador':
            try {
                let request = await Request.findByIdAndUpdate(req.params.id, req.body);
                if (!request) return res.status(404).send({ error: 'Request not found' });
                res.status(200).send({ data: request });
            } catch (error) {
                console.error(error);
                res.status(500).send({ error: 'Internal Error' });
            }
            break;
    }
}

const finalizeOrder = async (req, res) => {
    if (!req.headers.authorization) return res.status(401).send({ error: "Acess Denied" });

    let request = await Request.findById(req.params.id);
    if (!request) return res.status(401).send({ error: "Acess Denied" });

    switch (req.user.privilege) {
        case 'cliente':
            if (request.clientId != req.user.id) return res.status(401).send({ error: 'Access Denied' });
            try {
                Object.assign(request, { status: 'entregue' });
                request.save();
                res.status(200).send({ msg: `Pedido alterado para ${request.status}` });
            } catch (error) {
                console.error(error);
                res.status(500).send({ error: "Fail in finalize request" });
            }
            break;
        case 'entregador':
            if (request.deliveryManId != req.user.id || request.type == 'withdrawal') return res.status(401).send({ error: 'Access Denied' });
            try {
                Object.assign(request, { status: 'entregue' });
                request.save();
                res.status(200).send({ msg: `Pedido alterado para ${request.status}` });
            } catch (error) {
                console.error(error);
                res.status(500).send({ error: "Fail in finalize request" });
            }
            break
        case 'admin':
        case 'operador':
            try {
                Object.assign(request, { status: 'entregue' });
                request.save();
                res.status(200).send({ msg: `Pedido alterado para ${request.status}` });
            } catch (error) {
                console.error(error);
                res.status(500).send({ error: "Fail in finalize request" });
            }
            break;
    }
}

module.exports = {
    getRequests,
    getRequest,
    makeRequest,
    updateRequest,
    confirmRequest,
    finalizeOrder
}