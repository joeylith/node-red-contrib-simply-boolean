module.exports = function(RED) {

    function AndNode(config) {
        RED.nodes.createNode(this, config);

        var node = this;
    
        node.topic = config.topic;
        node.identifier = config.identifier;

        node.parsePayload = function(payload) {
            if (typeof payload === 'boolean') return payload;

            switch(payload.toLowerCase().trim()) {
                case "off": case "false": case "no": case "0": case "": return false; 
                default: return true;
            }
        }

        node.on('input', function(msg) {
            var ret = ! node.parsePayload(msg.payload);

            node.status({fill : ret ? "green" : "red",
                         shape : ret ? "dot" : "ring",
                         text : ret ? "True" : "False"});

            msg.payload = ret;

            node.send(msg);
        });
    }

    RED.nodes.registerType("not", AndNode);

}
