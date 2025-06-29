import mongoose from 'mongoose';

const jobSchema = new mongoose.Schema(
  {
    posterId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Company',
      required: true
    },
    title: {
      type: String,
      required: true,
    },
    position: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      default: 'Full-time',
    },
    location: {
      type: String,
      required: true,
    },
    salary: {
      type: String,
    },
    description: {
      type: String,
      required: true,
    },
    requirements: {
      type: String,
    },

  
    applicants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Applicant',
      }
    ]

  },
  { timestamps: true }
);

const Job = mongoose.models.Job || mongoose.model('Job', jobSchema);
export default Job;
