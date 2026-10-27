# MERN Stack Job Portal

A full-stack **Job Portal Web Application** built using the MERN stack (MongoDB, Express.js, React.js, and Node.js). The application helps job seekers explore job opportunities, view company details, and manage job applications. It can also support recruiters in posting and managing job openings.

## 🚀 Features

### 1. User Authentication
- User registration and login
- JWT-based authentication
- Password hashing for secure storage
- Authentication and authorization
- Protected routes

### 2. Jobs
- View all available jobs
- Search and filter job listings
- View detailed job descriptions
- Display job title, company, location, salary, and requirements

### 3. Companies
- Browse company profiles
- View company information
- Explore jobs associated with companies

### 4. Applications
- Apply for available jobs
- Track submitted applications
- View application status
- Manage applications based on user permissions

### 5. User Interface
- Responsive design
- Navigation bar
- Login and registration pages
- Jobs listing page
- Job details page
- Company listing page
- Applications dashboard

## 🛠️ Technologies Used

| Technology | Purpose |
|---|---|
| React.js | Frontend user interface |
| HTML5 | Web page structure |
| CSS3 | Styling and responsive design |
| JavaScript | Application logic |
| Node.js | Backend runtime |
| Express.js | REST API development |
| MongoDB | Database |
| Mongoose | MongoDB object modeling |
| JWT | Authentication |
| bcrypt.js | Password hashing |
| Axios / Fetch API | Frontend-backend communication |
| dotenv | Environment variable management |

*The listed packages should match the technologies actually installed in your project.*

## 📁 Project Structure

A suggested folder structure for the application:

```text
job-portal/
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   └── Navbar.jsx
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── Jobs.jsx
│   │   │   ├── JobDetails.jsx
│   │   │   ├── Companies.jsx
│   │   │   └── Applications.jsx
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   └── package.json
│
├── backend/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── server.js
│   ├── .env
│   ├── .env.example
│   └── package.json
│
├── .gitignore
└── README.md
```

*This is an example structure. Adjust the folders and filenames to match your actual project.*

## ⚙️ Installation and Setup

### Prerequisites

Install the following before starting:

- Node.js and npm
- MongoDB Community Server or a MongoDB Atlas account
- Git
- Visual Studio Code (recommended)

### Step 1: Clone the Repository


git clone 
cd job-portal



### Step 2: Set Up the Backend

```bash
cd backend
npm install
```

Create a `.env` file inside the `backend` folder:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_long_random_secret
```

Replace the example values with your actual configuration.

### Step 3: Configure MongoDB

For MongoDB Atlas, obtain your connection string from your Atlas cluster's **Connect → Drivers** section.

Example format:

```env
MONGO_URI=mongodb+srv://<username>:<password>@<cluster-url>/<database-name>
```

For a local MongoDB installation, you can use:

```env
MONGO_URI=mongodb://127.0.0.1:27017/jobportal
```

Ensure MongoDB is running when using a local database.

### Step 4: Configure JWT

Set `JWT_SECRET` to a long, randomly generated secret. Keep it private and never commit your actual `.env` file to GitHub.

For example, you can generate a secure secret using Node.js:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Copy the generated value into your backend `.env` file.

### Step 5: Start the Backend

From the `backend` directory, run:

```bash
npm run dev
```

If your project does not have a `dev` script, check `backend/package.json`. You may need to use:

```bash
node server.js
```

The backend API should run at:

```text
http://localhost:5000
```

### Step 6: Set Up the Frontend

Open a second terminal:

```bash
cd frontend
npm install
```

If your frontend uses Vite, create a `.env` file inside `frontend`:

```env
VITE_API_URL=http://localhost:5000/api
```

Use this variable in your API configuration if your frontend is designed to read it.

For example:

```javascript
const API_URL = import.meta.env.VITE_API_URL;
```

### Step 7: Start the Frontend

```bash
npm run dev
```

Open the local URL displayed in the terminal, commonly:

```text
http://localhost:5173
```

Your frontend and backend should now be running separately.

## 🔗 API Endpoints

The following are suggested REST API routes. Update them to match the routes implemented in your backend.

### Authentication

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Register a user |
| POST | `/api/auth/login` | Log in a user |
| GET | `/api/auth/me` | Get the current authenticated user |

### Jobs

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/jobs` | Retrieve all jobs |
| GET | `/api/jobs/:id` | Retrieve a specific job |
| POST | `/api/jobs` | Create a job |
| PUT | `/api/jobs/:id` | Update a job |
| DELETE | `/api/jobs/:id` | Delete a job |

Creating, updating, and deleting jobs should be restricted to authorized users, such as recruiters or administrators.

### Companies

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/companies` | Retrieve all companies |
| GET | `/api/companies/:id` | Retrieve company details |
| POST | `/api/companies` | Create a company profile |

### Applications

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/applications` | Apply for a job |
| GET | `/api/applications/my` | View the current user's applications |
| GET | `/api/applications` | Retrieve applications for authorized recruiters |
| PATCH | `/api/applications/:id/status` | Update an application's status |

All protected endpoints should validate authentication and authorization on the server.

## 🗄️ Database Models

The application may use the following MongoDB collections:

### User
- Name
- Email
- Password hash
- Role (job seeker, recruiter, or administrator, if supported)

### Job
- Job title
- Description
- Requirements
- Location
- Salary
- Company reference
- Posted by
- Created date

### Company
- Company name
- Description
- Location
- Website
- Logo URL

### Application
- Applicant reference
- Job reference
- Resume or resume URL, if supported
- Application status
- Applied date

Use Mongoose references to associate users, jobs, companies, and applications where appropriate.

## 🔐 Security

- Hash passwords before storing them.
- Use JWT to authenticate protected API requests.
- Verify user roles and resource ownership before allowing restricted operations.
- Keep database credentials and JWT secrets in environment variables.
- Validate and sanitize incoming request data.
- Configure CORS for trusted frontend origins.
- Never commit `.env` files or expose secrets in frontend code.

## 🧪 Testing

Before using or deploying the application, verify:

- User registration and login
- Invalid credential handling
- Access to protected routes
- Job listing and job details
- Company information
- Job application submission
- Application status updates
- Validation and error handling

Use Postman or another API testing tool to test backend endpoints.

## 🚀 Future Enhancements

- Resume upload
- Email notifications for applications
- Advanced job search and filters
- Recruiter dashboard
- Admin dashboard
- Saved jobs and bookmarks
- Pagination
- Forgot-password functionality
- Deployment to cloud hosting platforms

## 🌐 Deployment

The application can be deployed using suitable frontend and backend hosting providers, with MongoDB Atlas as the database.

Before deployment:

1. Configure production environment variables.
2. Set the correct frontend API URL.
3. Configure production CORS origins.
4. Restrict database network access appropriately.
5. Ensure secrets are stored securely.
6. Test all authentication and authorization flows.


## 📄 License

This project is intended for learning and portfolio purposes. Add a license such as the MIT License if you want to distribute the project under those terms.
