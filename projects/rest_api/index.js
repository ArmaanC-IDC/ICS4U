import express from "express";
import fs from "fs";
import path from "path";
const app = express();

app.use(express.json());

const PORT = 3000;

const loadJson = (filePath) => {
    if (!fs.existsSync(filePath)) return [];

    const data = fs.readFileSync(filePath, "utf-8");

    try {
        return JSON.parse(data);
    }catch (err) {
        console.error("Error parsing data: ", err);
        return [];
    }
}

const saveJson = (filePath, data) => {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2))
}

const teachersFilePath = "./json_data/teachers.json";
const studentsFilePath = "./json_data/students.json";
const testsFilePath = "./json_data/tests.json";
const coursesFilePath = "./json_data/courses.json";

const teachersData = loadJson(teachersFilePath);
const studentsData = loadJson(studentsFilePath);
const testsData = loadJson(testsFilePath);
const coursesData = loadJson(coursesFilePath);

let nextTeacherId = teachersData.reduce((max, current) => Math.max(max, current.id), -Infinity) + 1;
let nextStudentId = studentsData.reduce((max, current) => Math.max(max, current.id), -Infinity) + 1;
let nextTestId = testsData.reduce((max, current) => Math.max(max, current.id), -Infinity) + 1;
let nextCourseId = coursesData.reduce((max, current) => Math.max(max, current.id), -Infinity) + 1;

//teachers routes
//get all teachers
app.get("/teachers", (req, res) => {
    return res.status(200).json(teachersData);
});

//get single teacher
app.get("/teachers/:id", (req, res) => {
    const id = Number(req.params.id);
    const t = teachersData.find(t => t.id===id);
    if (!t) return res.status(404).json({ error: "Teacher not found" });
    return res.status(200).json(t);
});

//create teacher
app.post("/teachers", (req, res) => {
    const { firstName, lastName, email, department, room } = req.body;
    if (!firstName || !lastName || !email || !department) 
        return res.status(400).json({ error: "Missing required fields" });

    const newTeacher = {
        id: nextTeacherId++,
        firstName,
        lastName,
        email,
        department,
        room
    }

    teachersData.push(newTeacher);
    saveJson(teachersFilePath, teachersData);
    res.status(201).json(newTeacher);
});

//update teacher
app.put("/teachers/:id", (req, res) => {
    const id = Number(req.params.id);
    const teacher = teachersData.find(t => t.id === id);
    if (!teacher) {
        return res.status(404).json({ error: "Teacher not found" });
    }
    const { firstName, lastName, email, department, room } = req.body;

    if (!firstName && !lastName && !email && !department && !room) {
        return res.status(400).json({ error: "No fields provided to update" });
    }

    if (firstName !== undefined) teacher.firstName = firstName;
    if (lastName !== undefined) teacher.lastName = lastName;
    if (email !== undefined) teacher.email = email;
    if (department !== undefined) teacher.department = department;
    if (room !== undefined) teacher.room = room;
    saveJson(teachersFilePath, teachersData);
    res.json(teacher);
});

//delete teacher
app.delete("/teachers/:id", (req, res) => {
    const id = Number(req.params.id);
    const assignedToCourse = coursesData.some(c => c.teacherId===id);
    if (assignedToCourse) return res.status(400).json(
        {error: "Cannot delete that teacher because they are assigned to a course"}
    );

    const index = teachersData.findIndex(t => t.id===id);
    if (index===-1) return res.status(404).json({ error: "Teacher not found" });
    const deleted = teachersData.splice(index, 1)[0];
    saveJson(teachersFilePath, teachersData);
    res.status(200).json(deleted);
});

//Courses routes
//get all courses
app.get("/courses", (req, res) => {
    return res.status(200).json(coursesData);
});

//get single course
app.get("/courses/:id", (req, res) => {
    const id = Number(req.params.id);
    const course = coursesData.find(c => c.id===id);
    if (!course) return res.status(404).json({ error: "Course not found "});
    return res.status(200).json(course);
});

//create course
app.post("/courses", (req, res) => {
    const { code, name, teacherId, semester, room, schedule } = req.body;
    if (!code || !name || !teacherId || !semester || !room){
        return res.status(400).json({ error: "Missing required fields" });
    }

    //schedule is not required. if not provided, defaults to empty array
    const newCourse = {
        id: nextCourseId++,
        code,
        name,
        teacherId,
        semester,
        room,
        schedule: schedule ? schedule : [],
    };

    coursesData.push(newCourse);
    saveJson(coursesFilePath, coursesData);
    return res.status(201).json(newCourse);
});

//update course
app.put("/courses/:id", (req, res) => {
    const id = Number(req.params.id);
    const course = coursesData.find(c => c.id === id);
    if (!course) {
        return res.status(404).json({ error: "Course not found" });
    }
    const { code, name, teacherId, semester, room, schedule } = req.body || {};

    if (!code && !name && !teacherId && !semester && !room && !schedule) {
        return res.status(400).json({ error: "No fields provided to update" });
    }

    if (teacherId && !teachersData.some(t => t.id===teacherId)){
        return res.status(400).json({ error: "Invalid teacher id" })
    }

    if (code !== undefined) course.code = code;
    if (name !== undefined) course.name = name;
    if (teacherId !== undefined) course.teacherId = teacherId;
    if (semester !== undefined) course.semester = semester;
    if (room !== undefined) course.room = room;
    if (schedule !== undefined) course.schedule = schedule;
    saveJson(coursesFilePath, coursesData);
    res.json(course);
});

//delete course
app.delete("/courses/:id", (req, res) => {
    const id = Number(req.params.id);
    const index = coursesData.findIndex(c => c.id===id);
    if (index===-1){
        return res.status(404).json({ error: "Course not found" });
    }

    if (testsData.some(t => t.courseId===id)){
        return res.status(400).json({ error: "Could not delete course: tests exist for that course "});
    }

    const deleted = coursesData.splice(index, 1)[0];
    saveJson(coursesFilePath, coursesData);

    res.status(200).json(deleted);
});

//students routes
//get all students
app.get("/students", (req, res) => {
    res.status(200).json(studentsData);
});

//get single student
app.get("/students/:id", (req, res) => {
    const id = Number(req.params.id);
    const student = studentsData.find(s => s.id===id);
    if (student){
        return res.status(200).json(student);
    }
    return res.status(404).json({ error: "Student not found" });
});

//create student
app.post("/students", (req, res) => {
    const { firstName, lastName, grade, studentNumber, homeroom, courses } = req.body || {};
    if (!firstName || !lastName || !grade || !studentNumber){
        res.status(400).json({ error: "Missing required fields "});
    }

    const newStudent = {
        id: nextStudentId++,
        firstName,
        lastName,
        grade,
        studentNumber,
        homeroom,
        courses,
    };

    studentsData.push(newStudent);
    saveJson(studentsFilePath, studentsData);
    return res.status(200).json(newStudent);
});

//update student
app.put("/students/:id", (req, res) => {
    const id = Number(req.params.id);
    const { firstName, lastName, grade, studentNumber, homeroom, courses } = req.body || {};
    if (!firstName && !lastName && !grade && !studentNumber && !homeroom && !courses){
        return res.status(400).json({ error: "No fields provided to update" });
    }

    const index = studentsData.findIndex(s => s.id===id);
    if (index===-1){
        return res.status(404).json({ error: "Student not found" });
    }

    ["firstName", "lastName", "grade", "studentNumber", "homeroom", "courses"].forEach(param => {
        studentsData[index][param] = req.body[param] || studentsData[index][param];
    });
    saveJson(studentsFilePath, studentsData);
    return res.status(200).json(studentsData[index]);
});

//delete student
app.delete("/students/:id", (req, res) => {
    const id = Number(req.params.id);

    const index = studentsData.findIndex(s => s.id===id);
    if (index===-1) return res.status(404).json({ error: "Student not found" });
    const deleted = studentsData.splice(index, 1)[0];
    saveJson(studentsFilePath, studentsData);
    res.status(200).json(deleted);
});

//tests routes
//get all tests
app.get("/tests", (req, res) => {
    res.status(200).json(testsData);
});

//get single test
app.get("/tests/:id", (req, res) => {
    const id = Number(req.params.id);
    const test = testsData.find(t => t.id===id);
    if (!test) return res.status(404).json({ error: "Test not found" });
    return res.status(200).json(test);
});

//create test
app.post("/tests", (req, res) => {
    const { studentId, courseId, testName, date, mark, outOf, weight } = req.body;
    if (!studentId || !courseId || !testName || !date || !mark || !outOf) 
        return res.status(400).json({ error: "Missing required fields" });

    const newTest = {
        id: nextTestId++,
        studentId,
        courseId,
        testName,
        date,
        mark,
        outOf,
        weight
    };

    testsData.push(newTest);
    saveJson(testsFilePath, testsData);
    res.status(201).json(newTest);
});

//update test
app.put("/tests/:id", (req, res) => {
    const id = Number(req.params.id);
    const { studentId, courseId, testName, date, mark, outOf, weight } = req.body || {};
    if (!studentId && !courseId && !testName && !date && !mark && !outOf && !weight){
        return res.status(400).json({ error: "No fields provided to update" });
    }

    const index = testsData.findIndex(t => t.id===id);
    if (index===-1){
        return res.status(404).json({ error: "Test not found" });
    }

    ["studentID", "courseId", "testName", "date", "mark", "outOf", "weight"].forEach(param => {
        testsData[index][param] = req.body[param] || testsData[index][param];
    });
    saveJson(testsFilePath, testsData);
    return res.status(200).json(testsData[index]);
});

//delete test
app.delete("/tests/:id", (req, res) => {
    const id = Number(req.params.id);

    const index = testsData.findIndex(t => t.id===id);
    if (index===-1) return res.status(404).json({ error: "Test not found" });
    const deleted = testsData.splice(index, 1)[0];
    saveJson(testsFilePath, testsData);
    res.status(200).json(deleted);
});

const getAllTestByStudent = (req, res) => {

}

//list all tests for specific student
app.get("/students/:id/tests", (req, res) => {
    const id = Number(req.params.id);
    const student = studentsData.find(s => s.id===id);
    if (!student){
        return res.status(404).json({ error: "Student not found" });
    }
    const tests = testsData.filter(t => t.studentId===student.id);
    if (tests.length===0){
        return res.status(400).json({ error: "No tests written by that student" });
    }
    return res.status(200).json(tests);
});

app.get("/students/:id/average", (req, res) => {
     const id = Number(req.params.id);
    const student = studentsData.find(s => s.id===id);
    if (!student){
        return res.status(404).json({ error: "Student not found" });
    }
    const tests = testsData.filter(t => t.studentId===student.id);
    if (tests.length===0){
        return res.status(400).json({ error: "No tests written by that student" });
    }

    //determine averages by:
    // 1. getting the percent for each test
    // 2. multiplying it by the weight of the test
    // 3. dividing the result by the total weights of all tests
    // 4. multiplying the result by 100
    // the answer is rounded to the nearest percent
    return res.status(200).json(
        Math.round(
            (
                tests.reduce((acc, t) => acc + (t.mark/t.outOf)*t.weight, 0) / 
                tests.reduce((acc, t) => acc + t.weight, 0)
            ) * 100)
    );
});

app.get("/courses/:id/tests", (req, res) => {
    const id = Number(req.params.id);
    const course = coursesData.find(c => c.id===id);
    if (!course)
        return res.status(404).json({ error: "Course not found" });

    const tests = testsData.filter(t => t.courseId===id);
    if (tests.length===0)
        return tests.status(400).json({ error: "No tests found for that course" });

    return res.status(200).json(tests);
});

app.get("/courses/:id/average", (req, res) => {
    const id = Number(req.params.id);
    const course = coursesData.find(c => c.id===id);
    if (!course)
        return res.status(404).json({ error: "Course not found" });

    const tests = testsData.filter(t => t.courseId===id);
    if (tests.length===0)
        return tests.status(400).json({ error: "No tests found for that course" });

    return res.status(200).json(
        Math.round(
            (
                tests.reduce((acc, t) => acc + (t.mark/t.outOf)*t.weight, 0) / 
                tests.reduce((acc, t) => acc + t.weight, 0)
            ) * 100
        ));
});

app.listen(PORT, () => {
    console.log(`Server listening on http://localhost:${PORT}`);
});