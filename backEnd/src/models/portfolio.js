let projects = [
    {
      nome: "rotech",
      tech: "angular + node + SQL",
      url: "https://github.com/Ruan-Pedro/inventario-de-roteadores",
      text: "Bacon ipsum dolor amet hamburger venison prosciutto capicola shoulder meatball jerkys",
      img: "https://devporai.com.br/wp-content/uploads/2020/06/Copy-of-Copy-of-Travel-Photography.png",
    },
    {
      nome: "webDev",
      tech: "HTML5 + CSS3 + vanillaJS",
      url: "https://ruandevweb.com/",
      text: "Bacon ipsum dolor amet hamburger venison prosciutto capicola shoulder meatball jerkys",
      img: "https://i.ytimg.com/vi/TqeQ0_5jnUI/hqdefault.jpg",
    },
    {
      nome: "hauzfy",
      tech: "angular + node + SQL",
      url: "https://www.hausz.com.br/",
      text: "Bacon ipsum dolor amet hamburger venison prosciutto capicola shoulder meatball jerkys",
      img: "data:image/png;base64,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",
    },
    {
      nome: "OMNE",
      tech: "laravel + node + MySQL",
      url: "https://www.callflex.com.br/solucoes/omnichannel/",
      text: "Bacon ipsum dolor amet hamburger venison prosciutto capicola shoulder meatball jerkys",
      img: "https://www.callflex.com.br/assets/img/solucao-omnechannel.svg",
    },
    {
      nome: "IBM-teste",
      tech: "Angular + Node + MySQL",
      url: "https://github.com/Ruan-Pedro/IBM-project",
      text: "Bacon ipsum dolor amet hamburger venison prosciutto capicola shoulder meatball jerkys",
      img: "https://pbs.twimg.com/profile_images/1428368847405469696/QC5Ifn4C_400x400.jpg",
    },
  ];
module.exports = projects