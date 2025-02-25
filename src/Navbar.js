import React from 'react';
import { SlEnvolope } from "react-icons/sl";
import { IoNotifications } from "react-icons/io5";
import { FaCalendar } from "react-icons/fa";
import { useLocation } from 'react-router-dom'; // Import useLocation
import logo from './images/ima.jpg';

function Navbar() {
  const location = useLocation();
  let title;

  switch (location.pathname) {
    case '/':
      title = 'Approval Master';
      break;
    case '/leaveapproval':
      title = 'Leave Approval';
      break;
    case '/AttendanceApproval':
      title = 'Attendance Approval';
      break;
    case '/ProfileDetailsApproval':
      title = 'Profile Details Approval';
      break;
      case '/ResignationApproval':
        title = 'Resignation Approval';
        break;
        default:
      title = 'Approval Master';
  }

  return (
    <div>
      <nav className="flex items-center justify-between border-black px-4 h-16 border-b">
        <div className="h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12 border border-black">
          <img src={logo} alt="Logo" className="h-full w-full object-contain" />
        </div>

        <div className="flex items-center text-black ml-10 sm:ml-20 md:ml-44">
          <FaCalendar className="text-lg md:text-2xl mr-2 text-blue-800" />
          <h1 className="text-sm md:text-xl font-bold text-blue-800">{title}</h1>
        </div>

        <div className="flex items-center space-x-3">
          <SlEnvolope className="text-black text-lg md:text-xl" />
          <IoNotifications className="text-black text-lg md:text-xl" />
          <div className="flex items-center space-x-2 p-2 rounded">
            <div className="h-6 w-6 sm:h-8 sm:w-8 bg-gray-300 rounded-full" />
            <div className="hidden md:flex flex-col">
              <span className="text-black font-semibold">Vikram</span>
              <span className="text-sm text-gray-600">Front-end Developer</span>
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
}

export default Navbar;
