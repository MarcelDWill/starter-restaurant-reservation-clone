function hasProperties(...properties) {//takes in a list of properties
    return function (req, res, next) {//returning a function that takes in the request, response, and next function
      const { data = {} } = req.body;//destructure the data object from the request body
  
      try {
        properties.forEach((property) => {
          if (!data[property]) {//if the property is not in the data object
            const error = new Error(`A '${property}' property is required.`);
            error.status = 400;
            throw error;
          }
        });
        next();
      } catch (error) {
        next(error);
      }
    };
  }
  
  module.exports = hasProperties;