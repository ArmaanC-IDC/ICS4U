import express from "express";
import fs from "fs";
import path from "path";
import { MongoClient, ServerApiVersion } from 'mongodb';

const uri = "mongodb+srv://user:abcdefg@schoolapi.g7m289e.mongodb.net/?appName=SchoolAPI";
const app = express();
app.use(express.json());

const PORT = 3000;

const client = new MongoClient(uri);
let db;

const loadJson = async (collectionName) => {
    return await db.collection(collectionName).find({}).toArray();
}

const saveJson = async (collectionName, data) => {
    console.log(collectionName, data);
    const collection = db.collection(collectionName);
    await collection.deleteMany({});
    await collection.insertMany(data);
}

const teachersCollectionName = "teachers";
const studentsCollectionName = "students";
const testsCollectionName = "tests";
const coursesCollectionName = "courses";

let nextTeacherId;
let nextStudentId;
let nextTestId;
let nextCourseId;

let teachersData;
let studentsData;
let testsData;
let coursesData;

async function startServer() {
    await client.connect();
    console.log("Connected to MongoDB");

    db = client.db("SchoolAPI");

    teachersData = await loadJson(teachersCollectionName);
    studentsData = await loadJson(studentsCollectionName);
    testsData = await loadJson(testsCollectionName);
    coursesData = await loadJson(coursesCollectionName);

    nextTeacherId = teachersData.reduce((max, current) => Math.max(max, current.id), -1) + 1;
    nextStudentId = studentsData.reduce((max, current) => Math.max(max, current.id), -1) + 1;
    nextTestId = testsData.reduce((max, current) => Math.max(max, current.id), -1) + 1;
    nextCourseId = coursesData.reduce((max, current) => Math.max(max, current.id), -1) + 1;

    app.listen(PORT, () => {
        console.log(`Server listening on http://localhost:${PORT}`);
    });
}

await startServer().catch(console.error);

//teachers routes
//get all teachers
app.get("/teachers", async (req, res) => {
    return res.status(200).json(teachersData);
});

//get single teacher
app.get("/teachers/:id", async (req, res) => {
    const id = Number(req.params.id);
    const t = teachersData.find(t => t.id===id);
    if (!t) return res.status(404).json({ error: "Teacher not found" });
    return res.status(200).json(t);
});

//create teacher
app.post("/teachers", async (req, res) => {
    const { firstName, lastName, email, department, room } = req.body;
    if (!firstName || !lastName || !email || !department) 
        return res.status(400).json({ error: "Missing required fields" });

    if (email && teachersData.some(t => t.email===email)){
        return res.status(400).json({ error: "Teacher with this email already exists" });
    }

    const newTeacher = {
        id: nextTeacherId++,
        firstName,
        lastName,
        email,
        department,
        room
    }

    teachersData.push(newTeacher);
    await saveJson(teachersCollectionName, teachersData);
    return res.status(201).json(newTeacher);
});

//update teacher
app.put("/teachers/:id", async (req, res) => {
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
    await saveJson(teachersCollectionName, teachersData);
    res.json(teacher);
});

//delete teacher
app.delete("/teachers/:id", async (req, res) => {
    const id = Number(req.params.id);
    const assignedToCourse = coursesData.some(c => c.teacherId===id);
    if (assignedToCourse) return res.status(400).json(
        {error: "Cannot delete that teacher because they are assigned to a course"}
    );

    const index = teachersData.findIndex(t => t.id===id);
    if (index===-1) return res.status(404).json({ error: "Teacher not found" });
    const deleted = teachersData.splice(index, 1)[0];
    await saveJson(teachersCollectionName, teachersData);
    res.status(200).json(deleted);
});

//Courses routes
//get all courses
app.get("/courses", async (req, res) => {
    return res.status(200).json(coursesData);
});

//get single course
app.get("/courses/:id", async (req, res) => {
    const id = Number(req.params.id);
    const course = coursesData.find(c => c.id===id);
    if (!course) return res.status(404).json({ error: "Course not found "});
    return res.status(200).json(course);
});

//create course
app.post("/courses", async (req, res) => {
    const { code, name, teacherId, semester, room, schedule } = req.body;
    if (!code || !name || !teacherId || !semester || !room){
        return res.status(400).json({ error: "Missing required fields" });
    }

    if (teacherId && !teachersData.some(t => t.id===teacherId)){
        return res.status(400).json({ error: "Invalid teacher id" })
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
    await saveJson(coursesCollectionName, coursesData);
    return res.status(201).json(newCourse);
});

//update course
app.put("/courses/:id", async (req, res) => {
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
    await saveJson(coursesCollectionName, coursesData);
    res.json(course);
});

//delete course
app.delete("/courses/:id", async (req, res) => {
    const id = Number(req.params.id);
    const index = coursesData.findIndex(c => c.id===id);
    if (index===-1){
        return res.status(404).json({ error: "Course not found" });
    }

    if (testsData.some(t => t.courseId===id)){
        return res.status(400).json({ error: "Could not delete course: tests exist for that course "});
    }

    const deleted = coursesData.splice(index, 1)[0];
    await saveJson(coursesCollectionName, coursesData);

    res.status(200).json(deleted);
});

//students routes
//get all students
app.get("/students", async (req, res) => {
    res.status(200).json(studentsData);
});

//get single student
app.get("/students/:id", async (req, res) => {
    const id = Number(req.params.id);
    const student = studentsData.find(s => s.id===id);
    if (student){
        return res.status(200).json(student);
    }
    return res.status(404).json({ error: "Student not found" });
});

//create student
app.post("/students", async (req, res) => {
    const { firstName, lastName, grade, studentNumber, homeroom, courses } = req.body || {};
    if (!firstName || !lastName || !grade || !studentNumber){
        return res.status(400).json({ error: "Missing required fields "});
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
    await saveJson(studentsCollectionName, studentsData);
    return res.status(201).json(newStudent);
});

//update student
app.put("/students/:id", async (req, res) => {
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
    await saveJson(studentsCollectionName, studentsData);
    return res.status(200).json(studentsData[index]);
});

//delete student
app.delete("/students/:id", async (req, res) => {
    const id = Number(req.params.id);

    const index = studentsData.findIndex(s => s.id===id);
    if (index===-1) return res.status(404).json({ error: "Student not found" });

    if (testsData.some(t => t.studentId===id)){
        return res.status(400).json({ error: "Tests exist for that student" });
    }

    const deleted = studentsData.splice(index, 1)[0];
    await saveJson(studentsCollectionName, studentsData);
    res.status(200).json(deleted);
});

//tests routes
//get all tests
app.get("/tests", async (req, res) => {
    res.status(200).json(testsData);
});

//get single test
app.get("/tests/:id", async (req, res) => {
    const id = Number(req.params.id);
    const test = testsData.find(t => t.id===id);
    if (!test) return res.status(404).json({ error: "Test not found" });
    return res.status(200).json(test);
});

//create test
app.post("/tests", async (req, res) => {
    const { studentId, courseId, testName, date, mark, outOf, weight } = req.body;
    if (!studentId || !courseId || !testName || !date || !mark || !outOf) 
        return res.status(400).json({ error: "Missing required fields" });

    if (studentId && !studentsData.some(s => s.id===studentId)){
        return res.status(400).json({ error: "Invalid student id" });
    }

     if (courseId && !coursesData.some(c => c.id===courseId)){
        return res.status(400).json({ error: "Invalid course id" });
    }

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
    await saveJson(testsCollectionName, testsData);
    res.status(201).json(newTest);
});

//update test
app.put("/tests/:id", async (req, res) => {
    const id = Number(req.params.id);
    const { studentId, courseId, testName, date, mark, outOf, weight } = req.body || {};
    if (!studentId && !courseId && !testName && !date && !mark && !outOf && !weight){
        return res.status(400).json({ error: "No fields provided to update" });
    }

    const index = testsData.findIndex(t => t.id===id);
    if (index===-1){
        return res.status(404).json({ error: "Test not found" });
    }

    if (studentId && !studentsData.some(s => s.id===studentId)){
        return res.status(400).json({ error: "Invalid student id" });
    }

    if (courseId && !coursesData.some(c => c.id===courseId)){
        return res.status(400).json({ error: "Invalid course id" });
    }

    ["studentId", "courseId", "testName", "date", "mark", "outOf", "weight"].forEach(param => {
        testsData[index][param] = req.body[param] || testsData[index][param];
    });
    await saveJson(testsCollectionName, testsData);
    return res.status(200).json(testsData[index]);
});

//delete test
app.delete("/tests/:id", async (req, res) => {
    const id = Number(req.params.id);

    const index = testsData.findIndex(t => t.id===id);
    if (index===-1) return res.status(404).json({ error: "Test not found" });
    const deleted = testsData.splice(index, 1)[0];
    await saveJson(testsCollectionName, testsData);
    res.status(200).json(deleted);
});

const getAllTestByStudent = async (req, res) => {

}

//list all tests for specific student
app.get("/students/:id/tests", async (req, res) => {
    const id = Number(req.params.id);
    const student = studentsData.find(s => s.id===id);
    if (!student){
        return res.status(404).json({ error: "Student not found" });
    }
    const tests = testsData.filter(t => t.studentId===student.id);
    if (tests.length===0){
        return res.status(204).send();
    }
    return res.status(200).json(tests);
});

app.get("/students/:id/average", async (req, res) => {
    const id = Number(req.params.id);
    const student = studentsData.find(s => s.id===id);
    if (!student){
        return res.status(404).json({ error: "Student not found" });
    }

    const tests = testsData.filter(t => t.studentId===student.id);
    if (tests.length===0){
        return res.status(204).send();
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

app.get("/courses/:id/tests", async (req, res) => {
    const id = Number(req.params.id);
    const course = coursesData.find(c => c.id===id);
    if (!course)
        return res.status(404).json({ error: "Course not found" });

    const tests = testsData.filter(t => t.courseId===id);
    if (tests.length===0)
        return res.status(204).send();

    return res.status(200).json(tests);
});

app.get("/courses/:id/average", async (req, res) => {
    const id = Number(req.params.id);
    const course = coursesData.find(c => c.id===id);
    if (!course)
        return res.status(404).json({ error: "Course not found" });

    const tests = testsData.filter(t => t.courseId===id);
    if (tests.length===0)
        return res.status(204).send();

    return res.status(200).json(
        Math.round(
            (
                tests.reduce((acc, t) => acc + (t.mark/t.outOf)*t.weight, 0) / 
                tests.reduce((acc, t) => acc + t.weight, 0)
            ) * 100
        ));
});

app.get("/teachers/:id/summary", async (req, res) => {
    const id = Number(req.params.id);
    const t = teachersData.find(t => t.id===id);
    if (!t) return res.status(404).json({ error: "Teacher not found" });
    return res.status(200).json({
        teacherId: id,
        teacherName: `${t.firstName} ${t.lastName}`,
        courses: coursesData
            .filter(c => c.teacherId===id)
            .map(c => {return {
                courseId: c.id, 
                code: c.code, 
                testCount: testsData.reduce((acc, test) => test.courseId===c.id ? 1 + acc : acc , 0)
            }})
    }); 
});