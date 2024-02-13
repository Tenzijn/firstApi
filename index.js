import express from 'express';
import traineesRouter from './routes/trainees.js';

const app = express();

app.use(express.json());

// Define the traineesRouter before using it
app.use('/trainee', traineesRouter);

// Handle not found routes
app.use((req, res, next) => {
  res.status(404).json({ message: 'Not Found' });
});

const PORT = 7890;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
