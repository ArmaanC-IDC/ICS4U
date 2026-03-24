import express from 'express'
import Teacher from '../models/Teacher.js'

const router = express.Router()

router.get('/', async (req, res) => {
  const teachers = await Teacher.find().sort({ lastName: 1, firstName: 1 })
  res.json(teachers)
})

router.get('/:id', async (req, res) => {
  const teacher = await Teacher.findById(req.params.id)
  if (!teacher) return res.status(404).json({ message: 'Teacher not found' })
  res.json(teacher)
})

router.post('/', async (req, res) => {
  try {
    const created = await Teacher.create(req.body)
    res.status(201).json(created)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
})

router.put('/:id', async (req, res) => {
  try {
    const updated = await Teacher.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    })
    if (!updated) return res.status(404).json({ message: 'Teacher not found' })
    res.json(updated)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
})

router.delete('/:id', async (req, res) => {
  const deleted = await Teacher.findByIdAndDelete(req.params.id)
  if (!deleted) return res.status(404).json({ message: 'Teacher not found' })
  res.json({ message: 'Deleted' })
})

export default router
