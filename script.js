// ======================
// 데이터 불러오기
// ======================

let tasks =
JSON.parse(localStorage.getItem("tasks")) || [];

let studyData =
JSON.parse(localStorage.getItem("studyData")) || [];


// ======================
// 페이지 이동
// ======================

function showPage(pageId){

document
.querySelectorAll("section")
.forEach(section=>{

section.classList.add("hidden");

});

document
.getElementById(pageId)
.classList.remove("hidden");

}


// ======================
// 과제 추가
// ======================

function addTask(){

const text =
document.getElementById("task").value;

const deadline =
document.getElementById("deadline").value;

const importance =
document.getElementById("importance").value;

if(!text || !deadline){

alert("과제와 날짜를 입력하세요!");
return;

}

tasks.push({

text,
deadline,
importance,
done:false

});

document.getElementById("task").value="";

renderTasks();

}


// ======================
// D-Day
// ======================

function getDDay(deadline){

const today =
new Date();

const target =
new Date(deadline);

today.setHours(0,0,0,0);
target.setHours(0,0,0,0);

const diff =
Math.ceil(
(target-today)
/(1000*60*60*24)
);

if(diff > 0){

return `D-${diff}`;

}

if(diff === 0){

return "D-Day";

}

return `D+${Math.abs(diff)}`;

}


// ======================
// 과제 출력
// ======================

function renderTasks(){

const list =
document.getElementById("taskList");

list.innerHTML="";

tasks.forEach((task,index)=>{

let color="#22c55e";

if(task.importance==2)
color="#facc15";

if(task.importance==3)
color="#ef4444";

const li =
document.createElement("li");

li.innerHTML=`

<div class="task-card">

<div>

<input
type="checkbox"
onclick="toggleDone(${index})"
${task.done ? "checked" : ""}
>

<span class="
${task.done ? "done" : ""}
">

${task.text}

</span>

<br>

<small>
📅 ${task.deadline}
</small>

<br>

<small style="
color:${color};
font-weight:bold;
">

${getDDay(task.deadline)}

</small>

</div>

<button
class="delete-btn"
onclick="deleteTask(${index})"
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
updateTaskCount();

}


// ======================
// 과제 완료
// ======================

function toggleDone(index){

tasks[index].done =
!tasks[index].done;

renderTasks();

}


// ======================
// 과제 삭제
// ======================

function deleteTask(index){

tasks.splice(index,1);

renderTasks();

}


// ======================
// 오늘 과제 카드
// ======================

function updateTodayTasks(){

const list =
document.getElementById("todayTasks");

if(!list) return;

list.innerHTML="";

const today =
new Date()
.toISOString()
.split("T")[0];

const todayTasks =
tasks.filter(
t => t.deadline===today
);

if(todayTasks.length===0){

list.innerHTML=
"<li>오늘 과제 없음 🎉</li>";

return;

}

todayTasks.forEach(task=>{

const li =
document.createElement("li");

li.innerHTML=`
${task.text}
(${getDDay(task.deadline)})
`;

list.appendChild(li);

});

}


// ======================
// 완료 과제 수
// ======================

function updateTaskCount(){

const count =
tasks.filter(
task => task.done
).length;

const element =
document.getElementById("taskCount");

if(element){

element.innerText =
`완료한 과제 : ${count}개`;

}

}


// ======================
// 분 → 시간 변환
// ======================

function formatMinutes(min){

const h =
Math.floor(min/60);

const m =
min%60;

return `${h}시간 ${m}분`;

}


// ======================
// 공부 기록 추가
// ======================

function addStudy(){

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

const date =
document.getElementById("studyDate").value;

const total =
(hour*60)+minute;

if(
!subject ||
!date ||
total<=0
){

alert("입력하세요!");
return;

}

const exist =
studyData.find(item=>

item.subject===subject
&&
item.date===date

);

if(exist){

exist.time += total;

}else{

studyData.push({

subject,
time:total,
date

});

}

renderStudy();

}

// ======================
// 공부 기록 출력
// ======================

function renderStudy(){

const list =
document.getElementById("studyList");

const summary =
document.getElementById("summaryList");

list.innerHTML="";
summary.innerHTML="";

const today =
new Date()
.toISOString()
.split("T")[0];

let total = 0;

let subjectSum = {};

studyData
.filter(item=>item.date===today)
.forEach((item,index)=>{

total += item.time;

subjectSum[item.subject] =
(subjectSum[item.subject] || 0)
+ item.time;

const li =
document.createElement("li");

li.innerHTML=`

<div class="study-item">

<span>

${item.subject}
:
${formatMinutes(item.time)}

</span>

<button
class="delete-btn"
onclick="deleteStudy(${index})"
>

삭제

</button>

</div>

`;

list.appendChild(li);

});

for(let subject in subjectSum){

const li =
document.createElement("li");

li.innerText =
`${subject} : ${formatMinutes(subjectSum[subject])}`;

summary.appendChild(li);

}

document.getElementById("totalTime").innerText =
`총 공부 시간 : ${formatMinutes(total)}`;

localStorage.setItem(
"studyData",
JSON.stringify(studyData)
);

updateTodayStudy();
updateBestSubject();
updateRank();
updateStreak();

}


// ======================
// 공부 삭제
// ======================

function deleteStudy(index){

studyData.splice(index,1);

renderStudy();

}


// ======================
// 오늘 공부 카드
// ======================

function updateTodayStudy(){

const today =
new Date()
.toISOString()
.split("T")[0];

let total = 0;

studyData
.filter(item=>item.date===today)
.forEach(item=>{

total += item.time;

});

const el =
document.getElementById("todayStudy");

if(el){

el.innerText =
formatMinutes(total);

}

}


// ======================
// 가장 많이 공부한 과목
// ======================

function updateBestSubject(){

const subjectTotal = {};

studyData.forEach(item=>{

subjectTotal[item.subject] =
(subjectTotal[item.subject] || 0)
+ item.time;

});

let best = "없음";
let max = 0;

for(let subject in subjectTotal){

if(subjectTotal[subject] > max){

max = subjectTotal[subject];
best = subject;

}

}

const el =
document.getElementById("bestSubject");

if(el){

el.innerText =
`가장 많이 공부한 과목 : ${best}`;

}

}


// ======================
// 과목 순위
// ======================

function updateRank(){

const rankList =
document.getElementById("rankList");

if(!rankList) return;

rankList.innerHTML="";

const subjectTotal = {};

studyData.forEach(item=>{

subjectTotal[item.subject] =
(subjectTotal[item.subject] || 0)
+ item.time;

});

const sorted =
Object.entries(subjectTotal)
.sort((a,b)=>b[1]-a[1]);

sorted.forEach((item,index)=>{

const li =
document.createElement("li");

let medal = "";

if(index===0) medal="🥇";
if(index===1) medal="🥈";
if(index===2) medal="🥉";

li.innerText =
`${medal} ${item[0]} - ${formatMinutes(item[1])}`;

rankList.appendChild(li);

});

}


// ======================
// 연속 공부일
// ======================

function updateStreak(){

const streakText =
document.getElementById("streak");

if(!streakText) return;

let dates =
[...new Set(studyData.map(d=>d.date))];

dates.sort().reverse();

let streak = 0;

let current =
new Date();

for(let d of dates){

const target =
new Date(d);

current.setHours(0,0,0,0);
target.setHours(0,0,0,0);

const diff =
(current-target)
/(1000*60*60*24);

if(diff===streak){

streak++;

}else{

break;

}

}

streakText.innerText =
`🔥 ${streak}일 연속 공부 중`;

}


// ======================
// 목표 공부시간
// ======================

function calculateGoal(){

const goalHour =
Number(
document.getElementById("goalHour").value
) || 0;

const goalMinute =
Number(
document.getElementById("goalMinute").value
) || 0;

const goal =
(goalHour*60)+goalMinute;

const today =
new Date()
.toISOString()
.split("T")[0];

let total = 0;

studyData
.filter(item=>item.date===today)
.forEach(item=>{

total += item.time;

});

const percent =
goal > 0
? Math.min(
100,
Math.round(total/goal*100)
)
: 0;

document.getElementById("goalResult").innerText =
`달성률 : ${percent}%`;

document.getElementById("progressBar").style.width =
percent + "%";

const badge =
document.getElementById("badge");

if(badge){

badge.innerText =
percent >= 100
? "🏆 목표 달성!"
: "🎯 목표 진행 중";

}

}


// ======================
// 주간 분석
// ======================

function analyzeWeek(){

const list =
document.getElementById("weekAnalysis");

list.innerHTML="";

const today =
new Date();

let total = 0;

studyData.forEach(item=>{

const diff =
(today-new Date(item.date))
/
(1000*60*60*24);

if(diff <= 7){

total += item.time;

}

});

const li =
document.createElement("li");

li.innerText =
`이번 주 총 공부시간 : ${formatMinutes(total)}`;

list.appendChild(li);

}


// ======================
// 날짜 조회
// ======================

function searchStudy(){

const date =
document.getElementById("searchDate").value;

const list =
document.getElementById("searchResult");

list.innerHTML="";

studyData
.filter(item=>item.date===date)
.forEach(item=>{

const li =
document.createElement("li");

li.innerText =
`${item.subject} : ${formatMinutes(item.time)}`;

list.appendChild(li);

});

}


// ======================
// 캘린더
// ======================

function showTasksByDate(){

const date =
document.getElementById("calendarDate").value;

const list =
document.getElementById("calendarList");

list.innerHTML="";

tasks
.filter(task=>task.deadline===date)
.forEach(task=>{

const li =
document.createElement("li");

li.innerText =
`📝 ${task.text} (${getDDay(task.deadline)})`;

list.appendChild(li);

});

studyData
.filter(item=>item.date===date)
.forEach(item=>{

const li =
document.createElement("li");

li.innerText =
`⏱ ${item.subject} : ${formatMinutes(item.time)}`;

list.appendChild(li);

});

}


// ======================
// 타이머
// ======================

let seconds = 0;
let timer = null;

function formatTime(sec){

const h =
Math.floor(sec/3600);

const m =
Math.floor((sec%3600)/60);

const s =
sec%60;

return `${h}시간 ${m}분 ${s}초`;

}

function startTimer(){

if(timer) return;

timer =
setInterval(()=>{

seconds++;

document.getElementById("timer").innerText =
formatTime(seconds);

},1000);

}

function stopTimer(){

clearInterval(timer);

timer = null;

}


// ======================
// 다크모드
// ======================

function toggleDarkMode(){

document.body.classList.toggle("dark");

}


// ======================
// 시작
// ======================

renderTasks();
renderStudy();
updateTodayStudy();
updateTodayTasks();
updateTaskCount();
updateBestSubject();
updateRank();
updateStreak();

showPage("homePage");