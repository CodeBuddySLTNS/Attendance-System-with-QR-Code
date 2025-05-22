export const sqlTableQueries = `
    CREATE TABLE departments (
        departmentId INT PRIMARY KEY AUTO_INCREMENT,
        acronym VARCHAR(15) NOT NULL,
        departmentName VARCHAR(255) NOT NULL
    );

    CREATE TABLE users (
        userId INT PRIMARY KEY AUTO_INCREMENT,
        studentId INT,
        name VARCHAR(100) NOT NULL,
        departmentId INT,
        year TINYINT NOT NULL CHECK (year BETWEEN 1 AND 4),
        role VARCHAR(10) NOT NULL DEFAULT "student",
        FOREIGN KEY (departmentId) REFERENCES departments(departmentId) ON DELETE CASCADE
    );

    CREATE TABLE attendances (
        attendanceId INT PRIMARY KEY AUTO_INCREMENT,
        userId INT NOT NULL,
        type VARCHAR(10) NOT NULL,
        date DATE NOT NULL,
        FOREIGN KEY (userId) REFERENCES users(userId) ON DELETE CASCADE
    ); 
`;

export const insertDepartments = `
    INSERT INTO departments (departmentName, acronym) VALUES 
        ("Bachelor of Science in Computer Science", "BSCS"),
        ("Bachelor of Science in Information Technology", "BSIT"),
        ("Bachelor of Science in Social Work", "BSSW"),
        ("Bachelor of Early Childhood Education", "BECED");
`;
