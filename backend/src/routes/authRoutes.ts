import express, { Request, Response } from 'express';
import { signup, login, sendOTP } from '../controllers/authController';

const router = express.Router();

// Define routes with explicit types
router.post('/signup', async (req: Request, res: Response) => {
  await signup(req, res);
});

router.post('/login', async (req: Request, res: Response) => {
  await login(req, res);
});

router.post('/send-otp', async (req: Request, res: Response) => {
  await sendOTP(req, res);
});

export default router;
