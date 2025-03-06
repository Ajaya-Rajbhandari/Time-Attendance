'use strict';

import mongoose from 'mongoose';

const scheduleSchema = new mongoose.Schema({
    employeeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    shiftStart: {
        type: Date,
        required: true,
    },
    shiftEnd: {
        type: Date,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
});
const Schedule = mongoose.model('Schedule', scheduleSchema);

export default Schedule;
