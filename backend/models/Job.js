const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true
        },

        description: {
            type: String,
            required: true
        },

        location: String,

        salary: String,

        jobType: {
            type: String,
            enum: ["Full-time", "Part-time", "Internship", "Contract"]
        },

        experience: String,

        responsibilities: [String],

        skills: [String],

        company: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Company"
        },

        recruiter: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Job", jobSchema);