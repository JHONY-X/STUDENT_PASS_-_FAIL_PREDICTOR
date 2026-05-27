import React, { useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import { Calendar as CalendarIcon, Plus } from 'lucide-react';
import './CalendarView.css';

function CalendarView() {
  const [events, setEvents] = useState([
    { id: '1', title: 'Exam revision', date: '2025-05-05', className: 'event-purple' },
    { id: '2', title: 'Math assignment due', date: '2025-05-12', className: 'event-blue' },
    { id: '3', title: 'Predictive Analytics', date: '2025-05-20', className: 'event-pink' },
    { id: '4', title: 'Final Exam', date: '2025-05-25', className: 'event-gold' }
  ]);
  const [newEventTitle, setNewEventTitle] = useState('');
  const [newEventDate, setNewEventDate] = useState('');

  const handleAddEvent = (e) => {
    e.preventDefault();
    if (newEventTitle && newEventDate) {
      setEvents([...events, { id: String(Date.now()), title: newEventTitle, date: newEventDate }]);
      setNewEventTitle('');
      setNewEventDate('');
    }
  };

  return (
    <div className="py-6 animate-in fade-in duration-500">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-white flex items-center gap-3">
            <CalendarIcon className="text-purple-400" />
            Academic Calendar
          </h2>
          <p className="text-gray-400 mt-2">Stay on top of your schedule and exams.</p>
        </div>
      </div>
      
      <div className="flex flex-col xl:flex-row gap-8">
        {/* FullCalendar Widget */}
        <div className="xl:w-2/3">
          <div className="glass-panel p-6 shadow-2xl calendar-container relative z-10 w-full overflow-x-auto">
            <div style={{ minWidth: '600px' }}>
              <FullCalendar 
                plugins={[ dayGridPlugin ]} 
                initialView="dayGridMonth" 
                initialDate="2025-05-15"
                events={events}
                headerToolbar={{
                  left: 'prev,next today',
                  center: 'title',
                  right: 'dayGridMonth'
                }}
                height="auto"
              />
            </div>
          </div>
        </div>

        {/* Right Column: Add Event & Upcoming */}
        <div className="xl:w-1/3 flex flex-col gap-6">
          <div className="glass-panel p-6">
            <h3 className="text-xl font-bold mb-4">Add Event</h3>
            <form onSubmit={handleAddEvent}>
              <div className="input-group">
                <label>Event Title</label>
                <input 
                  type="text" 
                  className="form-control" 
                  value={newEventTitle} 
                  onChange={(e) => setNewEventTitle(e.target.value)} 
                  required 
                  placeholder="e.g. Study Session"
                />
              </div>
              <div className="input-group">
                <label>Event Date</label>
                <input 
                  type="date" 
                  className="form-control" 
                  value={newEventDate} 
                  onChange={(e) => setNewEventDate(e.target.value)} 
                  required 
                />
              </div>
              <button type="submit" className="btn btn-primary w-full">
                <Plus size={18} /> Add Event
              </button>
            </form>
          </div>
          
          <div className="glass-panel p-6 flex-1">
            <h3 className="text-xl font-bold mb-4">Upcoming Events</h3>
            <div className="flex flex-col gap-3 max-h-[300px] overflow-y-auto pr-2">
              {events.length > 0 ? [...events].sort((a,b) => new Date(a.date) - new Date(b.date)).map(event => (
                <div key={event.id} className="glass-card p-4 flex justify-between items-center">
                  <span className="font-medium text-white">{event.title}</span>
                  <span className="text-sm text-purple-400">{new Date(event.date).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}</span>
                </div>
              )) : (
                <p className="text-gray-400">No upcoming events.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CalendarView;
