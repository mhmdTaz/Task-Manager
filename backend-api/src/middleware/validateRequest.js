const AppError = require('../shared/errors/AppError');

const validateRequest = (schema, source = 'body') => {
  return (req, _res, next) => {
    const { error, value } = schema.validate(req[source], {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      const messages = error.details.map((detail) => detail.message).join(', ');
      return next(new AppError(messages, 400));
    }

    req[source] = value;
    next();
  };
};

module.exports = validateRequest;
