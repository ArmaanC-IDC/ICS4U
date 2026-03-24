import express from 'express'
import cors from 'cors'
import morgan from 'morgan'
import mongoose from 'mongoose'
import dotenv from 'dotenv'

import studentRoutes from './routes/students.js'
import teacherRoutes from './routes/teachers.js'
import classRoutes from './routes/classes.js'

dotenv.config()

const app = express()

app.use(cors())
app.use(express.json())
app.use(morgan('dev'))

// Routes
app.use('/api/students', studentRoutes)
app.use('/api/teachers', teacherRoutes)
app.use('/api/classes', classRoutes)

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' })
})

const PORT = process.env.PORT || 3001

async function start() {
  try {
    await mongoose.connect(process.env.MONGO_URI)
    console.log('Connected to MongoDB')
    app.listen(PORT, () => console.log(`API running on http://localhost:${PORT}`))
  } catch (err) {
    console.error('Failed to start server:', err.message)
    process.exit(1)
  }
}

start()