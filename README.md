# CodeMatrix

A LeetCode-style LMS for coding practice, featuring problem-solving, real-time execution, leaderboards, and instructor tools in a dark-themed interface.

## Overview
CodeMatrix is a Learning Management System (LMS) designed to empower coding education. Students can solve coding challenges, submit solutions, and track progress, while instructors can upload problems and manage groups. With a sleek dark-themed UI, it offers an engaging experience for learners and educators alike.

## Project Owner
- **Name**: Yash Sakhareliya  
- **GitHub**: [yashsakhareliya](https://github.com/yashsakhareliya)  
- **Profile**:  
  ![Yash Sakhareliya](https://github.com/yashsakhareliya.png?size=100)

## Project Structure
```
CodeMatrix/
├── micro-services/
│   ├── backend/          # Core API for users, submissions, and problems
│   ├── code-executor/    # Service for running user code in sandboxes
│   ├── instructor/       # Instructor tools for problem and group management
├── docker-compose.yml     # Local development setup
├── .gitignore            # Ignores unnecessary files
└── README.md             # You’re reading it!
```

## Features
- **Dashboard**: Student stats and assigned problems.
- **Problem View**: Browse and solve coding challenges.
- **Submission**: Submit code and view test case results.
- **Leaderboard**: Instructor-scoped rankings.
- **Profile**: Edit user details and add instructors.
- **Discussion**: Engage in problem-specific forums.
- **Instructor Dashboard**: Upload problems and assign groups.
- **Practice/Tutorial**: Learn and practice coding skills.

## Prerequisites
- Docker and Docker Compose installed.
- Git for cloning the repository.

## Setup Instructions
1. **Clone the Repository**:
   ```bash
   git clone https://github.com/yashsakhareliya/CodeMatrix.git
   cd CodeMatrix
   ```

2. **Configure Environment**:
   - Copy `.env` examples from each service folder (`micro-services/backend/.env`, etc.) and fill in values (e.g., MongoDB and Redis URLs).

3. **Run Locally**:
   ```bash
   docker-compose up --build
   ```
   - Access micro-services:
     - Backend: `http://localhost:5000`
     - Code Executor: `http://localhost:7000`
     - Instructor: `http://localhost:6000`

4. **Test**: Submit a sample problem via the backend to verify the code execution flow.


## Contributing
Contributions are welcome! Here’s how to get involved:
1. Fork the repository.
2. Create a feature branch from the `dev` branch:
   ```bash
   git checkout dev
   git checkout -b feature/your-feature-name
   ```
3. Commit your changes:
   ```bash
   git commit -m "Add your feature"
   ```
4. Push to your fork:
   ```bash
   git push origin feature/your-feature-name
   ```
5. Open a Pull Request to the `dev` branch.

Please ensure your code follows the project’s style and includes tests where applicable.

## Contact
For questions or suggestions, reach out to Yash Sakhareliya via [GitHub Issues](https://github.com/yashsakhareliya/CodeMatrix/issues) or directly.

## License
This project is open-source under the [MIT License](LICENSE).

---
