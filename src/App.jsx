import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './styles.css';
const EmployeeDashboard = () => {
  const [employeeData, setEmployeeData] = useState([]);
  const [searchId, setSearchId] = useState('');
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedEmployees, setSelectedEmployees] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('https://dummy.restapiexample.com/api/v1/employees');
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        const data = await response.json();
        setEmployeeData(data.data);
        setFilteredData(data.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Error fetching data. Please try again later.');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSearch = () => {
    const filtered = employeeData.filter(employee => employee.id === parseInt(searchId));
    setFilteredData(filtered);
  };

  const handleDelete = async () => {
    try {
      const updatedData = employeeData.filter(employee => !selectedEmployees.includes(employee.id));
      setEmployeeData(updatedData);
      setFilteredData(updatedData);
      setSelectedEmployees([]);
    } catch (error) {
      console.error('Error deleting employees:', error);
      setError('Error deleting employees. Please try again later.');
    }
  };

  const handleCheckboxChange = (id) => {
    const updatedSelection = selectedEmployees.includes(id)
      ? selectedEmployees.filter(employeeId => employeeId !== id)
      : [...selectedEmployees, id];
    setSelectedEmployees(updatedSelection);
  };

  return (
    <div className="dashboard-container">
      <h1>Employee Dashboard</h1>
      <div className="search-container">
        <input
          type="text"
          placeholder="Enter Employee ID"
          value={searchId}
          onChange={(e) => setSearchId(e.target.value)}
        />
        <button onClick={handleSearch}>Search</button>
      </div>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>{error}</p>
      ) : (
        <div className="cards-container">
          {filteredData.map((employee) => (
            <div key={employee.id} className="card">
              <input
                type="checkbox"
                checked={selectedEmployees.includes(employee.id)}
                onChange={() => handleCheckboxChange(employee.id)}
              />
              <Link to={`/employee/${employee.id}`}>
                <h3 className="employee-name">{employee.employee_name}</h3>
              </Link>
              <p>{employee.employee_salary}</p>
              <p>{employee.employee_age}</p>
            </div>
          ))}
          {selectedEmployees.length > 0 && (
            <button onClick={handleDelete}>Delete Selected</button>
          )}
        </div>
      )}
    </div>
  );
};

export default EmployeeDashboard;
