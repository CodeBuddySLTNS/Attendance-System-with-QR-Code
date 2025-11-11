-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Nov 11, 2025 at 08:12 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `qr_attendance_system`
--

-- --------------------------------------------------------

--
-- Table structure for table `attendances`
--

CREATE TABLE `attendances` (
  `attendanceId` int(11) NOT NULL,
  `classId` int(11) NOT NULL,
  `userId` int(11) NOT NULL,
  `type` varchar(10) NOT NULL,
  `dateTime` datetime NOT NULL,
  `date` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `attendances`
--

INSERT INTO `attendances` (`attendanceId`, `classId`, `userId`, `type`, `dateTime`, `date`) VALUES
(17, 2, 4, 'in', '2025-09-02 12:07:24', '2025-09-02'),
(20, 2, 4, 'in', '2025-09-03 08:12:10', '2025-09-03'),
(49, 2, 4, 'in', '2025-09-04 10:59:11', '2025-09-04'),
(150, 2, 4, 'in', '2025-09-09 10:00:07', '2025-09-09'),
(160, 2, 4, 'in', '2025-10-11 20:48:36', '2025-10-11'),
(169, 2, 4, 'in', '2025-10-27 15:32:43', '2025-10-27'),
(1, 3, 4, 'in', '2025-09-02 09:04:19', '2025-09-02'),
(30, 3, 4, 'in', '2025-09-03 08:19:40', '2025-09-03'),
(70, 3, 4, 'in', '2025-09-04 11:24:10', '2025-09-04'),
(147, 3, 4, 'in', '2025-09-09 09:50:35', '2025-09-09'),
(13, 2, 5, 'in', '2025-09-02 11:36:49', '2025-09-02'),
(18, 2, 5, 'in', '2025-09-03 08:09:40', '2025-09-03'),
(41, 2, 5, 'in', '2025-09-04 10:43:27', '2025-09-04'),
(154, 2, 5, 'in', '2025-10-05 13:29:06', '2025-10-05'),
(168, 2, 5, 'in', '2025-10-27 15:24:50', '2025-10-27'),
(3, 3, 5, 'in', '2025-09-02 11:08:41', '2025-09-02'),
(71, 3, 5, 'in', '2025-09-04 11:24:32', '2025-09-04'),
(159, 3, 5, 'in', '2025-10-11 20:27:11', '2025-10-11'),
(14, 2, 6, 'in', '2025-09-02 11:59:40', '2025-09-02'),
(19, 2, 6, 'in', '2025-09-03 08:12:03', '2025-09-03'),
(43, 2, 6, 'in', '2025-09-04 10:53:29', '2025-09-04'),
(151, 2, 6, 'in', '2025-09-09 10:00:17', '2025-09-09'),
(152, 2, 6, 'in', '2025-09-12 19:33:24', '2025-09-12'),
(173, 2, 6, 'in', '2025-10-27 15:35:50', '2025-10-27'),
(2, 3, 6, 'in', '2025-09-02 10:19:59', '2025-09-02'),
(29, 3, 6, 'in', '2025-09-03 08:19:33', '2025-09-03'),
(74, 3, 6, 'in', '2025-09-04 11:26:10', '2025-09-04'),
(148, 3, 6, 'in', '2025-09-09 09:50:39', '2025-09-09'),
(158, 3, 6, 'in', '2025-10-11 20:26:56', '2025-10-11'),
(64, 2, 8, 'in', '2025-09-04 11:14:49', '2025-09-04'),
(157, 2, 10, 'in', '2025-10-11 20:25:02', '2025-10-11');

-- --------------------------------------------------------

--
-- Table structure for table `classes`
--

CREATE TABLE `classes` (
  `classId` int(11) NOT NULL,
  `teacherId` int(11) NOT NULL,
  `className` varchar(100) NOT NULL,
  `departmentId` int(11) NOT NULL,
  `year` tinyint(4) NOT NULL CHECK (`year` between 1 and 4),
  `time` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `classes`
--

INSERT INTO `classes` (`classId`, `teacherId`, `className`, `departmentId`, `year`, `time`) VALUES
(2, 2, 'SDP101 TTH', 2, 2, '08 : 00 am - 09 : am'),
(3, 2, 'CSS101 MW', 2, 2, '08 : 00 am - 11 : am'),
(15, 1, 'dsad', 3, 1, 'ee'),
(16, 29, 'KLF', 2, 2, '8:00- 9:00');

-- --------------------------------------------------------

--
-- Table structure for table `class_students`
--

CREATE TABLE `class_students` (
  `classId` int(11) NOT NULL,
  `userId` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `class_students`
--

INSERT INTO `class_students` (`classId`, `userId`) VALUES
(2, 4),
(2, 5),
(2, 6),
(2, 9),
(2, 10),
(2, 11),
(3, 4),
(3, 5),
(3, 6),
(3, 25);

-- --------------------------------------------------------

--
-- Table structure for table `departments`
--

CREATE TABLE `departments` (
  `departmentId` int(11) NOT NULL,
  `acronym` varchar(15) NOT NULL,
  `departmentName` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `departments`
--

INSERT INTO `departments` (`departmentId`, `acronym`, `departmentName`) VALUES
(1, 'BSCS', 'Bachelor of Science in Computer Science'),
(2, 'BSIT', 'Bachelor of Science in Information Technology'),
(3, 'BSSW', 'Bachelor of Science in Social Work'),
(4, 'BECED', 'Bachelor of Early Childhood Education');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `userId` int(11) NOT NULL,
  `studentId` int(11) DEFAULT NULL,
  `name` varchar(100) NOT NULL,
  `username` varchar(100) DEFAULT NULL,
  `departmentId` int(11) DEFAULT NULL,
  `year` tinyint(4) NOT NULL CHECK (`year` between 1 and 4),
  `role` enum('student','teacher','admin') NOT NULL DEFAULT 'student',
  `password` varchar(255) DEFAULT NULL,
  `photo` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`userId`, `studentId`, `name`, `username`, `departmentId`, `year`, `role`, `password`, `photo`) VALUES
(1, NULL, 'maria', 'maria', NULL, 1, 'teacher', '$2b$10$vikyhei8CdTV.lgLbluKXecRDa6G3FDWChqmNKB9rVcSkBh2s/6wi', NULL),
(2, NULL, 'q', 'q', NULL, 1, 'teacher', '$2b$10$2S.K6BcJnZgYnVt8vs.ky.AyCbf7BEIfx0didlWKijzlplie0rLH2', NULL),
(3, NULL, 'admin', 'admin', NULL, 1, 'admin', '$2b$10$aqIJG.rA9yCOIpI38LucV.2XX89WMWin4ccrMJYeX1bzmH0ajU39u', NULL),
(4, NULL, 'Maria J. Maraya', NULL, 2, 2, 'student', NULL, '/uploads/maria-maraya-bsit-2-1756897137453.jpeg'),
(5, NULL, 'Ashley C. Smigol', NULL, 2, 2, 'student', NULL, '/uploads/ashly smigol-1756897283649.jpeg'),
(6, NULL, 'Lia S. Madara', NULL, 2, 2, 'student', NULL, '/uploads/bc38bc96-2b91-496d-ab45-423e06b5ddd9-1756897301589.jpeg'),
(7, NULL, 'meriam', 'meriam', NULL, 1, 'teacher', '$2b$10$8ETZnhGsom55NL27WGAs1udc2fhzBhu2lpv9D566XPhHYw5jy/35.', NULL),
(8, NULL, 'Angelina G. Molina', NULL, 2, 1, 'student', NULL, '/uploads/9637ecd5-dd65-4401-b02a-3571e5d07966-1756897357973.jpeg'),
(9, NULL, 'Jong S. Hilario', NULL, 1, 2, 'student', NULL, NULL),
(10, NULL, 'Coco L. Martin', NULL, 1, 2, 'student', NULL, NULL),
(11, NULL, 'Ferdinand R. Marcos', NULL, 3, 3, 'student', NULL, NULL),
(25, NULL, 'Jana L. Papa', NULL, 1, 2, 'student', NULL, '/uploads/Coquette Fawn-1757378040175.jpeg'),
(26, NULL, 'Papa L. Mama', NULL, 2, 2, 'student', NULL, NULL),
(27, NULL, 'Ate L. Kuya', NULL, 2, 3, 'student', NULL, NULL),
(29, NULL, 'D', 'D', NULL, 1, 'teacher', '$2b$10$9AG3pN1R7Jpg2wMfBrH2lO1j8xNfd4a9GvZK1dYy6BBTpNb7xokVW', NULL);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `attendances`
--
ALTER TABLE `attendances`
  ADD PRIMARY KEY (`userId`,`classId`,`date`),
  ADD UNIQUE KEY `attendanceId` (`attendanceId`),
  ADD KEY `classId` (`classId`);

--
-- Indexes for table `classes`
--
ALTER TABLE `classes`
  ADD PRIMARY KEY (`classId`),
  ADD KEY `teacherId` (`teacherId`),
  ADD KEY `departmentId` (`departmentId`);

--
-- Indexes for table `class_students`
--
ALTER TABLE `class_students`
  ADD PRIMARY KEY (`classId`,`userId`),
  ADD KEY `userId` (`userId`);

--
-- Indexes for table `departments`
--
ALTER TABLE `departments`
  ADD PRIMARY KEY (`departmentId`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`userId`),
  ADD UNIQUE KEY `name` (`name`),
  ADD KEY `departmentId` (`departmentId`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `attendances`
--
ALTER TABLE `attendances`
  MODIFY `attendanceId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=174;

--
-- AUTO_INCREMENT for table `classes`
--
ALTER TABLE `classes`
  MODIFY `classId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT for table `departments`
--
ALTER TABLE `departments`
  MODIFY `departmentId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `userId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=30;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `attendances`
--
ALTER TABLE `attendances`
  ADD CONSTRAINT `attendances_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `users` (`userId`) ON DELETE CASCADE,
  ADD CONSTRAINT `attendances_ibfk_2` FOREIGN KEY (`classId`) REFERENCES `classes` (`classId`) ON DELETE CASCADE;

--
-- Constraints for table `classes`
--
ALTER TABLE `classes`
  ADD CONSTRAINT `classes_ibfk_1` FOREIGN KEY (`teacherId`) REFERENCES `users` (`userId`) ON DELETE CASCADE,
  ADD CONSTRAINT `classes_ibfk_2` FOREIGN KEY (`departmentId`) REFERENCES `departments` (`departmentId`) ON DELETE CASCADE;

--
-- Constraints for table `class_students`
--
ALTER TABLE `class_students`
  ADD CONSTRAINT `class_students_ibfk_1` FOREIGN KEY (`classId`) REFERENCES `classes` (`classId`) ON DELETE CASCADE,
  ADD CONSTRAINT `class_students_ibfk_2` FOREIGN KEY (`userId`) REFERENCES `users` (`userId`) ON DELETE CASCADE;

--
-- Constraints for table `users`
--
ALTER TABLE `users`
  ADD CONSTRAINT `users_ibfk_1` FOREIGN KEY (`departmentId`) REFERENCES `departments` (`departmentId`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
