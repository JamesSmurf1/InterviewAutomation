import mongoose from "mongoose";


const Applicantchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }

}, { timestamps: true });

const Applicant = mongoose.models.Applicant || mongoose.model('Applicant', Applicantchema);
export default Applicant;
