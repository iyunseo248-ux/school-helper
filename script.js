// =======================
// 데이터 저장
// =======================

let tasks =
  JSON.parse(localStorage.getItem("tasks")) || [];

let studyData =
  JSON.parse(localStorage.getItem("studyData")) || [];


// =======================
// 과제 추가
// =======================

function addTask() {

  const text =
    document.getElementById("task").value;

  const deadline =
    document.getElementById("deadline").value;

  const importance =
    document.getElementById("importance").value;

  if (!text || !deadline) {

    alert("과제와 날짜를 입력하세요!");
    return;
  }

  tasks.push({
    text,
    deadline,
    importance,
    done: false
  });

  renderTasks();

  document.getElementById("task").value = "";
}


// =======================
// D-DAY 계산
// =======================

function getDDay(deadline) {

  const today =
    new Date();

  const target =
    new Date(deadline);

  today.setHours(0,0,0,0);
  target.setHours(0,0,0,0);

  const diff =
    Math.ceil(
      (target - today)
      / (1000 * 60 * 60 * 24)
    );

  if (diff > 0) {
    return `D-${diff}`;
  }

  if (diff === 0) {
    return "D-Day";
  }

  return `D+${Math.abs(diff)}`;
}


// =======================
// 과제 출력
// =======================

function renderTasks() {

  const list =
    document.getElementById("taskList");

  list.innerHTML = "";

  tasks.forEach((t, i) => {

    let color = "#22c55e";

    if (t.importance == 2) {
      color = "#facc15";
    }

    if (t.importance == 3) {
      color = "#ef4444";
    }

    const li =
      document.createElement("li");

    li.innerHTML = `

      <div class="task-card">

        <div>

          <input
            type="checkbox"
            onclick="toggleDone(${i})"
            ${t.done ? "checked" : ""}
          >

          <span class="
            ${t.done ? "done" : ""}
          ">
            ${t.text}
          </span>

          <br>

          <small>
            📅 ${t.deadline}
          </small>

          <br>

          <small style="
            color:${color};
            font-weight:bold;
          ">
            ${getDDay(t.deadline)}
          </small>

        </div>

        <button
          onclick="deleteTask(${i})"
          class="delete-btn"
        >
          삭제
        </button>

      </div>

    `;

    list.appendChild(li);
  });

  localStorage.setItem(
    "tasks",
    JSON.stringify(tasks)
  );

  updateTodayTasks();
}


// =======================
// 체크
// =======================

function toggleDone(i) {

  tasks[i].done =
    !tasks[i].done;

  renderTasks();
}


// =======================
// 삭제
// =======================

function deleteTask(i) {

  tasks.splice(i, 1);

  renderTasks();
}


// =======================
// 시간 포맷
// =======================

function formatMinutes(min) {

  const h =
    Math.floor(min / 60);

  const m =
    min % 60;

  return `${h}시간 ${m}분`;
}


// =======================
// 공부 기록 추가
// =======================

function addStudy() {

  const subject =
    document.getElementById("subject").value;

  const hour =
    Number(
      document.getElementById("hour").value
    ) || 0;

  const minute =
    Number(
      document.getElementById("minute").value
    ) || 0;

  const time =
    hour * 60 + minute;

  const date =
    document.getElementById("studyDate").value;

  if (!subject || !date || time <= 0) {

    alert("입력하세요!");
    return;
  }

  const exist =
    studyData.find(
      d =>
        d.subject === subject &&
        d.date === date
    );

  if (exist) {

    exist.time += time;

  } else {

    studyData.push({
      subject,
      time,
      date
    });
  }

  renderStudy();
}


// =======================
// 공부 기록 출력
// =======================

function renderStudy() {

  const list =
    document.getElementById("studyList");

  const summary =
    document.getElementById("summaryList");

  list.innerHTML = "";
  summary.innerHTML = "";

  const today =
    new Date()
      .toISOString()
      .split("T")[0];

  let total = 0;

  let sum = {};

  studyData
    .filter(d => d.date === today)
    .forEach((d, i) => {

      total += d.time;

      const li =
        document.createElement("li");

      li.innerHTML = `

        <div class="study-item">

          <span>
            ${d.subject}
            :
            ${formatMinutes(d.time)}
          </span>

          <button
            onclick="deleteStudy(${i})"
            class="delete-btn"
          >
            삭제
          </button>

        </div>

      `;

      list.appendChild(li);

      sum[d.subject] =
        (sum[d.subject] || 0)
        + d.time;
    });

  for (let s in sum) {

    const li =
      document.createElement("li");

    li.innerText =
      `${s} :
      ${formatMinutes(sum[s])}`;

    summary.appendChild(li);
  }

  document.getElementById("totalTime").innerText =
    "총 공부 시간 : "
    + formatMinutes(total);

  localStorage.setItem(
    "studyData",
    JSON.stringify(studyData)
  );

  updateTodayStudy();

  updateStreak();
}


// =======================
// 공부 삭제
// =======================

function deleteStudy(i) {

  studyData.splice(i, 1);

  renderStudy();
}


// =======================
// 타이머
// =======================

let sec = 0;

let timer = null;

function formatTime(s) {

  const h =
    Math.floor(s / 3600);

  const m =
    Math.floor((s % 3600) / 60);

  const sec2 =
    s % 60;

  return `
    ${h}시간
    ${m}분
    ${sec2}초
  `;
}

function startTimer() {

  if (timer) return;

  timer =
    setInterval(() => {

      sec++;

      document.getElementById("timer").innerText =
        formatTime(sec);

    }, 1000);
}

function stopTimer() {

  clearInterval(timer);

  timer = null;
}


// =======================
// 캘린더
// =======================

function showTasksByDate() {

  const date =
    document.getElementById("calendarDate").value;

  const list =
    document.getElementById("calendarList");

  list.innerHTML = "";

  tasks
    .filter(t => t.deadline === date)
    .forEach(t => {

      const li =
        document.createElement("li");

      li.innerHTML =
        `📝 ${t.text}
        (${getDDay(t.deadline)})`;

      list.appendChild(li);
    });

  studyData
    .filter(s => s.date === date)
    .forEach(s => {

      const li =
        document.createElement("li");

      li.innerHTML =
        `⏱ ${s.subject}
        :
        ${formatMinutes(s.time)}`;

      list.appendChild(li);
    });
}


// =======================
// 연속 공부일
// =======================

function updateStreak() {

  const streakText =
    document.getElementById("streak");

  let dates =
    [...new Set(
      studyData.map(d => d.date)
    )];

  dates.sort().reverse();

  let streak = 0;

  let current =
    new Date();

  for (let d of dates) {

    const target =
      new Date(d);

    current.setHours(0,0,0,0);
    target.setHours(0,0,0,0);

    const diff =
      (current - target)
      / (1000 * 60 * 60 * 24);

    if (diff === streak) {

      streak++;

    } else {

      break;
    }
  }

  streakText.innerText =
    `🔥 ${streak}일 연속 공부 중`;
}


// =======================
// 오늘 공부 카드
// =======================

function updateTodayStudy() {

  const today =
    new Date()
      .toISOString()
      .split("T")[0];

  let total = 0;

  studyData
    .filter(item => item.date === today)
    .forEach(item => {

      total += item.time;
    });

  document.getElementById("todayStudy").innerText =
    formatMinutes(total);
}


// =======================
// 오늘 과제 카드
// =======================

function updateTodayTasks() {

  const list =
    document.getElementById("todayTasks");

  list.innerHTML = "";

  const today =
    new Date()
      .toISOString()
      .split("T")[0];

  const todayTaskList =
    tasks.filter(
      task =>
        task.deadline === today
    );

  if (todayTaskList.length === 0) {

    list.innerHTML =
      "<li>오늘 과제 없음 🎉</li>";

    return;
  }

  todayTaskList.forEach(task => {

    const li =
      document.createElement("li");

    li.innerHTML = `
      ${task.text}
      (${getDDay(task.deadline)})
    `;

    list.appendChild(li);
  });
}


// =======================
// 다크모드
// =======================

function toggleDarkMode() {

  document.body.classList.toggle("dark");
}


// =======================
// 시작
// =======================

renderTasks();

renderStudy();

updateTodayStudy();

updateTodayTasks();

updateStreak();