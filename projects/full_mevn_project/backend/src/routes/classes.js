import express from 'express'
import ClassModel from '../models/Class.js'

const router = express.Router()

// GET all classes (populate teacher + students)
router.get('/', async (req, res) => {
  const classes = await ClassModel.find()
    .populate('teacherId')
    .populate('studentIds')
    .sort({ code: 1 })
  res.json(classes)
})

// GET class by id (populate teacher + students)
router.get('/:id', async (req, res) => {
  const c = await ClassModel.findById(req.params.id)
    .populate('teacherId')
    .populate('studentIds')
  if (!c) return res.status(404).json({ message: 'Class not found' })
  res.json(c)
})

// POST create class
router.post('/', async (req, res) => {
  try {
    const created = await ClassModel.create(req.body)
    res.status(201).json(created)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
})

// PUT update class
router.put('/:id', async (req, res) => {
  try {
    const updated = await ClassModel.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    })
    if (!updated) return res.status(404).json({ message: 'Class not found' })
    res.json(updated)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
})

// DELETE a student from a class
router.delete('/:classId/students/:studentId', async (req, res) => {
  try {
    const { classId, studentId } = req.params

    const updatedClass = await ClassModel.findByIdAndUpdate(
      classId,
      { $pull: { studentIds: studentId } },
      { new: true }
    )

    if (!updatedClass) return res.status(404).json({ message: 'Class not found' })

    res.json(updatedClass)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
})

// DELETE class
router.delete('/:id', async (req, res) => {
  const deleted = await ClassModel.findByIdAndDelete(req.params.id)
  if (!deleted) return res.status(404).json({ message: 'Class not found' })
  res.json({ message: 'Deleted' })
})

export default router
