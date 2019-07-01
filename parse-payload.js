module.exports = function(payload) {
    if (typeof payload === 'boolean') return payload;

    switch(payload.toLowerCase().trim()) {
        case "off": case "false": case "no": case "0": case "": return false; 
        default: return true;
    }
}
