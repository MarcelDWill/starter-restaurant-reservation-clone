import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ReservationForm from "./ReservationForm";

function NewReservation() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        first_name: "",
        last_name: "",
        mobile_number: "",
        reservation_date: "",
        reservation_time: "",
        people: 1,
    });

    const changeHandler = ({ target }) => {
        setFormData({
            ...formData,
            [target.name]: target.value,
        });
    };

    return (
        <div>
            <h1>New Reservation</h1>
            <form onSubmit={handleSubmit}>
                <label>Name: </label>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
                <br />
                <label>Date: </label>
                <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
                <br />
                <label>Time: </label>
                <input type="time" value={time} onChange={(e) => setTime(e.target.value)} />
                <br />
                <label>People: </label>
                <input type="number" value={people} onChange={(e) => setPeople(e.target.value)} />
                <br />
                <label>Phone: </label>
                <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} />
                <br />
                <button type="submit">Submit</button>
            </form>
        </div>
    );
}

export default newReservation;