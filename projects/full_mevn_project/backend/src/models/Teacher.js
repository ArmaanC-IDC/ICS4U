import mongoose from 'mongoose'

const teacherSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    employeeId: { type: String, required: true, unique: true },
    department: { type: String, required: true }
  },
  { timestamps: true }
)

export default mongoose.model('Teacher', teacherSchema)