const validateLogin = (schema) => async (req, res, next) => {
    try {
        const parseBody = await schema.parseAsync(req.body);
        req.body = parseBody;
        next();
    }
    catch (err) {
        const status = 404;
        const message = err.errors[0].message;
        const extraDetails = err.errors[0].message;
        console.log(extraDetails);
        const errorDetails = {
            message,
            status,
            extraDetails
        }
        next(errorDetails);
    }
};

export default validateLogin;