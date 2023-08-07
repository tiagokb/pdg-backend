exports.experienceToEndurance = (x) => {

    //using sigmoid method
    const scaledX = x / 500;
    const endurance = 1 - scaledX * 0.9;
    const roundedEndurance = Math.round(endurance * 100) / 100;

    if (roundedEndurance > 1) {
        return 1;
    } else if (roundedEndurance < 0.1) {
        return 0.1
    }  else return roundedEndurance;
}

exports.calculateCatchChance = (BaseChance, endurance, itemPercentage) => {
    const realChance = BaseChance * endurance + itemPercentage;
    return Math.round(realChance * 100) / 100;
}

exports.playerCatchesPokemon = (chanceToCatch) => {
    const randomNum = Math.round(Math.random() * 100) / 100;
    return randomNum <= chanceToCatch;
}

exports.paginate = (list, resultsPerPage) => {
    const totalPages = Math.ceil(list.length / resultsPerPage);
    const paginatedTokens = [];
  
    for (let page = 1; page <= totalPages; page++) {
      const startIndex = (page - 1) * resultsPerPage;
      const endIndex = startIndex + resultsPerPage;
      const tokensPage = list.slice(startIndex, endIndex);
      paginatedTokens.push(tokensPage);
    }
  
    return { totalPages, tokens: paginatedTokens };
  };