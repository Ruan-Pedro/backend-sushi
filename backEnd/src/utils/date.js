let date = new Date();
const adicionaZero = (numero) => {
  if (numero <= 9) return "0" + numero
  else return numero; 
}
module.exports = adicionaZero(date.getDate().toString()) + "/" + (adicionaZero(date.getMonth()+1).toString()) + "/" + date.getFullYear().toString() + " (" + adicionaZero(date.getHours().toString()) + ":" + adicionaZero(date.getMinutes().toString()) + ":" + adicionaZero(date.getSeconds().toString()) + ")";
