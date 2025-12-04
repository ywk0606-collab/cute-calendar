let currentDate = new Date();
const calendar = document.getElementById("calendar");
const currentMonth = document.getElementById("current-month");
const modal = document.getElementById("modal");
const eventInput = document.getElementById("event-input");
const saveEventBtn = document.getElementById("save-event");
const deleteEventBtn = document.getElementById("delete-event");
let selectedDate = null;

// 한국 공휴일(간단 버전: 양력 공휴일만 포함)
const holidays = [
  "01-01", // 신정
  "03-01", // 삼일절
  "05-05", // 어린이날
  "06-06", // 현충일
  "08-15", // 광복절
  "10-03", // 개천절
  "10-09", // 한글날
  "12-25"  // 크리스마스
];

// LocalStorage에서 기념일 불러오기
function loadEvents() {
  return JSON.parse(localStorage.getItem("events") || "{}");
}

function saveEvents(events) {
  localStorage.setItem("events", JSON.stringify(events));
}

// 달력 렌더링
function renderCalendar() {
  calendar.innerHTML = "";
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  currentMonth.innerText = `${year}년 ${month + 1}월`;

  const firstDay = new Date(year, month, 1).getDay();
  const lastDate = new Date(year, month + 1, 0).getDate();

  const events = loadEvents();

  // 빈칸
  for (let i = 0; i < firstDay; i++) {
    const cell = document.createElement("div");
    cell.className = "calendar-cell";
    calendar.appendChild(cell);
  }

  // 날짜 렌더링
  for (let date = 1; date <= lastDate; date++) {
    const cell = document.createElement("div");
    cell.className = "calendar-cell";
    cell.innerText = date;

    const formatted = `${month + 1}`.padStart(2, "0") + "-" + `${date}`.padStart(2, "0");

    // 오늘 강조
    const today = new Date();
    if (
      date === today.getDate() &&
      month === today.getMonth() &&
      year === today.getFullYear()
    ) {
      cell.classList.add("today");
    }

    // 공휴일 색상
    if (holidays.includes(formatted)) {
      cell.classList.add("holiday");
    }

    // 기념일 색상
    if (events[`${year}-${formatted}`]) {
      cell.classList.add("event-day");
    }

    // 날짜 클릭 시 modal 오픈
    cell.addEventListener("click", () => {
      selectedDate = `${year}-${formatted}`;
      eventInput.value = events[selectedDate] || "";
      document.getElementById("modal-title").innerText = `${selectedDate} 기념일`;
      modal.classList.remove("hidden");
    });

    calendar.appendChild(cell);
  }
}

// 기념일 저장
saveEventBtn.onclick = () => {
  const events = loadEvents();
  events[selectedDate] = eventInput.value;
  saveEvents(events);
  modal.classList.add("hidden");
  renderCalendar();
};

// 기념일 삭제
deleteEventBtn.onclick = () => {
  const events = loadEvents();
  delete events[selectedDate];
  saveEvents(events);
  modal.classList.add("hidden");
  renderCalendar();
};

// modal 닫기
document.getElementById("close-modal").onclick = () => modal.classList.add("hidden");

// 월 이동
document.getElementById("prev-month").onclick = () => {
  currentDate.setMonth(currentDate.getMonth() - 1);
  renderCalendar();
};
document.getElementById("next-month").onclick = () => {
  currentDate.setMonth(currentDate.getMonth() + 1);
  renderCalendar();
};

// 초기 렌더링
renderCalendar();
