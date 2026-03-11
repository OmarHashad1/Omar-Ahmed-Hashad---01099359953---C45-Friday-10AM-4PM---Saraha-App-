const dataSources = ["body", "params", "query", "file", "files"];
export const validate = (schema) => {
  return (req, res, next) => {
    let validationErrors = [];
    dataSources.forEach((source) => {
      if (!schema[source]) return;
      const payload = schema[source].validate(req[source], {
        abortEarly: false,
        convert: false,
      });
      if (payload.error)
        validationErrors.push({
          [source]: payload.error.details.map((err) => err.message),
        });
    });

    if (validationErrors.length) {
      res
        .status(423)
        .json({ message: "validation failed", data: { ...validationErrors } });
    }

    next();
  };
};
