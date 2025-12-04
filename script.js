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
  "12-25"  // 크리스마스
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

  // 월요일을 주의 시작(0)으로 맞추기 위한 로직
  let firstDay = new Date(year, month, 1).getDay(); // 0=일요일, 1=월요일...
  firstDay = (firstDay === 0) ? 6 : firstDay - 1; // 0=월요일, 6=일요일

  const lastDate = new Date(year, month + 1, 0).getDate();

  const events = loadEvents();

  // 1. 빈칸 (이전 달 날짜)
  for (let i = 0; i < firstDay; i++) {
    const cell = document.createElement("div");
    cell.className = "calendar-cell empty"; // 빈 셀 클래스 추가
    calendar.appendChild(cell);
  }

  // 2. 날짜 렌더링
  for (let date = 1; date <= lastDate; date++) {
    const cell = document.createElement("div");
    cell.className = "calendar-cell day"; // day 클래스 추가 (스타일링 용이)
    cell.innerText = date;

    const dayOfWeek = new Date(year, month, date).getDay(); // 0=일요일, 6=토요일
    const formattedMonthDay = `${month + 1}`.padStart(2, "0") + "-" + `${date}`.padStart(2, "0");
    const formattedFullDate = `${year}-${formattedMonthDay}`;

    // 요일 클래스 추가 (일요일은 붉은색 폰트)
    if (dayOfWeek === 0) {
      cell.classList.add("sun");
    } else if (dayOfWeek === 6) {
        cell.classList.add("sat");
    }


    // 오늘 강조
    const today = new Date();
    if (
      date === today.getDate() &&
      month === today.getMonth() &&
      year === today.getFullYear()
    ) {
      cell.classList.add("today");
    }

    // 공휴일 색상 (일요일과 마찬가지로 붉은 폰트)
    if (holidays.includes(formattedMonthDay)) {
      cell.classList.add("holiday");
    }

    // 기념일 색상 (핑크 배경)
    if (events[formattedFullDate]) {
      cell.classList.add("event-day");
      // 이벤트 내용 표시 (선택 사항)
      // const eventDetail = document.createElement("div");
      // eventDetail.className = "event-detail";
      // eventDetail.innerText = events[formattedFullDate].substring(0, 5) + '...';
      // cell.appendChild(eventDetail);
    }

    // 날짜 클릭 시 modal 오픈
    cell.addEventListener("click", () => {
      selectedDate = formattedFullDate;
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
  if (eventInput.value.trim() === "") {
        delete events[selectedDate]; // 내용이 없으면 삭제 처리
    } else {
        events[selectedDate] = eventInput.value.trim();
    }
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
