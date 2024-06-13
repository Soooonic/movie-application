function getHighestRate(rates) {
    if (rates.length === 0) return 0;
    return Math.max(...rates.map(rate => rate.rate));
}