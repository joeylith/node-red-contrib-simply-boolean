module.exports = function(RED) {

    function AndNode(config) {
        RED.nodes.createNode(this, config);

        var node = this;
    
        node.parsePayload = function(payload) {
            if (typeof payload === 'boolean') return payload;

            switch(payload.toLowerCase().trim()) {
                case "off": case "false": case "no": case "0": case "": return false; 
                default: return true;
            }
        }

        node.on('input', function(msg) {
            var context = this.context();

            if (msg.topic == 'reset' && msg.payload == 'reset') {
                context.dict = {};
                return;
            }

            context.dict = context.dict || {};

            var id = msg[config.identifier];

            id = id || 'IdNotFound';

            context.dict[id] = node.parsePayload(msg.payload);

            var ret = true;

            var keys = Object.keys(context.dict);

            if (keys.length < config.minitems) return;

            keys.forEach(function(key){
                var val = context.dict[key];
                ret = ret && val;
            });

            node.status({fill : ret ? "green" : "red",
                         shape : ret ? "dot" : "ring",
                         text : ret ? "True" : "False"});

            node.send({
                topic: config.topic,
                payload: ret,
                debug: context.dict
            });
        });
    }

    RED.nodes.registerType("and", AndNode);
}
