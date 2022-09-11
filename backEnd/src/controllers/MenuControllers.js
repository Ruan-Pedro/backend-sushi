const realFormatter = require('../utils/realFormatter');
const Menu = require('../models/Menu');
const { getRedis, setRedis } = require('../redisConfig');

//Busca Menu  (STATUS:TRUE) => só para clientes || (STATUS:FALSE) => para operadores e admins
const getMenu = async (req, res) => {
    if (!req.headers.authorization) {
        req.query["status"] = true;
        req.query.price ? parseInt(req.query.price) : null;
        try {
            let menu = await Menu.find(req.query);
            if (!menu) res.status(404).send({ msg: "Menu not found" });
            res.status(200).send({
                data: menu.map((data) => ({
                    id: data.id,
                    name: data.name,
                    price: data.price,
                    type: data.type,
                    url_image: data.url_image
                }))
            });
        } catch (error) {
            console.error({ error: error });
            res.status(500).send({ error: "Internal Error" });
        }
    } else {
        switch (req.user.privilege) {
            case 'cliente':
            case 'entregador':
                req.query["status"] = true;
                req.query.price ? parseInt(req.query.price) : null;
                try {
                    const cached = await getRedis(`menu-client`);
                    if (cached) return res.status(200).send({
                        data: (JSON.parse(cached)).map((data) => ({
                            id: data.id,
                            name: data.name,
                            price: data.price,
                            type: data.type,
                            url_image: data.url_image
                        })
                        )
                    });
                    let menu = await Menu.find(req.query);
                    if (!menu) res.status(404).send({ msg: "Menu not found" });
                    await setRedis(`menu-client`, JSON.stringify(menu), 60 * 15);
                    res.status(200).send({
                        data: menu.map((data) => ({
                            id: data.id,
                            name: data.name,
                            price: data.price,
                            type: data.type,
                            url_image: data.url_image
                        }))
                    });
                } catch (error) {
                    console.error({ error: error });
                    res.status(500).send({ error: "Internal Error" });
                }
                break;
            case 'operador':
            case 'admin':
                req.query.price ? parseInt(req.query.price) : null;
                try {
                    const cached = await getRedis(`menu-adm`);
                    if (cached) return res.status(200).send({ data: JSON.parse(cached) });

                    let menu = await Menu.find(req.query);
                    if (!menu) res.status(404).send({ msg: "Menu not found" });
                    await setRedis(`menu-adm`, JSON.stringify(menu), 60 * 15);
                    res.status(200).send({ data: menu });
                } catch (error) {
                    console.error(error);
                    res.status(500).send({ error: "Internal Error" });
                }
        }

    }
}

const getMenuById = async (req, res) => {
    const id = req.params.id;
    if (!req.headers.authorization) {
        let menu = await Menu.findById(id);
        if (!menu) res.status(404).send({ msg: "Menu not found" });
        res.status(200).send(
            Array(menu).map((data) => ({
                id: data.id,
                name: data.name,
                price: data.price,
                type: data.type,
                url_image: data.url_image
            }))
        );
    } else {
        switch (req.user.privilege) {
            case 'cliente':
            case '':
                let menu = await Menu.findById(id);
                if (!menu) res.status(404).send({ msg: "Menu not found" });

                res.status(200).send(
                    Array(menu).map((data) => ({
                        id: data.id,
                        name: data.name,
                        price: data.price,
                        type: data.type,
                        url_image: data.url_image
                    }))
                );
                break;

            case 'operador':
            case 'admin':
                try {
                    let menu = await Menu.findById(id);
                    if (!menu) res.status(404).send({ msg: "Menu not found" });
                    res.status(200).send({ data: menu });
                } catch (error) {
                    console.error(error);
                    res.status(500).send({ error: "Internal Error" });
                }
        }
    }
}

const insertMenu = async (req, res) => {
    if (!req.body) res.status(400).send({ error: "User has to send data of a new menu" });

    switch (req.user.privilege) {
        case 'cliente':
        case 'entregador':
            res.status(401).send({ error: "Acess Denied" });
            break;

        case 'operador':
        case 'admin':
            const menu = new Menu({
                name: req.body.name,
                ingredients: req.body.name,
                subtitle: req.body.subtitle,
                price: req.body.price,
                type: req.body.type,
                url_image: req.body.url_image
            });
            try {
                const newMenu = await menu.save();
                if (!newMenu) return res.status(500).send({ error: "Internal Error" });

                res.status(201).send(newMenu);
            } catch (error) {
                console.error(error);
                res.status(500).send({ error: "Internal Error" });
            }
    }
}

const updateMenu = async (req, res) => {
    const menu = await Menu.findOneAndUpdate(req.params.id);
    if (!menu) res.status(404).send({ msg: "Menu not found" });

    switch (req.user.privilege) {
        case 'cliente':
            res.status(401).send({ error: "Acess Denied" });
            break;

        case 'operador' || 'admin':
            let menu = new Menu(req.body);
            try {
                Object.assign(menu, req.body);
                menu.save();
                res.status(200).send({ data: menu });
            } catch (error) {
                console.error(error);
                res.status(500).send({ error: "Internal Error" });
            }
    }
}
const setStatus = async (req, res) => {
    const menu = await Menu.findById(req.params.id);
    if (!menu) res.status(404).send({ msg: "Menu not found" });

    switch (req.user.privilege) {
        case 'cliente':
            res.status(401).send({ error: "Acess Denied" });
            break;

        case 'operador' || 'admin':
            try {
                Object.assign(menu, { status: !menu.status });
                menu.save();
                res.status(200).send({ data: menu });
            } catch (error) {
                console.error(error);
                res.status(500).send({ error: "Internal Error" });
            }
    }
}

module.exports = {
    getMenu,
    getMenuById,
    insertMenu,
    updateMenu,
    setStatus
}