
import mongoose from 'mongoose';

const applicantAnswerSchema = new mongoose.Schema(
    {
        applicant: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Applicant',
            required: true,
        },
        job: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Job',
            required: true,
        },
        interviewQuestion: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'InterviewQuestion',
            required: true,
        },
        answers: {
            type: [String],
            required: true,
        },
    },
    { timestamps: true }
);

const ApplicantAnswer =
    mongoose.models.ApplicantAnswer ||
    mongoose.model('ApplicantAnswer', applicantAnswerSchema);

export default ApplicantAnswer;
