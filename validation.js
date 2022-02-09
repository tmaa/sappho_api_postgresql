const Joi = require('joi');

//Register validation
const registerValidation = (data) => {
  const schema = Joi.object({
    id: Joi.string().required(),
    name: Joi.string().max(50).required(),
    dob: Joi.date().required(),
    height: Joi.number().required(),
    email: Joi.string().required(),
    phone: Joi.string(),
    coordinates: Joi.object()
  })

  return schema.validate(data);
}

module.exports.registerValidation = registerValidation;