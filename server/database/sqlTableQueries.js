/*
 INSERT INTO users(name, password, role, year)
      VALUES ('admin', '$2b$10$xqpfTeyhL92u5BeEGEGH3eU6cfpTtGnXZy5WPE2TcMuvCCrZFjW3a', 'admin', 1)
*/

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
        role ENUM('student', 'teacher', 'admin') NOT NULL DEFAULT "student",
        password VARCHAR(255),
        photo VARCHAR(255),
        FOREIGN KEY (departmentId) REFERENCES departments(departmentId) ON DELETE CASCADE
    );

    CREATE TABLE classes (
        classId INT PRIMARY KEY AUTO_INCREMENT,
        className VARCHAR(100) NOT NULL,
        departmentId INT NOT NULL,
        year TINYINT NOT NULL CHECK (year BETWEEN 1 AND 4),
        FOREIGN KEY (departmentId) REFERENCES departments(departmentId) ON DELETE CASCADE
    );

    CREATE TABLE class_students (
        classId INT NOT NULL,
        userId INT NOT NULL,
        PRIMARY KEY (classId, userId),
        FOREIGN KEY (classId) REFERENCES classes(classId) ON DELETE CASCADE,
        FOREIGN KEY (userId) REFERENCES users(userId) ON DELETE CASCADE
    );

    CREATE TABLE attendances (
        attendanceId INT AUTO_INCREMENT UNIQUE,
        classId INT NOT NULL,
        userId INT NOT NULL,
        type VARCHAR(10) NOT NULL,
        dateTime DATETIME NOT NULL,
        date DATE NOT NULL,
        PRIMARY KEY (userId, classId, date),
        FOREIGN KEY (userId) REFERENCES users(userId) ON DELETE CASCADE,
        FOREIGN KEY (classId) REFERENCES classes(classId) ON DELETE CASCADE
    ); 
`;

export const insertDepartments = `
    INSERT INTO departments (departmentName, acronym) VALUES 
        ("Bachelor of Science in Computer Science", "BSCS"),
        ("Bachelor of Science in Information Technology", "BSIT"),
        ("Bachelor of Science in Social Work", "BSSW"),
        ("Bachelor of Early Childhood Education", "BECED");
`;
