import "./CallsFilters.css";
import { useDispatch, useSelector } from "react-redux";
import { selectCallsFilters, setFilters, resetFilters } from "../../callsSlice";

import Card from "../../../../ui/Card/Card";
import Row from "../../../../ui/Row/Row";
import Button from "../../../../ui/Button/Button";

// ============================================
// ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ ДЛЯ РАБОТЫ С ДАТАМИ
// ============================================

/**
 * Преобразует объект Date в строку формата YYYY-MM-DD
 * Пример: new Date(2025, 11, 26) → "2025-12-26"
 */
function formatDateToISO(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0"); // +1 потому что месяцы с 0
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

/**
 * ИСПРАВЛЕНО: Возвращает сегодняшнюю дату (только from)
 * from = 00:00 текущего дня
 */
function getTodayDate() {
  return formatDateToISO(new Date());
}

/**
 * ИСПРАВЛЕНО: Возвращает дату понедельника текущей недели (только from)
 * from = 00:00 Monday текущей недели
 */
function getThisWeekStart() {
  const today = new Date();
  const dayOfWeek = today.getDay(); // 0=воскресенье, 1=понедельник, ..., 6=суббота
  
  // Высчитываем сколько дней прошло с понедельника
  const daysFromMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
  
  // Отнимаем эти дни от сегодняшней даты
  const monday = new Date(today);
  monday.setDate(today.getDate() - daysFromMonday);
  
  return formatDateToISO(monday);
}

/**
 * ИСПРАВЛЕНО: Возвращает первое число текущего месяца (только from)
 * from = 00:00 первого числа текущего месяца
 */
function getThisMonthStart() {
  const today = new Date();
  const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
  return formatDateToISO(firstDay);
}

// ============================================
// ОСНОВНОЙ КОМПОНЕНТ
// ============================================

export default function CallsFilters() {
  const dispatch = useDispatch(); //отправить запрос
  const filters = useSelector(selectCallsFilters); //чтение запроса

  // ИСПРАВЛЕНО: Обработчики теперь устанавливают ТОЛЬКО from
  const handleTodayClick = () => {
    dispatch(setFilters({ from: getTodayDate() }));
  };

  const handleThisWeekClick = () => {
    dispatch(setFilters({ from: getThisWeekStart() }));
  };

  const handleThisMonthClick = () => {
    dispatch(setFilters({ from: getThisMonthStart() }));
  };

  return (
    <Card>
      <div className="panel">
        <Row gap={10} wrap>
          {/* Выбор статуса звонка */}
          <select
            className="select"
            value={filters.status}
            onChange={(e) => dispatch(setFilters({ status: e.target.value }))}
            aria-label="Status"
          >
            <option value="all">All statuses</option>
            <option value="scheduled">Scheduled</option>
            <option value="in_progress">In progress</option>
            <option value="completed">Completed</option>
          </select>

          {/* Дата ОТ */}
          <Row gap={8}>
            <span className="label">From</span>
            <input
              className="input date"
              type="date"
              value={filters.from}
              onChange={(e) => dispatch(setFilters({ from: e.target.value }))}
              aria-label="From date"
            />
          </Row>

          {/* Дата ДО */}
          <Row gap={8}>
            <span className="label">To</span>
            <input
              className="input date"
              type="date"
              value={filters.to}
              onChange={(e) => dispatch(setFilters({ to: e.target.value }))}
              aria-label="To date"
            />
          </Row>

          {/* Кнопки-пресеты для быстрого выбора периода (устанавливают ТОЛЬКО from) */}
          <Row gap={8}>
            <Button onClick={handleTodayClick}>Today</Button>
            <Button onClick={handleThisWeekClick}>This week</Button>
            <Button onClick={handleThisMonthClick}>This month</Button>
          </Row>

          {/* Кнопка сброса */}
          <Button onClick={() => dispatch(resetFilters())}>Reset</Button>
        </Row>
      </div>
    </Card>
  );
}