import mongoose from 'mongoose';

const attendanceSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: ['clockIn', 'clockOut', 'breakStart', 'breakEnd'],
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number],
      required: true
    }
  },
  ipAddress: String,
  deviceInfo: String
});

const Attendance = mongoose.model('Attendance', attendanceSchema);
export default Attendance;