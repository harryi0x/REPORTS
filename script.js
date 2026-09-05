const currentUser =
    JSON.parse(localStorage.getItem("currentUser"));
if (!currentUser) {
    window.location.href = "login.html";
}
const loggedInUser =
    document.getElementById("loggedInUser");
if (currentUser && loggedInUser) {

    loggedInUser.innerHTML =
        `<i class="fas fa-user me-1"></i>
        ${currentUser.name}
        (${currentUser.role.toUpperCase()})`;
}
const isAdmin =
    currentUser &&
    currentUser.role === "admin";
const logoutBtn =
    document.getElementById("logoutBtn");
if (logoutBtn) {
    logoutBtn.addEventListener("click", function () {
        const confirmLogout =
            confirm("Are you sure you want to logout?");
        if (!confirmLogout) {
            return;
        }
        localStorage.removeItem("currentUser");
        window.location.href = "login.html";
    });
}
const addStudentBtn =
    document.getElementById("addStudentBtn");
if (addStudentBtn && !isAdmin) {
    addStudentBtn.style.display = "none";
}
console.log("SCRIPT.JS LOADED");
let students = JSON.parse(localStorage.getItem("students")) || [];
let editIndex = -1;
const studentForm = document.getElementById("studentForm");
const nameInput = document.getElementById("name");
const fatherNameInput = document.getElementById("fatherName");
const studentClassInput = document.getElementById("studentClass");
const subjectsInput = document.getElementById("subjects");
const marksInput = document.getElementById("marks");
const studentTableBody = document.getElementById("studentTableBody");
function displayStudents() {
    studentTableBody.innerHTML = "";
    if (students.length === 0) {
        studentTableBody.innerHTML = `
            <tr>
                <td colspan="7"
                    class="text-center text-muted py-4">
                    No students added yet.
                </td>
            </tr>
        `;
        return;
    }
    students.forEach(function (student, index) {
        let actionButtons = "";
        if (isAdmin) {
            actionButtons = `
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
            `;
        }

        studentTableBody.innerHTML += `
            <tr>
                <td>${student.name}</td>
                <td>${student.fatherName}</td>
                <td>${student.class}</td>
                <td>${student.subjects}</td>
                <td>${student.marks}</td>
                <td>${student.date}</td>
                <td>
                    ${actionButtons}
                </td>
            </tr>
        `;
    });
}
studentForm.addEventListener("submit", function (event) {
    if (!isAdmin) {
        alert("You are not authorized to add or update students.");
        return;
    }
    event.preventDefault();
    const name = nameInput.value.trim();
    const fatherName = fatherNameInput.value.trim();
    const studentClass = studentClassInput.value.trim();
    const subjects = subjectsInput.value.trim();
    const marks = marksInput.value.trim();
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
    let studentDate;
    if (editIndex === -1) {
        studentDate = new Date()
            .toISOString()
            .split("T")[0];
    } else {
        studentDate = students[editIndex].date;
    }
    const student = {
        name: name,
        fatherName: fatherName,
        class: studentClass,
        subjects: subjects,
        marks: marks,
        date: studentDate
    };
    if (editIndex === -1) {
        students.unshift(student);
        console.log("Student Added:", student);
    }
    else {
        students[editIndex] = student;
        console.log("Student Updated:", student);
        editIndex = -1;
    }
    localStorage.setItem(
        "students",
        JSON.stringify(students)
    );
    displayStudents();
    studentForm.reset();
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
function editStudent(index) {
    if (!isAdmin) {
        alert("You are not authorized to edit students.");
        return;
    }
    const student = students[index];
    if (!student) {
        return;
    }
    nameInput.value = student.name;
    fatherNameInput.value = student.fatherName;
    studentClassInput.value = student.class;
    subjectsInput.value = student.subjects;
    marksInput.value = student.marks;
    editIndex = index;
    const modalElement =
        document.getElementById("studentModal");
    if (modalElement && typeof bootstrap !== "undefined") {
        const modal =
            bootstrap.Modal.getOrCreateInstance(modalElement);
        modal.show();
    }
    console.log("Editing Student:", student);
}
window.editStudent = editStudent;
function deleteStudent(index) {
    if (!isAdmin) {
        alert("You are not authorized to delete students.");
        return;
    }
    if (!students[index]) {
        return;
    }
    const confirmDelete =
        confirm("Are you sure you want to delete this student?");
    if (!confirmDelete) {
        return;
    }
    students.splice(index, 1);
    localStorage.setItem(
        "students",
        JSON.stringify(students)
    );
    displayStudents();
    console.log("Student Deleted");
}
window.deleteStudent = deleteStudent;
displayStudents();
const startDateInput =
    document.getElementById("startDate");
const endDateInput =
    document.getElementById("endDate");
const today = new Date();
const todayDate =
    today.getFullYear() + "-" +
    String(today.getMonth() + 1).padStart(2, "0") + "-" +
    String(today.getDate()).padStart(2, "0");
endDateInput.value = todayDate;
const generateReportBtn =
    document.getElementById("generateReportBtn");
const reportSearch =
    document.getElementById("reportSearch");
const reportTableBody =
    document.getElementById("reportTableBody");
const downloadPdfBtn =
    document.getElementById("downloadPdfBtn");
let reportStudents = [];
generateReportBtn.addEventListener("click", function () {
    const startDate =
        startDateInput.value;
    const endDate =
        endDateInput.value;
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
    reportStudents =
        students.filter(function (student) {
            return (
                student.date >= startDate &&
                student.date <= endDate
            );
        });
    reportSearch.value = "";
    displayReportStudents();
    console.log(
        "Report Generated:",
        reportStudents
    );
});
function displayReportStudents() {
    reportTableBody.innerHTML = "";
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
reportSearch.addEventListener("input", function () {
    const searchValue =
        reportSearch.value
            .toLowerCase()
            .trim();
    if (searchValue === "") {
        displayReportStudents();
        return;
    }
    const filteredReportStudents =
        reportStudents.filter(function (student) {
            return String(student.name)
                .toLowerCase()
                .includes(searchValue);
        });
    reportTableBody.innerHTML = "";
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
downloadPdfBtn.addEventListener("click", function () {
    if (reportStudents.length === 0) {
        alert(
            "Please generate a report first."
        );
        return;
    }
    if (typeof window.jspdf === "undefined") {
        alert(
            "PDF library is not loaded."
        );
        return;
    }
    const searchValue =
        reportSearch.value
            .trim()
            .toLowerCase();
    let pdfStudents = reportStudents;
    if (searchValue !== "") {
        pdfStudents =
            reportStudents.filter(function (student) {
                return String(student.name)
                    .toLowerCase()
                    .includes(searchValue);
            });
    }
    if (pdfStudents.length === 0) {
        alert(
            "No student found for PDF."
        );
        return;
    }
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
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
    let y =
        searchValue !== ""
            ? 68
            : 61;
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
    drawTableHeader();
    pdfStudents.forEach(function (student) {
        if (y > 275) {
            doc.addPage();
            y = 20;
            drawTableHeader();
        }
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
        doc.line(
            10,
            y + 3,
            200,
            y + 3
        );
        y += 10;
    });
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
const searchStudent =
    document.getElementById("searchStudent");
searchStudent.addEventListener("input", function () {
    const searchValue =
        searchStudent.value
            .toLowerCase()
            .trim();
    studentTableBody.innerHTML = "";
    const filteredStudents =
        students.filter(function (student) {
            return String(student.name)
                .toLowerCase()
                .includes(searchValue);
        });
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
    filteredStudents.forEach(function (student) {
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