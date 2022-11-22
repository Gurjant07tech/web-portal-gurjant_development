import React from "react";
import WeekCalendar from "react-week-calendar";
import "react-week-calendar/dist/style.css";

const ManageSchedule = () => {
  return (
    <WeekCalendar
      style={{ marginTop: 50 }}
      scaleUnit="60"
      dayFormat={"ddd M/DD"}
    />
  );
};

export default ManageSchedule;
