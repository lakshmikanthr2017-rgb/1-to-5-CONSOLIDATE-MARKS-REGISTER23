/**
 * 1 to 5th Consolidated Marks Register Portal Script
 * Auto-Calculation Engine with Co-Curricular Grade Support
 * Designed by : LAKSHMIKANTH R (Mob:9844444871)
 */

let studentCount = 0;

document.addEventListener("DOMContentLoaded", () => {
    // Add default initial student block
    addNewStudent();
});

function addNewStudent() {
    studentCount++;
    const tbody = document.getElementById("studentTableBody");
    const blockId = `student_${studentCount}`;

    const examList = [
        { name: "FA-1", sem: "SEM-1", pct: "0.15", max: 60 },
        { name: "FA-2", sem: "SEM-1", pct: "0.15", max: 60 },
        { name: "SA-1", sem: "SEM-1", pct: "0.20", max: 80 },
        { name: "SEM-1", sem: "SEM-1", pct: "0.50", max: 200, isTotal: true },
        { name: "FA-3", sem: "SEM-2", pct: "0.15", max: 60 },
        { name: "FA-4", sem: "SEM-2", pct: "0.15", max: 60 },
        { name: "SA-2", sem: "SEM-2", pct: "0.20", max: 80 },
        { name: "SEM-2", sem: "SEM-2", pct: "0.50", max: 200, isTotal: true },
        { name: "SEM 1+2", sem: "SEM 1+2", pct: "1.00", max: 400, isFinal: true }
    ];

    examList.forEach((exam, idx) => {
        const tr = document.createElement("tr");
        tr.classList.add(blockId);
        if (exam.isTotal) tr.classList.add("sem-total");
        if (exam.isFinal) tr.classList.add("final-total");

        let rowHtml = "";

        // Merge student profile metadata across 9 sub-rows
        if (idx === 0) {
            rowHtml += `<td rowspan="9">${studentCount}</td>`;
            rowHtml += `<td rowspan="9"><input type="text" id="${blockId}_name" value="STUDENT NAME ${studentCount}"></td>`;
            rowHtml += `<td rowspan="9"><input type="number" value="210"></td>`;
            rowHtml += `<td rowspan="9"><input type="number" value="220"></td>`;
        }

        rowHtml += `<td>${exam.sem}</td>`;
        rowHtml += `<td><strong>${exam.name}</strong></td>`;
        rowHtml += `<td>${exam.pct}</td>`;

        // Core Subject Columns
        const subjects = ["kan", "eng", "mat", "evs"];
        subjects.forEach(sub => {
            if (exam.isTotal || exam.isFinal) {
                rowHtml += `<td id="${blockId}_${sub}_m_${idx}">0</td>`;
            } else {
                rowHtml += `<td><input type="number" class="mark-input ${blockId}_input ${sub}" data-exam="${idx}" value="0" min="0" max="${exam.max / 4}"></td>`;
            }
            rowHtml += `<td id="${blockId}_${sub}_g_${idx}">-</td>`;
        });

        // Totals & Grades
        rowHtml += `<td id="${blockId}_tot_m_${idx}">0</td>`;
        rowHtml += `<td id="${blockId}_tot_p_${idx}">0%</td>`;
        rowHtml += `<td id="${blockId}_tot_g_${idx}">-</td>`;

        // Co-Curricular Grades (FA-1 Row ONLY as per register design)
        if (idx === 0) {
            rowHtml += `<td><input type="text" style="width:28px;" value="A"></td>`;
            rowHtml += `<td><input type="text" style="width:28px;" value="A"></td>`;
            rowHtml += `<td><input type="text" style="width:28px;" value="A"></td>`;
            rowHtml += `<td><input type="text" style="width:28px;" value="A"></td>`;
            rowHtml += `<td><input type="text" style="width:28px;" value="A"></td>`;
        } else {
            rowHtml += `<td>-</td><td>-</td><td>-</td><td>-</td><td>-</td>`;
        }

        // Result column merged across 9 rows
        if (idx === 0) {
            rowHtml += `<td rowspan="9" id="${blockId}_result" style="font-weight:bold;">PENDING</td>`;
        }

        tr.innerHTML = rowHtml;
        tbody.appendChild(tr);
    });

    // Event listener for auto calculation
    document.querySelectorAll(`.${blockId}_input`).forEach(input => {
        input.addEventListener("input", () => calculateStudentData(blockId));
    });
}

function getGrade(percentage) {
    if (percentage >= 85) return "A+";
    if (percentage >= 70) return "A";
    if (percentage >= 50) return "B+";
    if (percentage >= 35) return "B";
    return "C";
}

function calculateStudentData(blockId) {
    const subjects = ["kan", "eng", "mat", "evs"];
    const maxMarks = [60, 60, 80, 200, 60, 60, 80, 200, 400];
    let marks = { kan: Array(9).fill(0), eng: Array(9).fill(0), mat: Array(9).fill(0), evs: Array(9).fill(0) };

    document.querySelectorAll(`.${blockId}_input`).forEach(input => {
        const sub = input.classList[2];
        const examIdx = parseInt(input.dataset.exam);
        const val = parseFloat(input.value) || 0;
        marks[sub][examIdx] = val;

        const grade = getGrade((val / (maxMarks[examIdx] / 4)) * 100);
        document.getElementById(`${blockId}_${sub}_g_${examIdx}`).innerText = grade;
    });

    // Sum Semester Totals
    subjects.forEach(sub => {
        marks[sub][3] = marks[sub][0] + marks[sub][1] + marks[sub][2]; // SEM 1
        marks[sub][7] = marks[sub][4] + marks[sub][5] + marks[sub][6]; // SEM 2
        marks[sub][8] = marks[sub][3] + marks[sub][7];                 // CONSOLIDATED

        [3, 7, 8].forEach(idx => {
            document.getElementById(`${blockId}_${sub}_m_${idx}`).innerText = marks[sub][idx];
            const grade = getGrade((marks[sub][idx] / (maxMarks[idx] / 4)) * 100);
            document.getElementById(`${blockId}_${sub}_g_${idx}`).innerText = grade;
        });
    });

    // Row Totals, Percentages, and Grades
    for (let i = 0; i < 9; i++) {
        const tot = marks.kan[i] + marks.eng[i] + marks.mat[i] + marks.evs[i];
        const pct = (tot / maxMarks[i]) * 100;
        const grade = getGrade(pct);

        document.getElementById(`${blockId}_tot_m_${i}`).innerText = tot;
        document.getElementById(`${blockId}_tot_p_${i}`).innerText = pct.toFixed(1) + "%";
        document.getElementById(`${blockId}_tot_g_${i}`).innerText = grade;
    }

    // Determine Final Result
    const finalPct = (marks.kan[8] + marks.eng[8] + marks.mat[8] + marks.evs[8]) / 400 * 100;
    const resCell = document.getElementById(`${blockId}_result`);
    if (finalPct >= 35) {
        resCell.innerText = "PASS";
        resCell.style.color = "green";
    } else {
        resCell.innerText = "FAIL";
        resCell.style.color = "red";
    }
}
