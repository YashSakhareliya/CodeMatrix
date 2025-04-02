import { body, param, validationResult }  from 'express-validator';
import { ObjectId } from 'mongodb'

const validateObjectId = (fieldName, location = 'body') => {
    const validator = location === 'body' ? body : param;

    return [
        validator(fieldName)
            .notEmpty().withMessage(`${fieldName} is required`)
            .custom(value => ObjectId.isValid(value)).withMessage(`Invalid ${fieldName} format`),

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