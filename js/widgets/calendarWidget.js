// js/widgets/calendarWidget.js

export function setupCalendarWidget(widgetEl, conf) {
    const body = widgetEl.querySelector('.widget-body'); if (!body) return;
    let currentDate = new Date();

    function renderCal() {
        body.innerHTML = '';
        const header = document.createElement('div'); header.className = 'calendar-header';
        const prevBtn = document.createElement('button'); prevBtn.className = 'calendar-nav-btn'; prevBtn.innerHTML = '<i class="fas fa-chevron-left"></i>'; prevBtn.title = 'Prev Month';
        prevBtn.onclick = () => { currentDate.setMonth(currentDate.getMonth() - 1); renderCal(); };
        const monthYear = document.createElement('span'); monthYear.textContent = currentDate.toLocaleDateString([], { month: 'long', year: 'numeric' });
        const nextBtn = document.createElement('button'); nextBtn.className = 'calendar-nav-btn'; nextBtn.innerHTML = '<i class="fas fa-chevron-right"></i>'; nextBtn.title = 'Next Month';
        nextBtn.onclick = () => { currentDate.setMonth(currentDate.getMonth() + 1); renderCal(); };
        header.append(prevBtn, monthYear, nextBtn);
        body.appendChild(header);

        const grid = document.createElement('div'); grid.className = 'calendar-grid';
        ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].forEach(n => {
            const dayCellName = document.createElement('div');
            dayCellName.className = 'calendar-day-name';
            dayCellName.textContent = n;
            grid.appendChild(dayCellName);
        });

        const y = currentDate.getFullYear(), m = currentDate.getMonth();
        const firstDayOfMonth = new Date(y, m, 1).getDay();
        const daysInMonth = new Date(y, m + 1, 0).getDate();
        const today = new Date();

        for (let i = 0; i < firstDayOfMonth; i++) {
            const emptyCell = document.createElement('div');
            emptyCell.className = 'calendar-day-cell empty';
            grid.appendChild(emptyCell);
        }

        for (let d = 1; d <= daysInMonth; d++) {
            const dayCell = document.createElement('div');
            dayCell.className = 'calendar-day-cell';
            dayCell.textContent = d;
            if (y === today.getFullYear() && m === today.getMonth() && d === today.getDate()) {
                dayCell.classList.add('today');
            }
            grid.appendChild(dayCell);
        }
        body.appendChild(grid);
    }
    renderCal();
}