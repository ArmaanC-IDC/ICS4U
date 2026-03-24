import mongoose from 'mongoose'

const classSchema = new mongoose.Schema(
  {
    code: { type: String, required: true, unique: true },   // e.g. ICS4U
    name: { type: String, required: true },                 // e.g. Computer Science
    teacherId: { type: mongoose.Schema.Types.ObjectId, ref: 'Teacher', required: true },
    studentIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Student' }]
  },
  { timestamps: true }
)

export default mongoose.model('Class', classSchema)