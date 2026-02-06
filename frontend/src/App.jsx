import { useEffect, useMemo, useState } from "react";
import axios from "axios";

import Header from "./components/Header";
import Tabs from "./components/Tabs";
import StatCards from "./components/StatCards";
import MonthlyCalendar from "./components/MonthlyCalendar";
import WeeklyCalendar from "./components/WeeklyCalendar";
import DailyCalendar from "./components/DailyCalendar";
import TaskModal from "./components/TaskModal";
import Background from "./components/Background";
import TopNav from "./components/TopNav";

const API_URL = "/api/tasks";


function pad(n) {
  return String(n).padStart(2, "0");
}

function fmt(dateObj) {
  return `${dateObj.getFullYear()}-${pad(dateObj.getMonth() + 1)}-${pad(
    dateObj.getDate()
  )}`;
}

export default function App() {
  const [search, setSearch] = useState("");

  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().slice(0, 10)
  );

  const [activeMonth, setActiveMonth] = useState(() => {
    const d = new Date();
    return new Date(d.getFullYear(), d.getMonth(), 1);
  });

  const [activeTab, setActiveTab] = useState("monthly");

  const [monthTasks, setMonthTasks] = useState([]);
  const [weekTasks, setWeekTasks] = useState([]);
  const [dayTasks, setDayTasks] = useState([]);

  // filters
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");

  // modal
  const [openModal, setOpenModal] = useState(false);
  const [editTask, setEditTask] = useState(null);

  const matchesSearch = (t) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      (t.title || "").toLowerCase().includes(q) ||
      (t.description || "").toLowerCase().includes(q) ||
      (t.type || "").toLowerCase().includes(q) ||
      (t.status || "").toLowerCase().includes(q)
    );
  };

  // ✅ Fetch day
  const fetchDayTasks = async () => {
    const res = await axios.get(API_URL, { params: { date: selectedDate } });
    setDayTasks(res.data);
  };

  // ✅ Fetch month
  const fetchMonthTasks = async () => {
    const y = activeMonth.getFullYear();
    const m = activeMonth.getMonth() + 1;

    const res = await axios.get(`${API_URL}/month`, {
      params: { year: y, month: m },
    });

    setMonthTasks(res.data);
  };

  // ✅ Fetch week range
  const fetchWeekTasks = async () => {
    const selected = new Date(selectedDate);

    const start = new Date(selected);
    start.setDate(selected.getDate() - selected.getDay()); // sunday

    const end = new Date(start);
    end.setDate(start.getDate() + 6);

    const res = await axios.get(`${API_URL}/range`, {
      params: { start: fmt(start), end: fmt(end) },
    });

    setWeekTasks(res.data);
  };

  useEffect(() => {
    fetchDayTasks();
    fetchWeekTasks();
  }, [selectedDate]);

  useEffect(() => {
    fetchMonthTasks();
  }, [activeMonth]);

  // ✅ Filtered month tasks
  const filteredMonthTasks = useMemo(() => {
    return monthTasks.filter((t) => {
      const statusOk = statusFilter === "all" ? true : t.status === statusFilter;
      const typeOk = typeFilter === "all" ? true : t.type === typeFilter;
      return statusOk && typeOk && matchesSearch(t);
    });
  }, [monthTasks, statusFilter, typeFilter, search]);

  const filteredWeekTasks = useMemo(
    () => weekTasks.filter(matchesSearch),
    [weekTasks, search]
  );

  const filteredDayTasks = useMemo(
    () => dayTasks.filter(matchesSearch),
    [dayTasks, search]
  );

  // Stats based on month
  const stats = useMemo(() => {
    const total = monthTasks.length;
    const pending = monthTasks.filter((t) => t.status === "pending").length;
    const inprogress = monthTasks.filter((t) => t.status === "inprogress").length;
    const completed = monthTasks.filter((t) => t.status === "completed").length;
    const overdue = monthTasks.filter((t) => t.status === "overdue").length;

    return { total, pending, inprogress, completed, overdue };
  }, [monthTasks]);

  return (
    <div className="min-h-screen">
      <Background />

      <TopNav search={search} setSearch={setSearch} />

      <div className="max-w-6xl mx-auto p-6 space-y-6">
        <Header
          selectedDate={selectedDate}
          setSelectedDate={(val) => {
            setSelectedDate(val);
            const d = new Date(val);
            setActiveMonth(new Date(d.getFullYear(), d.getMonth(), 1));
          }}
          onAddTask={() => {
            setEditTask(null);
            setOpenModal(true);
          }}
        />

        <div className="flex items-center justify-between flex-wrap gap-3">
          <Tabs active={activeTab} setActive={setActiveTab} />

          {activeTab === "monthly" && (
            <div className="flex gap-2 flex-wrap">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 rounded-2xl border bg-white/70 backdrop-blur font-semibold"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="inprogress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="overdue">Overdue</option>
              </select>

              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="px-4 py-2 rounded-2xl border bg-white/70 backdrop-blur font-semibold"
              >
                <option value="all">All Types</option>
                <option value="work">Work</option>
                <option value="study">Study</option>
                <option value="health">Health</option>
                <option value="personal">Personal</option>
                <option value="other">Other</option>
              </select>
            </div>
          )}
        </div>

        <StatCards stats={stats} />

        {activeTab === "monthly" && (
          <MonthlyCalendar
            activeMonth={activeMonth}
            setActiveMonth={setActiveMonth}
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
            monthTasks={filteredMonthTasks}
            search={search}
            onClearSearch={() => setSearch("")}
            onAddTask={(dateStr) => {
              if (dateStr) setSelectedDate(dateStr);
              setEditTask(null);
              setOpenModal(true);
            }}
            onEditTask={(task) => {
              setEditTask(task);
              setOpenModal(true);
            }}
          />
        )}

        {activeTab === "weekly" && (
          <WeeklyCalendar
            selectedDate={selectedDate}
            weekTasks={filteredWeekTasks}
            search={search}
            onClearSearch={() => setSearch("")}
            setSelectedDate={setSelectedDate}
            onAddTask={() => {
              setEditTask(null);
              setOpenModal(true);
            }}
            onEditTask={(task) => {
              setEditTask(task);
              setOpenModal(true);
            }}
          />
        )}

        {activeTab === "daily" && (
          <DailyCalendar
            selectedDate={selectedDate}
            dayTasks={filteredDayTasks}
            search={search}
            onClearSearch={() => setSearch("")}
            onAddTask={() => {
              setEditTask(null);
              setOpenModal(true);
            }}
            onEditTask={(task) => {
              setEditTask(task);
              setOpenModal(true);
            }}
          />
        )}
      </div>

      {openModal && (
        <TaskModal
          close={() => setOpenModal(false)}
          date={selectedDate}
          editTask={editTask}
          refresh={async () => {
            await fetchDayTasks();
            await fetchWeekTasks();
            await fetchMonthTasks();
          }}
        />
      )}
    </div>
  );
}
