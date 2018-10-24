function lockPlugin(schema, modelName) {
    if (!modelName) {
        throw new Error('modelName is required');
    }

    schema.add({
        locked: {
            type: Date,
            default: Date.now
        }
    });

    schema.methods.lock = function (duration) {
        const now = new Date();
        const query = {
            _id: this._id,
            locked: {
                $lte: now
            }
        };
        const data = {
            locked: new Date(now.getTime() + duration)
        };
        const options = {
            new: true
        };
        return this.model(modelName).findOneAndUpdate(query, data, options);
    };

    schema.methods.release = function () {
        const query = {
            _id: this._id,
        };
        const data = {
            locked: new Date()
        };
        const options = {
            new: true
        };
        return this.model(modelName).findOneAndUpdate(query, data, options);
    };
}

module.exports = lockPlugin;
