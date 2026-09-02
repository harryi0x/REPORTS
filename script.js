console.log("SCRIPT.JS LOADED");


// ======================================================
//                  STUDENT ARRAY
// ======================================================

let students = JSON.parse(localStorage.getItem("students")) || [];

let editIndex = -1;


// ======================================================
//                  SELECT FORM
// ======================================================

const studentForm = document.getElementById("studentForm");


// ======================================================
//                  SELECT INPUTS
// ======================================================

const nameInput = document.getElementById("name");

const fatherNameInput = document.getElementById("fatherName");

const studentClassInput = document.getElementById("studentClass");

const subjectsInput = document.getElementById("subjects");

const marksInput = document.getElementById("marks");


// ======================================================
//                  SELECT TABLE
// ======================================================

const studentTableBody = document.getElementById("studentTableBody");


// ======================================================
//                  DISPLAY STUDENTS
// ======================================================

function displayStudents() {

    studentTableBody.innerHTML = "";

    if (students.length === 0) {

        studentTableBody.innerHTML = `
        
            <tr>

                <td colspan="7" class="text-center text-muted py-4">

                    No students added yet.

                </td>

            </tr>
        
        `;

        return;
    }


    students.forEach(function (student, index) {

        studentTableBody.innerHTML += `
        
            <tr>

                <td>${student.name}</td>

                <td>${student.fatherName}</td>

                <td>${student.class}</td>

                <td>${student.subjects}</td>

                <td>${student.marks}</td>

                <td>${student.date}</td>

                <td>

                    <button
                        onclick="editStudent(${index})"
                        class="btn btn-warning btn-sm me-1">

                        <i class="fas fa-edit"></i>
                        Edit

                    </button>


                    <button
                        onclick="deleteStudent(${index})"
                        class="btn btn-danger btn-sm">

                        <i class="fas fa-trash"></i>
                        Delete

                    </button>

                </td>

            </tr>
        
        `;

    });

}


// ======================================================
//                  FORM SUBMIT
// ======================================================

studentForm.addEventListener("submit", function (event) {

    event.preventDefault();


    // ==================================================
    // GET VALUES
    // ==================================================

    const name = nameInput.value.trim();

    const fatherName = fatherNameInput.value.trim();

    const studentClass = studentClassInput.value.trim();

    const subjects = subjectsInput.value.trim();

    const marks = marksInput.value.trim();


    // ==================================================
    // VALIDATION
    // ==================================================

    if (
        name === "" ||
        fatherName === "" ||
        studentClass === "" ||
        subjects === "" ||
        marks === ""
    ) {

        alert("Please fill all fields.");

        return;

    }


    // ==================================================
    // STUDENT DATE
    // ==================================================

    let studentDate;


    if (editIndex === -1) {

        studentDate = new Date()
            .toISOString()
            .split("T")[0];

    } else {

        // Keep old date while updating

        studentDate = students[editIndex].date;

    }


    // ==================================================
    // STUDENT OBJECT
    // ==================================================

    const student = {

        name: name,

        fatherName: fatherName,

        class: studentClass,

        subjects: subjects,

        marks: marks,

        date: studentDate

    };


    // ==================================================
    // ADD STUDENT
    // ==================================================

    if (editIndex === -1) {

        students.push(student);

        console.log("Student Added:", student);

    }


    // ==================================================
    // UPDATE STUDENT
    // ==================================================

    else {

        students[editIndex] = student;

        console.log("Student Updated:", student);

        editIndex = -1;

    }


    // ==================================================
    // SAVE LOCAL STORAGE
    // ==================================================

    localStorage.setItem(
        "students",
        JSON.stringify(students)
    );


    // ==================================================
    // DISPLAY STUDENTS
    // ==================================================

    displayStudents();


    // ==================================================
    // CLEAR FORM
    // ==================================================

    studentForm.reset();


    // ==================================================
    // CLOSE MODAL
    // ==================================================

    const modalElement =
        document.getElementById("studentModal");


    if (modalElement && typeof bootstrap !== "undefined") {

        const modal =
            bootstrap.Modal.getInstance(modalElement);


        if (modal) {

            modal.hide();

        }

    }

});


// ======================================================
//                  EDIT STUDENT
// ======================================================

function editStudent(index) {

    const student = students[index];


    if (!student) {

        return;

    }


    // ==================================================
    // FILL FORM
    // ==================================================

    nameInput.value = student.name;

    fatherNameInput.value = student.fatherName;

    studentClassInput.value = student.class;

    subjectsInput.value = student.subjects;

    marksInput.value = student.marks;


    // ==================================================
    // SET EDIT INDEX
    // ==================================================

    editIndex = index;


    // ==================================================
    // OPEN MODAL
    // ==================================================

    const modalElement =
        document.getElementById("studentModal");


    if (modalElement && typeof bootstrap !== "undefined") {

        const modal =
            bootstrap.Modal.getOrCreateInstance(modalElement);

        modal.show();

    }


    console.log("Editing Student:", student);

}


// Make function available for inline onclick

window.editStudent = editStudent;


// ======================================================
//                  DELETE STUDENT
// ======================================================

function deleteStudent(index) {

    if (!students[index]) {

        return;

    }


    const confirmDelete =
        confirm("Are you sure you want to delete this student?");


    if (!confirmDelete) {

        return;

    }


    // ==================================================
    // DELETE
    // ==================================================

    students.splice(index, 1);


    // ==================================================
    // SAVE UPDATED ARRAY
    // ==================================================

    localStorage.setItem(
        "students",
        JSON.stringify(students)
    );


    // ==================================================
    // DISPLAY UPDATED TABLE
    // ==================================================

    displayStudents();


    console.log("Student Deleted");

}


// Make function available for inline onclick

window.deleteStudent = deleteStudent;


// ======================================================
//             DISPLAY DATA WHEN PAGE LOADS
// ======================================================

displayStudents();



// ======================================================
//                    REPORT SYSTEM
// ======================================================


// ======================================================
//                  REPORT ELEMENTS
// ======================================================

const startDateInput =
    document.getElementById("startDate");

const endDateInput =
    document.getElementById("endDate");

const generateReportBtn =
    document.getElementById("generateReportBtn");

const reportSearch =
    document.getElementById("reportSearch");

const reportTableBody =
    document.getElementById("reportTableBody");

const downloadPdfBtn =
    document.getElementById("downloadPdfBtn");


// ======================================================
//                  REPORT DATA
// ======================================================

let reportStudents = [];


// ======================================================
//                  GENERATE REPORT
// ======================================================

generateReportBtn.addEventListener("click", function () {

    const startDate =
        startDateInput.value;

    const endDate =
        endDateInput.value;


    // ==================================================
    // VALIDATION
    // ==================================================

    if (startDate === "" || endDate === "") {

        alert(
            "Please select Start Date and End Date."
        );

        return;

    }


    if (startDate > endDate) {

        alert(
            "Start Date cannot be greater than End Date."
        );

        return;

    }


    // ==================================================
    // FILTER STUDENTS
    // ==================================================

    reportStudents =
        students.filter(function (student) {

            return (
                student.date >= startDate &&
                student.date <= endDate
            );

        });


    // ==================================================
    // CLEAR REPORT SEARCH
    // ==================================================

    reportSearch.value = "";


    // ==================================================
    // DISPLAY REPORT
    // ==================================================

    displayReportStudents();


    console.log(
        "Report Generated:",
        reportStudents
    );

});


// ======================================================
//              DISPLAY REPORT STUDENTS
// ======================================================

function displayReportStudents() {

    reportTableBody.innerHTML = "";


    // ==================================================
    // NO DATA
    // ==================================================

    if (reportStudents.length === 0) {

        reportTableBody.innerHTML = `
        
            <tr>

                <td
                    colspan="6"
                    class="text-center text-muted py-4">

                    No students found for selected date range.

                </td>

            </tr>
        
        `;

        return;

    }


    // ==================================================
    // DISPLAY DATA
    // ==================================================

    reportStudents.forEach(function (student) {

        reportTableBody.innerHTML += `
        
            <tr>

                <td>${student.name}</td>

                <td>${student.fatherName}</td>

                <td>${student.class}</td>

                <td>${student.subjects}</td>

                <td>${student.marks}</td>

                <td>${student.date}</td>

            </tr>
        
        `;

    });

}


// ======================================================
//                  REPORT SEARCH
// ======================================================

reportSearch.addEventListener("input", function () {

    const searchValue =
        reportSearch.value
            .toLowerCase()
            .trim();


    // ==================================================
    // IF SEARCH IS EMPTY
    // ==================================================

    if (searchValue === "") {

        displayReportStudents();

        return;

    }


    // ==================================================
    // FILTER REPORT STUDENTS
    // ==================================================

    const filteredReportStudents =
        reportStudents.filter(function (student) {

            return String(student.name)
                .toLowerCase()
                .includes(searchValue);

        });


    // ==================================================
    // CLEAR TABLE
    // ==================================================

    reportTableBody.innerHTML = "";


    // ==================================================
    // NO SEARCH RESULT
    // ==================================================

    if (filteredReportStudents.length === 0) {

        reportTableBody.innerHTML = `
        
            <tr>

                <td
                    colspan="6"
                    class="text-center text-muted py-4">

                    No student found.

                </td>

            </tr>
        
        `;

        return;

    }


    // ==================================================
    // DISPLAY SEARCH RESULTS
    // ==================================================

    filteredReportStudents.forEach(function (student) {

        reportTableBody.innerHTML += `
        
            <tr>

                <td>${student.name}</td>

                <td>${student.fatherName}</td>

                <td>${student.class}</td>

                <td>${student.subjects}</td>

                <td>${student.marks}</td>

                <td>${student.date}</td>

            </tr>
        
        `;

    });

});



// ======================================================
//                    PDF DOWNLOAD
// ======================================================

downloadPdfBtn.addEventListener("click", function () {


    // ==================================================
    // CHECK REPORT
    // ==================================================

    if (reportStudents.length === 0) {

        alert(
            "Please generate a report first."
        );

        return;

    }


    // ==================================================
    // CHECK jsPDF
    // ==================================================

    if (typeof window.jspdf === "undefined") {

        alert(
            "PDF library is not loaded."
        );

        return;

    }


    // ==================================================
    // GET SEARCH VALUE
    // ==================================================

    const searchValue =
        reportSearch.value
            .trim()
            .toLowerCase();


    // ==================================================
    // SELECT STUDENTS FOR PDF
    // ==================================================

    let pdfStudents = reportStudents;


    if (searchValue !== "") {

        pdfStudents =
            reportStudents.filter(function (student) {

                return String(student.name)
                    .toLowerCase()
                    .includes(searchValue);

            });

    }


    // ==================================================
    // CHECK PDF DATA
    // ==================================================

    if (pdfStudents.length === 0) {

        alert(
            "No student found for PDF."
        );

        return;

    }


    // ==================================================
    // CREATE PDF
    // ==================================================

    const { jsPDF } = window.jspdf;

    const doc = new jsPDF();


    // ==================================================
    // TITLE
    // ==================================================

    doc.setFont(
        "helvetica",
        "bold"
    );

    doc.setFontSize(20);

    doc.text(
        "Student Report",
        105,
        20,
        {
            align: "center"
        }
    );


    // ==================================================
    // REPORT INFORMATION
    // ==================================================

    doc.setFont(
        "helvetica",
        "normal"
    );

    doc.setFontSize(10);


    doc.text(
        "From Date: " + startDateInput.value,
        15,
        32
    );


    doc.text(
        "To Date: " + endDateInput.value,
        15,
        39
    );


    doc.text(
        "Total Students: " + pdfStudents.length,
        15,
        46
    );


    // ==================================================
    // SEARCHED STUDENT
    // ==================================================

    if (searchValue !== "") {

        doc.setFont(
            "helvetica",
            "bold"
        );


        doc.text(
            "Student: " + pdfStudents[0].name,
            15,
            53
        );


        doc.setFont(
            "helvetica",
            "normal"
        );

    }


    // ==================================================
    // TABLE POSITION
    // ==================================================

    let y =
        searchValue !== ""
            ? 68
            : 61;


    // ==================================================
    // TABLE HEADER FUNCTION
    // ==================================================

    function drawTableHeader() {

        doc.setFont(
            "helvetica",
            "bold"
        );

        doc.setFontSize(9);


        doc.text(
            "Name",
            10,
            y
        );


        doc.text(
            "Father",
            48,
            y
        );


        doc.text(
            "Class",
            88,
            y
        );


        doc.text(
            "Subjects",
            115,
            y
        );


        doc.text(
            "Marks",
            165,
            y
        );


        doc.text(
            "Date",
            185,
            y
        );


        doc.line(
            10,
            y + 3,
            200,
            y + 3
        );


        y += 11;


        doc.setFont(
            "helvetica",
            "normal"
        );

    }


    // ==================================================
    // FIRST TABLE HEADER
    // ==================================================

    drawTableHeader();


    // ==================================================
    // STUDENT DATA
    // ==================================================

    pdfStudents.forEach(function (student) {


        // ==================================================
        // NEW PAGE
        // ==================================================

        if (y > 275) {

            doc.addPage();

            y = 20;


            drawTableHeader();

        }


        // ==================================================
        // ROW DATA
        // ==================================================

        doc.text(
            String(student.name),
            10,
            y
        );


        doc.text(
            String(student.fatherName),
            48,
            y
        );


        doc.text(
            String(student.class),
            88,
            y
        );


        doc.text(
            String(student.subjects),
            115,
            y
        );


        doc.text(
            String(student.marks),
            165,
            y
        );


        doc.text(
            String(student.date),
            185,
            y
        );


        // ==================================================
        // ROW LINE
        // ==================================================

        doc.line(
            10,
            y + 3,
            200,
            y + 3
        );


        y += 10;

    });


    // ==================================================
    // PAGE NUMBERS
    // ==================================================

    const totalPages =
        doc.internal.getNumberOfPages();


    for (
        let page = 1;
        page <= totalPages;
        page++
    ) {

        doc.setPage(page);


        doc.setFont(
            "helvetica",
            "normal"
        );


        doc.setFontSize(9);


        doc.text(
            "Page " +
            page +
            " of " +
            totalPages,
            105,
            290,
            {
                align: "center"
            }
        );

    }


    // ==================================================
    // SAVE PDF
    // ==================================================

    if (searchValue !== "") {

        doc.save(
            pdfStudents[0].name +
            "-student-report.pdf"
        );

    } else {

        doc.save(
            "student-report.pdf"
        );

    }


    console.log(
        "PDF Generated:",
        pdfStudents
    );

});



// ======================================================
//                  STUDENT SEARCH
// ======================================================

const searchStudent =
    document.getElementById("searchStudent");


searchStudent.addEventListener("input", function () {

    const searchValue =
        searchStudent.value
            .toLowerCase()
            .trim();


    // ==================================================
    // CLEAR TABLE
    // ==================================================

    studentTableBody.innerHTML = "";


    // ==================================================
    // FILTER STUDENTS
    // ==================================================

    const filteredStudents =
        students.filter(function (student) {

            return String(student.name)
                .toLowerCase()
                .includes(searchValue);

        });


    // ==================================================
    // NO RESULT
    // ==================================================

    if (filteredStudents.length === 0) {

        studentTableBody.innerHTML = `
        
            <tr>

                <td
                    colspan="7"
                    class="text-center text-muted py-4">

                    No student found.

                </td>

            </tr>
        
        `;

        return;

    }


    // ==================================================
    // DISPLAY SEARCH RESULTS
    // ==================================================

    filteredStudents.forEach(function (student) {


        // Get original index

        const originalIndex =
            students.indexOf(student);


        studentTableBody.innerHTML += `
        
            <tr>

                <td>${student.name}</td>

                <td>${student.fatherName}</td>

                <td>${student.class}</td>

                <td>${student.subjects}</td>

                <td>${student.marks}</td>

                <td>${student.date}</td>

                <td>

                    <button
                        onclick="editStudent(${originalIndex})"
                        class="btn btn-warning btn-sm me-1">

                        <i class="fas fa-edit"></i>
                        Edit

                    </button>


                    <button
                        onclick="deleteStudent(${originalIndex})"
                        class="btn btn-danger btn-sm">

                        <i class="fas fa-trash"></i>
                        Delete

                    </button>

                </td>

            </tr>
        
        `;

    });

});