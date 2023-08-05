const Joi = require('joi')

module.exports.proverbSchema = Joi.object({
    proverb: Joi.object({
        title: Joi.string().required(),
        author: Joi.string().required()
    }).required()
});