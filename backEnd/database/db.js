const mongoose = require('mongoose');
module.exports = connect = async () => {
    try {
        const connectionParams = {
            useNewUrlParser: true,
            useUnifiedTopology: true
        };
        await mongoose.connect(process.env.MONGOURL, connectionParams)
        console.log("[HTTP] Database is connected successfully");
    } catch (error) {
        console.error(error, "[HTTP] database connection failed");
    }
}