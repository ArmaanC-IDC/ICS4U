import express from 'express'
import cors from 'cors'
import morgan from 'morgan'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import { fileURLToPath } from 'url'
import path from 'path'

import studentRoutes from './students.js'
import teacherRoutes from './teachers.js'
import classRoutes from './classes.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
dotenv.config({ path: path.join(__dirname, '../../.env') })

const app = express()

app.use(cors())
app.use(express.json())
app.use(morgan('dev'))

// Route
app.use('/api/students', studentRoutes)
app.use('/api/teachers', teacherRoutes)
app.use('/api/classes', classRoutes)

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' })
})

const PORT = process.env.PORT || 3001

async function start() {
  try {
    await mongoose.connect(process.env.MONGODB_URI)
    console.log('Connected to MongoDB')
    app.listen(PORT, () => console.log(`API running on http://localhost:${PORT}`))
  } catch (err) {
    console.error('Failed to start server:', err.message)
    process.exit(1)
  }
}

start()