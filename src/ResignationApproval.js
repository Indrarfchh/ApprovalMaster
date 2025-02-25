import React, { useState } from 'react';
import { FaLessThan, FaSearch, FaCheckSquare, FaWindowClose } from 'react-icons/fa';
import { NavLink } from 'react-router-dom';


function ResignationApproval() {
  const [pendingRequests, setPendingRequests] = useState([
    { id: 1, name: 'John Doe', role: 'Developer', noticePeriodDays: 30, duration: 'Full-Time', comments:'Looking forward to new opportunities.' },
    { id: 2, name: 'Jane Smith', role: 'Designer', noticePeriodDays: 15, duration: 'Part-Time', comments: 'Got a new Oppurtunity' },
    { id: 3, name: 'Alice Johnson', role: 'Manager', noticePeriodDays: 45, duration: 'Full-Time', comments: 'Got Frustated with he job' },
    { id: 4, name: 'John Doe', role: 'Developer', noticePeriodDays: 30, duration: 'Full-Time', comments:'Looking forward to new opportunities.' },
    { id: 5, name: 'Jane Smith', role: 'Designer', noticePeriodDays: 15, duration: 'Part-Time', comments: 'Got a new Oppurtunity' },
    { id: 6, name: 'Alice Johnson', role: 'Manager', noticePeriodDays: 45, duration: 'Full-Time', comments: 'Got Frustated with he job' },
  ]);

  const [allRequests, setAllRequests] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [currentRequest, setCurrentRequest] = useState(null);
  const [comment, setComment] = useState('');
  const [isApproved, setIsApproved] = useState(false);
  const [pendingPage, setPendingPage] = useState(0);
  const [allPage, setAllPage] = useState(0);
  const rowsPerPage = 3;
  const [showValidationError, setShowValidationError] = useState(false);

  const [pendingFilters, setPendingFilters] = useState({ id: '', name: '', role: '' });
  const [allFilters, setAllFilters] = useState({ id: '', name: '', role: '' });

  const [pendingSearch, setPendingSearch] = useState('');
  const [allSearch, setAllSearch] = useState('');

  const uniqueRoles = [...new Set(pendingRequests.map(req => req.role))];
  const uniqueNames = [...new Set(pendingRequests.map(req => req.name))];

  const handleAction = (request, isApprove) => {
    setCurrentRequest(request);
    setShowPopup(true);
    setComment('');
    setIsApproved(isApprove);
    setShowValidationError(false); 
  };

  const handleSubmit = () => {
    if (!comment.trim()) {
      setShowValidationError(true);
      return; 
    }

    const updatedRequest = { ...currentRequest, comments: comment };

    if (isApproved) {
      setAllRequests((prev) => [...prev, { ...updatedRequest, status: 'Approved' }]);
    } else {
      setAllRequests((prev) => [...prev, { ...updatedRequest, status: 'Rejected' }]);
    }

    setPendingRequests((prev) => prev.filter((req) => req.id !== currentRequest.id));
    setShowPopup(false);
    setComment(''); 
  };

  const pendingRequestsToShow = pendingRequests.filter(req => {
    const searchText = pendingSearch.toLowerCase();
    return (
      (pendingFilters.id ? req.id.toString() === pendingFilters.id : true) &&
      (pendingFilters.name ? req.name.includes(pendingFilters.name) : true) &&
      (pendingFilters.role ? req.role === pendingFilters.role : true) &&
      (pendingFilters.noticePeriodDays ? req.noticePeriodDays.toString() === pendingFilters.noticePeriodDays : true) &&
      (pendingFilters.duration ? req.duration === pendingFilters.duration : true) &&
      (pendingSearch ? 
        req.id.toString().includes(searchText) ||
        req.name.toLowerCase().includes(searchText) ||
        req.role.toLowerCase().includes(searchText) ||
        req.noticePeriodDays.toString().includes(searchText) ||
        req.duration.toLowerCase().includes(searchText) : true)
    );
  }).slice(pendingPage * rowsPerPage, (pendingPage + 1) * rowsPerPage);
  
  const allRequestsToShow = allRequests.filter(req => {
    const searchText = allSearch.toLowerCase();
    return (
      (allFilters.id ? req.id.toString() === allFilters.id : true) &&
      (allFilters.name ? req.name.includes(allFilters.name) : true) &&
      (allFilters.role ? req.role === allFilters.role : true) &&
      (allFilters.noticePeriodDays ? req.noticePeriodDays.toString() === allFilters.noticePeriodDays : true) &&
      (allFilters.duration ? req.duration === allFilters.duration : true) &&
      (allSearch ? 
        req.id.toString().includes(searchText) ||
        req.name.toLowerCase().includes(searchText) ||
        req.role.toLowerCase().includes(searchText) ||
        req.noticePeriodDays.toString().includes(searchText) ||
        req.duration.toLowerCase().includes(searchText) ||
        req.status.toLowerCase().includes(searchText) : true)
    );
  }).slice(allPage * rowsPerPage, (allPage + 1) * rowsPerPage);
  

  const totalPendingPages = Math.ceil(pendingRequests.length / rowsPerPage);
  const totalAllPages = Math.ceil(allRequests.length / rowsPerPage);

  return (
    <div>
      <NavLink className="flex items-center justify-start px-1 py-1 border border-gray-800 rounded-md w-32 ml-5 mb-5 mt-5" to='/App'>
        <FaLessThan className="text-orange-500 " />
        <button><span className="text font-semibold text-orange-500">Previous Page</span></button>
      </NavLink>

      <div className='flex flex-col items-center'>
        <div className='border border-gray-400 p-4 rounded-md'>
          <div className='flex flex-row justify-between items-center'>
            <h1 className="font-bold pb-3">Resignation Approvals/Pending</h1>
            <div className="relative">
              <FaSearch className="absolute left-40 top-1 text-gray-400" />
              <input
                type="text"
                placeholder="Search all fields..."
                value={pendingSearch}
                onChange={(e) => setPendingSearch(e.target.value)}
                className="border border-gray-400 pl-8 mb-4 rounded-full"
              />
            </div>
          </div>
          <table className="w-full">
            <thead>
              <tr>
                <th className="border border-solid border-gray-400 p-2 bg-gray-200">
                  <select onChange={(e) => setPendingFilters({ ...pendingFilters, id: e.target.value })} className="bg-gray-200">
                    <option value="">Employee Id</option>
                    {pendingRequests.map(req => (
                      <option key={req.id} value={req.id}>{req.id}</option>
                    ))}
                  </select>
                </th>
                <th className="border border-solid border-gray-400 p-2 bg-gray-200">
                  <select onChange={(e) => setPendingFilters({ ...pendingFilters, name: e.target.value })} className="bg-gray-200">
                    <option value="">Employee Name</option>
                    {uniqueNames.map(name => (
                      <option key={name} value={name}>{name}</option>
                    ))}
                  </select>
                </th>
                <th className="border border-solid border-gray-400 p-2 bg-gray-200">
                  <select onChange={(e) => setPendingFilters({ ...pendingFilters, role: e.target.value })} className="bg-gray-200">
                    <option value="">Role</option>
                    {uniqueRoles.map(role => (
                      <option key={role} value={role}>{role}</option>
                    ))}
                  </select>
                </th>
                <th className="border border-solid border-gray-400 p-2 bg-gray-200">Notice Period Days</th>
                <th className="border border-solid border-gray-400 p-2 bg-gray-200">Duration</th>
                <th className="border border-solid border-gray-400 p-2 bg-gray-200">Actions</th>
                <th className="border border-solid border-gray-400 p-2 bg-gray-200">Comments</th>
              </tr>
            </thead>
            <tbody>
              {pendingRequestsToShow.map(req => (
                <tr key={req.id}>
                  <td className="border border-solid border-gray-400 p-2 text-center">{req.id}</td>
                  <td className="border border-solid border-gray-400 p-2 text-center">{req.name}</td>
                  <td className="border border-solid border-gray-400 p-2 text-center">{req.role}</td>
                  <td className="border border-solid border-gray-400 p-2 text-center">{req.noticePeriodDays}</td>
                  <td className="border border-solid border-gray-400 p-2 text-center">{req.duration}</td>
                  <td className="border border-solid border-gray-400 p-2 text-center">
                    <button onClick={() => handleAction(req, true)} className="  rounded-full text-green-600 font-bold">
                      <FaCheckSquare  className="inline-block text-2xl" />
                    </button>
                    <button onClick={() => handleAction(req, false)} className=" rounded-full text-red-600 ml-2 font-bold">
                      <FaWindowClose className="inline-block text-2xl" />
                    </button>
                  </td>
                  <td className="border border-solid border-gray-400 p-2">{req.comments}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="flex justify-center items-center mt-4">
            <button onClick={() => setPendingPage(pendingPage - 1)} disabled={pendingPage === 0}>
              &lt; 
            </button>
            <span className="mx-4">
              Page {pendingPage + 1} of {totalPendingPages}
            </span>
            <button onClick={() => setPendingPage(pendingPage + 1)} disabled={pendingPage === totalPendingPages - 1}>
              &gt;
            </button>
          </div>
        </div>

        <hr className='p-2'></hr>

        <div className='border border-gray-400 p-4 rounded-md'>
          <div className='flex flex-row justify-between items-center'>
            <h1 className="font-bold pb-3">Approved/Rejected Requests</h1>
            <div className="relative">
              <input
                type="text"
                placeholder="Search all fields..."
                value={allSearch}
                onChange={(e) => setAllSearch(e.target.value)}
                className="border border-gray-400  pl-8 mb-4 rounded-full"
              />
              <FaSearch className="absolute left-40 top-1 text-gray-400" />
            </div>
          </div>
          <table className="w-full">
            <thead>
              <tr>
                <th className="border border-solid border-gray-400 p-2 bg-gray-200">
                  <select onChange={(e) => setAllFilters({ ...allFilters, id: e.target.value })} className="bg-gray-200">
                    <option value="">Employee Id</option>
                    {allRequests.map(req => (
                      <option key={req.id} value={req.id}>{req.id}</option>
                    ))}
                  </select>
                </th>
                <th className="border border-solid border-gray-400 p-2 bg-gray-200">
                  <select onChange={(e) => setAllFilters({ ...allFilters, name: e.target.value })} className="bg-gray-200">
                    <option value="">Employee Name</option>
                    {[...new Set(allRequests.map(req => req.name))].map(name => (
                      <option key={name} value={name}>{name}</option>
                    ))}
                  </select>
                </th>
                <th className="border border-solid border-gray-400 p-2 bg-gray-200">
                  <select onChange={(e) => setAllFilters({ ...allFilters, role: e.target.value })} className="bg-gray-200">
                    <option value="">Role</option>
                    {[...new Set(allRequests.map(req => req.role))].map(role => (
                      <option key={role} value={role}>{role}</option>
                    ))}
                  </select>
                </th>
                <th className="border border-solid border-gray-400 p-2 bg-gray-200">Notice Period Days</th>
                <th className="border border-solid border-gray-400 p-2 bg-gray-200">Duration</th>
                <th className="border border-solid border-gray-400 p-2 bg-gray-200">Status</th>
                <th className="border border-solid border-gray-400 p-2 bg-gray-200">Comments</th>
              </tr>
            </thead>
            <tbody>
              {allRequestsToShow.map(req => (
                <tr key={req.id}>
                  <td className="border border-solid border-gray-400 p-2 text-center">{req.id}</td>
                  <td className="border border-solid border-gray-400 p-2 text-center">{req.name}</td>
                  <td className="border border-solid border-gray-400 p-2 text-center">{req.role}</td>
                  <td className="border border-solid border-gray-400 p-2 text-center">{req.noticePeriodDays}</td>
                  <td className="border border-solid border-gray-400 p-2 text-center">{req.duration}</td>
                  <td className="border border-solid border-gray-400 p-2 text-center">{req.status}</td>
                  <td className="border border-solid border-gray-400 p-2 text-center">{req.comments}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="flex justify-center items-center mt-4">
            <button onClick={() => setAllPage(allPage - 1)} disabled={allPage === 0}>
              &lt; 
            </button>
            <span className="mx-4">
              Page {allPage + 1} of {totalAllPages}
            </span>
            <button onClick={() => setAllPage(allPage + 1)} disabled={allPage === totalAllPages - 1}>
              &gt;
            </button>
          </div>
        </div>

        {showPopup && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-5 rounded shadow-lg">
              <h2 className="font-bold mb-4">Add Comments for {currentRequest?.name}</h2>
              <textarea 
                className="border border-gray-400 p-2 w-full" 
                rows="4" 
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
              {showValidationError && <p className="text-red-600">Comments are mandatory.</p>}
              <div className="flex justify-end mt-4">
                <button onClick={handleSubmit} className="bg-blue-500 text-white px-4 py-2 rounded">Submit</button>
                <button onClick={() => setShowPopup(false)} className="bg-gray-500 text-white px-4 py-2 rounded ml-2">Cancel</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ResignationApproval;
