import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';

import productRoutes from './routes/product.routes';
import { notFound, errorHandler } from './middleware/errorHandler';

const app = express();
const PORT = process.env.PORT ?? 3001;

app.set('trust proxy', 1);

app.use(helmet());
app.use(compression());
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));

const allowedOrigins = (process.env.CORS_ORIGIN ?? 'http://localhost:5173')
  .split(',')
  .map((o) => o.trim());

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, origin ?? allowedOrigins[0]);
      } else {
        callback(new Error(`CORS: origin ${origin} not allowed`));
      }
    },
    methods: ['GET'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

const limiter = rateLimit({
  windowMs: 60 * 1000,
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, error: 'Too many requests, please try again later.' },
});
app.use(limiter);

app.use(express.json());

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use('/api/products', productRoutes);

app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} [${process.env.NODE_ENV ?? 'development'}]`);

  if (process.env.NODE_ENV === 'production' && process.env.RENDER_EXTERNAL_URL) {
    const pingUrl = `${process.env.RENDER_EXTERNAL_URL}/health`;
    setInterval(async () => {
      try {
        await fetch(pingUrl);
      } catch {
        // ignore — next interval will retry
      }
    }, 14 * 60 * 1000); // every 14 minutes (Render idles after 15)
  }
});

export default app;
