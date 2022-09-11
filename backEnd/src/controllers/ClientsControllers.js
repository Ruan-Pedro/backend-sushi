const Client = require('../models/Clients');

const getClients = async (req, res) => {
  switch (req.user.privilege) {
    case 'cliente':
      return res.status(401).send({ error: "Acess Denied" });

    case 'operador' || 'admin':
      try {
        let clients = await Client.find();
        if (!clients) res.status(404).send({ msg: "Clients not found" });
        res.status(200).send(clients);
      } catch (error) {
        console.error(error);
        res.status(404).send({ error: "Clients not found" });
      }
  }
}
const getClientById = async (req, res) => {
  const id = req.params.id;
  if (!id) id = req.body.id;

  switch (req.user.privilege) {
    case 'cliente':
      return res.status(401).send({ error: "Acess Denied" });

    case 'operador' || 'admin':
      try {
        let client = await Client.findById(req.params.id);
        if (!client) res.status(404).send({ msg: "Client not found" });
        res.status(200).json({ data: client });
      } catch (error) {
        console.error(error);
        res.status(500).send({ error: "Internal Error" })
      }
  }
}
const getClient = async (req, res) => {
  let query = req.query;

  switch (req.user.privilege) {
    case 'cliente':
      return res.status(401).send({ error: "Acess Denied" });

    case 'operador' || 'admin':
      try {
        let clients = await Client.find(query);
        if (!clients) res.status(404).send({ msg: "Client not found" });
        res.status(200).send({ data: clients });
      } catch (error) {
        console.error(error);
        res.status(500).send({ error: "Internal Error" })
      }
  }
}

const insertClient = async (req, res) => {
  if (!req.body) res.status(500).send({ error: "User has to send data of a new client" });
  let client = new Client(req.body);

  switch (req.user.privilege) {
    case 'cliente':
      return res.status(401).send({ error: "Acess Denied" });

    case 'operador' || 'admin':
      try {
        let newClient = await client.save();
        res.status(200).send(newClient);
      } catch (error) {
        console.error(error);
        res.status(500).send({ error: "Internal Error" });
      }
  }
}
const updateClient = async (req, res) => {
  const client = await Client.findOneAndUpdate(req.params._id);
  if (!client) res.status(404).send({ msg: "Client not found" });

  switch (req.user.privilege) {
    case 'cliente':
      return res.status(401).send({ error: "Acess Denied" });

    case 'operador' || 'admin':
      try {
        Object.assign(client, req.body);
        client.save();
        res.status(200).send({ data: client });
      } catch (error) {
        console.error(error);
        res.status(500).send({ error: "Internal Error" });
      }
  }
}
// const deleteClient = async (req, res) => {
//   const client = await Client.findById(req.params._id);
//   if (!client) res.status(404).send({ msg: "Client not found" });

//   switch (req.user.privilege) {
//     case 'cliente':
//       return res.status(401).send({ error: "Acess Denied" });

//     case 'operador' || 'admin':
//       try {
//         client.remove();
//         res.status(200).send({ msg: "Client deleted successfully" });
//       } catch (error) {
//         console.error(error);
//         res.status(500).send({ error: "Internal Error" });
//       }
//   }
// }
const setStatus = async (req, res) => {
  const client = await Client.findByIdAndUpdate(req.params.id);
  if (!client) res.status(404).send({ msg: "Client not found" });

  switch (req.user.privilege) {
    case 'cliente':
      return res.status(401).send({ error: "Acess Denied" });

    case 'operador' || 'admin':
      try {
        Object.assign(client, { status: !client.status });
        client.save();
        res.status(200).send({ data: client });
      } catch (error) {
        console.error(error);
        res.status(500).send({ error: "Internal Error" });
      }
  }
}

module.exports = {
  getClients,
  getClientById,
  getClient,
  insertClient,
  updateClient,
  setStatus
  // deleteClient
}