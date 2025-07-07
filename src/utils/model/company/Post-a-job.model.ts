import mongoose from 'mongoose';

const jobSchema = new mongoose.Schema(
  {
    posterId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Company',
      required: true,
    },
    title: String,
    position: String,
    type: {
      type: String,
      default: 'Full-time',
    },
    location: String,
    salary: String,
    description: String,
    requirements: String,

    applicants: [
      {
        applicant: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Applicant',
          required: true,
        },
        status: {
          type: String,
          enum: ['pending', 'accepted', 'rejected'],
          default: 'pending',
        },
        answers: {
          type: [String],
          default: [],
        },
      },
    ],

    // Post-a-job.model.ts (Job Schema)
    interviewQuestions: {
      type: [String],
      default: [],
    },

  },
  { timestamps: true }
);

const Job = mongoose.models.Job || mongoose.model('Job', jobSchema);
export default Job;
