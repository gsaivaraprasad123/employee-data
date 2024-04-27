import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../styles.css';

const EmployeeDashboard = () => {
    const [employeeData, setEmployeeData] = useState([]);
    const [searchId, setSearchId] = useState('');
    const [filteredData, setFilteredData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [editEmployee, setEditEmployee] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);

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

    const handleDelete = async (id) => {
        try {
            const response = await fetch(`https://dummy.restapiexample.com/api/v1/delete/${id}`, {
                method: 'DELETE',
            });
            if (!response.ok) {
                throw new Error('Failed to delete employee');
            }
            setEmployeeData(employeeData.filter(employee => employee.id !== id));
            setFilteredData(filteredData.filter(employee => employee.id !== id));
        } catch (error) {
            console.error('Error deleting employee:', error);
            setError('Error deleting employee. Please try again later.');
        }
    };

    const handleEdit = (employee) => {
        setEditEmployee(employee);
        setShowEditModal(true);
    };

    const handleUpdateEmployee = () => {

        const updatedData = employeeData.map(employee => {
            if (employee.id === editEmployee.id) {
                return {
                    ...employee,
                    employee_name: editEmployee.employee_name,
                    employee_salary: editEmployee.employee_salary,
                    employee_age: editEmployee.employee_age,
                };
            }
            return employee;
        });

        setEmployeeData(updatedData);
        setFilteredData(updatedData);
        console.log('Updated employee details:', editEmployee);
        setShowEditModal(false);
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
                            <Link to={`/employee/${employee.id}`}>
                                <h3 className="employee-name">{employee.employee_name}</h3>
                            </Link>
                            <p>{employee.employee_salary}</p>
                            <p>{employee.employee_age}</p>
                            <button className="delete-btn" onClick={() => handleDelete(employee.id)}>Delete</button>
                            <button className="edit-btn" onClick={() => handleEdit(employee)}>Edit</button>
                        </div>
                    ))}
                </div>
            )}


            {showEditModal && (
                <div className="edit-modal">
                    <h2>Edit Employee Details</h2>
                    <label>Name:</label>
                    <input
                        type="text"
                        value={editEmployee.employee_name}
                        onChange={(e) => setEditEmployee({ ...editEmployee, employee_name: e.target.value })}
                    />
                    <label>Salary:</label>
                    <input
                        type="text"
                        value={editEmployee.employee_salary}
                        onChange={(e) => setEditEmployee({ ...editEmployee, employee_salary: e.target.value })}
                    />
                    <label>Age:</label>
                    <input
                        type="text"
                        value={editEmployee.employee_age}
                        onChange={(e) => setEditEmployee({ ...editEmployee, employee_age: e.target.value })}
                    />
                    <button onClick={handleUpdateEmployee}>Update</button>
                    <button onClick={() => setShowEditModal(false)}>Cancel</button>
                </div>
            )}
        </div>
    );
};

export default EmployeeDashboard;
