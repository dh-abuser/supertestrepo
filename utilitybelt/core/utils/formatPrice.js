
core.utils._formatPrice = function(currency, onLeft, price) {
    if (price) {
        var string = price.toFixed(2);
        if (onLeft) {
            string = currency + string;
        } else {
            string += currency;
        }
        return string;
    }
    else
        return '';
};

core.utils.formatPrice = function(price) {
    var locale = core.locales[APP_LANGUAGE];
    return core.utils._formatPrice(locale.currency.symbol, locale.currency.position == 'left', price);
}

core.utils.formatPriceWithoutCurrency = function(price) {
    return core.utils._formatPrice('', false, price);
}

var jsFormatPrice = core.utils.formatPrice;
