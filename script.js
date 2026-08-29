// ==============================
// STUDENT TABLE
// ==============================

const studentTableBody = document.getElementById("studentTableBody");


// ==============================
// STUDENT FORM
// ==============================

const studentForm = document.getElementById("studentForm");


// ==============================
// FORM SUBMIT
// ==============================

studentForm.addEventListener("submit", function (e) {

    e.preventDefault();

    console.log("SUBMIT BUTTON WORKING");


    // ==============================
    // GET FORM VALUES
    // ==============================

    const studentName = document.getElementById("name").value.trim();

    const fatherName = document.getElementById("fatherName").value.trim();

    const studentClass = document.getElementById("studentClass").value.trim();

    const subjects = document.getElementById("subjects").value.trim();

    const marks = document.getElementById("marks").value.trim();


    // ==============================
    // CHECK FORM
    // ==============================

    if (
        studentName === "" ||
        fatherName === "" ||
        studentClass === "" ||
        subjects === "" ||
        marks === ""
    ) {

        console.log("Please fill all fields.");

        return;
    }


    // ==============================
    // CREATE STUDENT OBJECT
    // ==============================

    const student = {

        name: studentName,

        fatherName: fatherName,

        class: studentClass,

        subjects: subjects,

        marks: marks

    };


    // ==============================
    // SHOW DATA IN CONSOLE
    // ==============================

    console.log("Student Data:");

    console.log("Student Name:", student.name);

    console.log("Father Name:", student.fatherName);

    console.log("Class:", student.class);

    console.log("Subjects:", student.subjects);

    console.log("Marks:", student.marks);

});