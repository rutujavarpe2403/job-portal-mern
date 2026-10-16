function JobCard({ job }) {

    return (
        <div className="border p-5 rounded-lg">

            <h2 className="text-xl font-bold">
                {job.title}
            </h2>

            <p>{job.company?.name}</p>

            <p>{job.location}</p>

            <p>{job.jobType}</p>

            <button className="bg-blue-500 text-white px-4 py-2">
                View Job
            </button>

        </div>
    );
}

export default JobCard;