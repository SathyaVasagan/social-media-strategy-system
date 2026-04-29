import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import toast from "react-hot-toast";

import GlassCard from "../../components/ui/GlassCard";
import CalendarModal from "../../components/calendar/CalendarModal";

import {
  getCalendarEntries,
  createCalendarEntry,
  updateCalendarEntry,
  deleteCalendarEntry,
} from "../../services/calendarService";

const typeColors = {
  Reel: "bg-purple-500",
  Carousel: "bg-blue-500",
  Static: "bg-green-500",
  Video: "bg-red-500",
};

const CalendarPage = () => {
  const { brandId } = useParams();

  const [entries, setEntries] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState(null);

  const [dayEntries, setDayEntries] = useState([]);
  const [viewEntry, setViewEntry] = useState(null);

  const fetchEntries = async () => {
    try {
      const data = await getCalendarEntries(brandId);
      setEntries(data);
    } catch {
      toast.error("Failed to load calendar");
    }
  };

  useEffect(() => {
    fetchEntries();
  }, []);

  /* FILTER BY DATE */
  const getEntriesForDate = (date) => {
    return entries.filter((entry) => {
      const d = new Date(entry.date);
      return (
        d.getFullYear() === date.getFullYear() &&
        d.getMonth() === date.getMonth() &&
        d.getDate() === date.getDate()
      );
    });
  };

  /* DATE CLICK */
  const handleDateClick = (date) => {
    const items = getEntriesForDate(date);
    setSelectedDate(date);
    setDayEntries(items);
  };

  /* SAVE */
  const handleSave = async (form) => {
    try {
      if (editingEntry) {
        const updated = await updateCalendarEntry(editingEntry._id, form);
        setEntries(entries.map((e) => (e._id === updated._id ? updated : e)));
        toast.success("Entry updated");
      } else {
        const newEntry = await createCalendarEntry({
          ...form,
          brandId,
        });
        setEntries([newEntry, ...entries]);
        toast.success("Entry created");
      }

      setModalOpen(false);
      setEditingEntry(null);
      fetchEntries();
    } catch {
      toast.error("Action failed");
    }
  };

  /* DELETE */
  const handleDelete = async (id) => {
    try {
      await deleteCalendarEntry(id);

      setEntries(entries.filter((e) => e._id !== id));
      setDayEntries(dayEntries.filter((e) => e._id !== id));

      setViewEntry(null);

      toast.success("Entry deleted");
    } catch {
      toast.error("Delete failed");
    }
  };

  return (
    <>
      {/* HEADER */}

      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Content Calendar</h2>

        {/* 🚀 PREMIUM BUTTON */}
        <button
          onClick={() => {
            setEditingEntry(null);
            setSelectedDate(new Date());
            setModalOpen(true);
          }}
          className="
            bg-gradient-to-r from-blue-600 to-cyan-500
            text-white px-5 py-2.5 rounded-xl
            shadow-md hover:shadow-xl
            hover:scale-105 active:scale-95
            transition-all duration-200
          "
        >
          Schedule Content
        </button>
      </div>

      <div className="flex gap-6">
        {/* CALENDAR */}

        <GlassCard className="flex-1 p-6">
          <Calendar
            onClickDay={handleDateClick}
            className="w-full campaign-calendar"
            tileContent={({ date, view }) => {
              if (view !== "month") return null;

              const items = getEntriesForDate(date);

              if (items.length === 0) return null;

              return (
                <div className="absolute top-1 right-1 bg-blue-600 text-white text-xs rounded-full px-2">
                  {items.length}
                </div>
              );
            }}
          />
        </GlassCard>

        {/* RIGHT PANEL */}

        <div className="w-80 space-y-4">
          <GlassCard className="p-4">
            <h3 className="font-semibold mb-3">
              {selectedDate ? selectedDate.toDateString() : "Select a date"}
            </h3>

            {dayEntries.length === 0 && (
              <p className="text-sm text-gray-500">No content scheduled</p>
            )}

            {dayEntries.map((entry) => {
              const color = typeColors[entry.postType] || "bg-gray-400";

              return (
                <div
                  key={entry._id}
                  onClick={() => setViewEntry(entry)}
                  className="
                    border rounded-xl p-3 mb-3 cursor-pointer
                    hover:bg-white/60 hover:shadow-md
                    transition-all duration-200
                  "
                >
                  <div className="flex justify-between items-center">
                    <h4 className="font-medium">{entry.title}</h4>
                    <div className={`w-3 h-3 rounded-full ${color}`} />
                  </div>

                  <p className="text-sm text-gray-500">
                    {entry.platform} | {entry.postType}
                  </p>
                </div>
              );
            })}
          </GlassCard>
        </div>
      </div>

      {/* FLOATING DETAILS */}

      {viewEntry && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
          <GlassCard className="w-full max-w-md p-6">
            <h3 className="text-lg font-semibold mb-2">{viewEntry.title}</h3>

            <p className="text-sm text-gray-500 mb-3">
              {new Date(viewEntry.date).toDateString()}
            </p>

            <p className="text-sm mb-2">
              Platform: <strong>{viewEntry.platform}</strong>
            </p>

            <p className="text-sm mb-4">
              Type: <strong>{viewEntry.postType}</strong>
            </p>

            <p className="text-sm mb-4">{viewEntry.description}</p>

            {/* 🚀 FIXED BUTTON SECTION */}
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setViewEntry(null)}
                className="px-4 py-2 rounded border border-gray-300 hover:bg-gray-100 transition"
              >
                Close
              </button>

              <button
                onClick={() => {
                  setEditingEntry(viewEntry);
                  setSelectedDate(new Date(viewEntry.date));
                  setModalOpen(true);
                  setViewEntry(null);
                }}
                className="text-blue-600 font-medium"
              >
                Edit
              </button>

              <button
                onClick={() => handleDelete(viewEntry._id)}
                className="text-red-600 font-medium"
              >
                Delete
              </button>
            </div>
          </GlassCard>
        </div>
      )}

      {/* MODAL */}

      {modalOpen && (
        <CalendarModal
          selectedDate={selectedDate}
          onSave={handleSave}
          onClose={() => setModalOpen(false)}
          existing={editingEntry}
        />
      )}
    </>
  );
};

export default CalendarPage;
