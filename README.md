# Job Portal & Recruiting Management System

## About

A full-stack job portal and recruiting management system
built using the MERN stack.

## Tech Stack

- React.js
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- Tailwind CSS

## Features

### Candidate
- Registration/Login
- Profile management
- Resume upload
- Job search
- Apply for jobs
- Track applications

### Recruiter
- Company profile
- Create jobs
- Update jobs
- Delete jobs
- View applicants
- Shortlist candidates
- Schedule interviews
- Update application status



## Project Structure


## API Documentation

## Screenshots

## Installation

Requirements: Node.js and MongoDB running locally, or a MongoDB Atlas connection string.

1. In `backend`, install dependencies and create your local environment file:

	```sh
	npm install
	```

	Copy `backend/.env.example` to `backend/.env`, then set `MONGO_URI` to your MongoDB connection string and replace `JWT_SECRET` with a long random value. Do not commit `.env`.
	Configure `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, and `EMAIL_FROM` in the same file to send verification and application-status emails. For Gmail, use an App Password rather than your account password.

2. Start the API from the `backend` directory:

	```sh
	npm run dev
	```

	The API waits for MongoDB before listening at `http://localhost:5000`.

3. In a second terminal, start the frontend:

	```sh
	cd frontend
	npm install
	npm run dev
	```

	The frontend uses `http://localhost:5000` by default. Set `VITE_API_URL` in the frontend environment if your API runs elsewhere.

New accounts, job postings, companies, and applications are saved in MongoDB. The browser stores only the login token.
New accounts must verify their email before they can log in. Applicants receive an email when a recruiter changes their application status. `FRONTEND_URL` controls the verification link destination.

## Future Improvements
