import { Router } from 'express';
import { userLoginSchema, userRegisterSchema } from '../utils/zod';
import { LoggedRequest } from '../utils/types';
import { validate } from '../middlewares/validation';
import { getUser, login, register } from '../controllers/user_controller';
import { authenticated } from '../middlewares/auth';

const router = Router();

/**
 * /user/register : Register a new user
 */
router.post(
    '/register',
    validate(userRegisterSchema, 'body'),
    async (req, res) => {
        register(req, res);
    }
);

/**
 * /user/login : Login a user
 */
router.post(
    '/login',
    validate(userLoginSchema, 'body'),
    async (req, res) => {
        login(req, res);
    }
);

/**
 * /user/me : Information about the logged user
 */
router.get(
    '/me',
    authenticated,
    async (req, res) => {
        const loggedReq = req as LoggedRequest;

        getUser(loggedReq, res);
    }
);


export default router;