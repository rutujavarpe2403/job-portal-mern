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

        salary: {
            min: Number,
            max: Number
        },

        jobType: {
            type: String,
            enum: ["Full Time", "Part Time", "Internship"]
        },

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