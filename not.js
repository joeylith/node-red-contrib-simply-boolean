module.exports = function(RED) {

    function NotNode(config) {
        RED.nodes.createNode(this, config);

        var node = this;
    
        node.topic = config.topic;

        node.parsePayload = require('./parse-payload.js');

        node.on('input', function(msg) {
            var ret = ! node.parsePayload(msg.payload);

            var status = {fill : ret ? "green" : "red",
                         shape : "dot",
                         text : ret ? "True" : "False"};

            node.status(status);

            var context = this.context();

            if (context.timer) clearTimeout(context.timer);

            context.flow.ringstatus_timeout = context.flow.ringstatus_timeout || 120000;

            context.timer =
                setTimeout(function() {
                    node.status({
                        fill: status.fill,
                        text: status.text,
                        shape: "ring"
                    });
                }, context.flow.ringstatus_timeout);

            msg.topic = node.topic + msg.topic;
            msg.payload = ret;

            node.send(msg);
        });
    }

    RED.nodes.registerType("not", NotNode);

}
