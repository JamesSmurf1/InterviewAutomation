import mongoose from 'mongoose';

const companySchema = new mongoose.Schema(
  {
    companyName: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      default: 'Company',
    },
    password: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Company = mongoose.models.Company || mongoose.model('Company', companySchema);
export default Company;
