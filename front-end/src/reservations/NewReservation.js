import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ReservationForm from "./ReservationForm";
import { createReservation } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";

function NewReservation() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        first_name: "",
        last_name: "",
        mobile_number: "",
        reservation_date: "",
        reservation_time: "",
        people: "1",
    });
    const [errorAlert, setErrorAlert] = useState(null);

    const changeHandler = ({ target }) => {
        setFormData({
            ...formData,
            [target.name]: target.value,
        });
    };

    const submitHandler = async (event) => {
        event.preventDefault();
        
        const abortController = new AbortController();
        try {
            await createReservation(formData, abortController.signal);
            navigate("/dashboard");
        } catch (error) {
            setErrorAlert(error);
        }
        return () => abortController.abort();
    };

    return (
        <div>
            <h1>New Reservation</h1>
            <ErrorAlert error={errorAlert} />
            <ReservationForm
                formData={formData}
                changeHandler={changeHandler}
                submitHandler={submitHandler}
            />
        </div>
    );

}

export default NewReservation;