module.exports = function(RED) {

    function AndNode(config) {
        RED.nodes.createNode(this, config);

        var node = this;

        node.on('input', function(msg) {
            this.context.dict = this.context.dict || {};

            msg.topic = msg.topic || 'Topic';
            this.context.dict[msg.topic] = msg.payload;

            var ret = true;

            var keys = Object.keys(this.context.dict);

            keys.forEach(function(key){
                var val = this.context.dict[key];
                ret = ret && val;
            });

            node.status({fill : ret ? "green" : "red",
                         shape : "dot",
                         text : ret ? "True" : "False"});

            msg.topic = node.name;
            msg.payload = ret;
            msg.debug = this.context.dict;

            node.send(msg);
        });
    }

    RED.nodes.registerType("and", AndNode);

}
