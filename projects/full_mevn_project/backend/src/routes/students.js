import express from 'express'
import Student from '../models/Student.js'

const router = express.Router()

// GET /api/students
router.get('/', async (req, res) => {
  const students = await Student.find().sort({ lastName: 1, firstName: 1 })
  res.json(students)
})

// GET /api/students/:id
router.get('/:id', async (req, res) => {
  const student = await Student.findById(req.params.id)
  if (!student) return res.status(404).json({ message: 'Student not found' })
  res.json(student)
})

// POST /api/students
router.post('/', async (req, res) => {
  try {
    const created = await Student.create(req.body)
    res.status(201).json(created)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
})

// PUT /api/students/:id
router.put('/:id', async (req, res) => {
  try {
    const updated = await Student.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    })
    if (!updated) return res.status(404).json({ message: 'Student not found' })
    res.json(updated)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
})

// DELETE /api/students/:id
router.delete('/:id', async (req, res) => {
  const deleted = await Student.findByIdAndDelete(req.params.id)
  if (!deleted) return res.status(404).json({ message: 'Student not found' })
  res.json({ message: 'Deleted' })
})

export default router
