import { body, validationResult }  from 'express-validator';
import { ObjectId } from 'mongodb'

const validateObjectId = (fieldName) => {
    return [
        body(fieldName)
            .notEmpty().withMessage(`${fieldName} is required`)
            .custom(value => ObjectId.isValid(value)).withMessage(`Invalid ${fieldName} format`),

        // Middleware to check validation result
        (req, res, next) => {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }
            next();
        }
    ];
};

export default validateObjectId;