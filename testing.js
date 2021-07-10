function maxProfit(costPerCut, salePrice, lengths) {
    var c = costPerCut;
    var s = salePrice;
    var l = lengths;

    var minLength = 1
    var maxLength = Math.max(lengths);
    var profits = []

    function profit(sp, tur, sl, tc, cp) {
        return ((sp*tur*sl) - (tc*cp))
    }

    let j = minLength;

    while (j < maxLength) {
        var cuts = 0;
        var profitNum = 0;
        var uf = 0;
        for (let i = 0; i < lengths.length; i++){
            let p = Math.floor(lengths[i] / j);
            cuts += p;
            uf += p;
            if (j === lengths[i]) {
                cuts = cuts - 1;
            }
        }
        profitNum = profit(s, uf, j, c, cuts);
        console.log(profitNum);
        profits.push(profitNum);
        j++;
    }

    return Math.max(profits);

    // Write your code here

}

maxProfit(10, 100, [30,60,90]);
