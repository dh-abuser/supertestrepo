/**
 * returns the item name with superscript ingredients *1*2*3 
 * @param {String} itemString
 * @return text 
 */
core.utils.formatItem = function (itemString){
    return itemString.replace(/(\*\d[*\d]+)/g, "<sup style='vertical-align:super; font-size:smaller'>$1</sup>"); 
}
