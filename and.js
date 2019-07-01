module.exports = function(RED) {

    function AndNode(config) {
        RED.nodes.createNode(this, config);

        var node = this;
    
        node.parsePayload = require('./parse-payload.js');

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

            var keys = Object.keys(context.dict);

            if (isNaN(config.minitems) || keys.length < config.minitems) return;

            var ret = keys.every((k) => context.dict[k]);

            var status = {fill : ret ? "green" : "red",
                         shape : "dot",
                         text : ret ? "True" : "False"};

            node.status(status);

            if (context.timer) clearTimeout(context.timer);

            context.timer =
                setTimeout(function() {
                    node.status({
                        fill: status.fill,
                        text: status.text,
                        shape: "ring"
                    });
                }, 30000);

            node.send({
                topic: config.topic,
                payload: ret,
                debug: context.dict
            });
        });
    }

    RED.nodes.registerType("and", AndNode);
}
