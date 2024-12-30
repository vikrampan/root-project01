import express from 'express';
import { sendOTP, verifySignup, login } from '../controllers/authController';

const router = express.Router();

router.post('/signup', async (req, res) => {
  await sendOTP(req, res);
});

router.post('/verify-signup', async (req, res) => {
  await verifySignup(req, res);
});

router.post('/login', async (req, res) => {
  await login(req, res);
});

export default router;