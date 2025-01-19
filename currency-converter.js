const axios = require('axios');

const getExchangeRate1 = (fromCurrency, toCurrency) => {
    axios.get(`https://api.currencylayer.com/live?access_key=a706922e6dfbda25b00fd4be876021c3&format=1&source=${fromCurrency}`).then((response) => {
        const quotes = response.data.quotes;

        console.log(quotes[`${fromCurrency}${toCurrency}`]);
    })
}

const getExchangeRate2 = async (fromCurrency, toCurrency) => {
    const response = await axios.get(`https://api.currencylayer.com/live?access_key=a706922e6dfbda25b00fd4be876021c3&format=1&source=${fromCurrency}`)
    const quotes = response.data.quotes;
    const exchangeRate = quotes[`${fromCurrency}${toCurrency}`];

    if (isNaN(exchangeRate)) {
        throw new Error(`Unable to get exchange rate for ${fromCurrency} and ${toCurrency}`);
    }

    return exchangeRate;
}

// ============================================================================================================
const getCountries1 = async (toCurrency) => {
    try {
        const response = await axios.get(`https://restcountries.com/v3.1/currency/${toCurrency}`)
        
        return response.data.map((country) => country.name.official);
    } catch(error) {
        throw new Error(`Unable to get countries for ${toCurrency}`);
    }
}

// ============================================================================================================

const convertCurrency = async (fromCurrency, toCurrency, amount) => {
    const countries = await getCountries1(toCurrency);
    const exchangeRate = await getExchangeRate2(fromCurrency, toCurrency);
    const convertedCurrency = (amount * exchangeRate).toFixed(2);

    return `${amount} ${fromCurrency} is worth ${convertedCurrency} ${toCurrency}. You can spent these in following countries: ${countries}`
}

convertCurrency('IDR', 'USDD', 1_000_000).then((response) => {
    console.log(response);
}).catch((error) => {
    console.log(error.message);
});