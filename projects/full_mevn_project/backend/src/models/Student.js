import mongoose from 'mongoose'

const studentSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    studentNumber: { type: String, required: true, unique: true },
    grade: { type: Number, required: true, min: 9, max: 12 }
  },
  { timestamps: true }
)

export default mongoose.model('Student', studentSchema)