const sushiHome = (req,res)=>{
    try{
        req.user ? res.status(200).send(`Bem vindo ao sushi mania, ${req.user.displayName}`) : res.status(200).send(`Bem vindo ao sushi mania`);
    }catch(error){
        console.log(error)
        res.send("Houve um erro")
    }
}
module.exports = { sushiHome }