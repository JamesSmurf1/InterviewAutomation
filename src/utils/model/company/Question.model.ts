import mongoose from 'mongoose';

const interviewQuestionSchema = new mongoose.Schema(
    {
        job: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Job',
            required: true,
        },
        questions: {
            type: [String],
            required: true,
        },
    },
    { timestamps: true }
);

const InterviewQuestion =
    mongoose.models.InterviewQuestion || mongoose.model('InterviewQuestion', interviewQuestionSchema);

export default InterviewQuestion;
