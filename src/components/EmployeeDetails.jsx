import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import '../styles.css';

const EmployeeDetails = () => {
    const { id } = useParams();
    const [employeeDetails, setEmployeeDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchEmployeeDetails = async () => {
            try {
                const response = await fetch(`https://dummy.restapiexample.com/api/v1/employee/${id}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch employee details');
                }
                const data = await response.json();
                setEmployeeDetails(data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching employee details:', error);
                setError('Error fetching employee details. Please try again later.');
                setLoading(false);
            }
        };

        fetchEmployeeDetails();
    }, [id]);

    return (
        <div className="details-container">
            <h1>Employee Details</h1>
            {loading ? (
                <p>Loading...</p>
            ) : error ? (
                <p>{error}</p>
            ) : employeeDetails ? (
                <div className="employee-details">
                    <p>Name: {employeeDetails.employee_name}</p>
                    <p>Salary: {employeeDetails.employee_salary}</p>
                    <p>Age: {employeeDetails.employee_age}</p>
                    <p>Profile Image: {employeeDetails.profile_image}</p>

                </div>
            ) : (
                <p>No data found for employee ID: {id}</p>
            )}
        </div>
    );
};

export default EmployeeDetails;
