let subjects = [];

// ---------------- ADD SUBJECT ----------------
function addSubject() {
    const subjectName = prompt("Enter Subject Name");
    if (!subjectName) return;

    const priority = prompt("Priority: Strong / Medium / Weak", "Medium");

    subjects.push({
        name: subjectName,
        priority: priority
    });

    // UI
    const div = document.createElement("div");
    div.innerHTML = `
        <input value="${subjectName}" disabled>
        <select disabled>
            <option>${priority}</option>
        </select>
    `;
    document.getElementById("subjects").appendChild(div);

    addProgress(subjectName);
}

// ---------------- PROGRESS ----------------
function addProgress(name) {
    const progressArea = document.getElementById("progressArea");
    const div = document.createElement("div");

    div.innerHTML = `
        <p>${name}</p>
        <div class="progress-bar">
            <div class="progress-fill" style="width:40%"></div>
        </div>
    `;
    progressArea.appendChild(div);
}

// ---------------- GENERATE TIMETABLE ----------------
function generateTimetable() {

    if (subjects.length === 0) {
        alert("Add at least one subject");
        return;
    }

    const examDate = new Date(document.getElementById("examDate").value);
    const dailyHours = parseInt(document.getElementById("dailyHours").value);
    const startTime = document.getElementById("startTime").value;

    if (!examDate || !dailyHours || !startTime) {
        alert("Please fill all study settings");
        return;
    }

    const today = new Date();
    const daysLeft = ((examDate - today) / (1000 * 60 * 60 * 24));

    let timetable = [];

    const priorityWeight = {
        "Weak": 3,
        "Medium": 2,
        "Strong": 1
    };

    let totalWeight = subjects.reduce(
        (sum, s) => sum + priorityWeight[s.priority], 0
    );

    for (let d = 0; d < daysLeft; d++) {
        let currentDate = new Date();
        currentDate.setDate(today.getDate() + d);

        let currentTime = startTime;

        subjects.forEach(sub => {
            let minutes =
                Math.floor((priorityWeight[sub.priority] / totalWeight) * dailyHours * 60);

            timetable.push({
                date: currentDate.toDateString(),
                start: currentTime,
                end: addMinutes(currentTime, minutes),
                subject: sub.name
            });

            currentTime = addMinutes(currentTime, minutes + 10); // break
        });
    }

    localStorage.setItem("timetable", JSON.stringify(timetable));
    window.location.href = "viewer.html";
}

// ---------------- TIME HELPER ----------------
function addMinutes(time, mins) {
    let [h, m] = time.split(":").map(Number);
    let total = h * 60 + m + mins;
    let nh = Math.floor(total / 60) % 24;
    let nm = total % 60;
    return `${String(nh).padStart(2, "0")}:${String(nm).padStart(2, "0")}`;
}
