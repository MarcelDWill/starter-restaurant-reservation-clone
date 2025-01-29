const knex = require('../db/connection');   //importing knex connection


function list() {//function to list all reservations
    return knex('reservations')
    .select('*')//selecting all columns
    .orderBy('reservation_time');//ordering by reservation_time
}

function listByDate(reservation_date) {//function to list reservations by date
    return knex('reservations')
    .select('*')//selecting all columns
    .where({ reservation_date })//where the reservation_date is equal to the reservation_date passed in
    .orderBy('reservation_time');//ordering by reservation_time
}

function searchByPhone(mobile_number) {
    return knex('reservations')
    .select('*')//selecting all columns
    .where('mobile_number', 'like', `${mobile_number}%`)//where the mobile_number is like the mobile_number passed in
    .orderBy('reservation_date');//ordering by reservation_time
}

function create(reservation) {
    return knex('reservations')
    .insert(reservation)//inserting the reservation object into the reservations table
    .then((res)=> res[0]);//returning the first element of the array
}

function read(reservation_id) {
    return knex('reservations')
    .select('*')//selecting all columns
    .where({ reservation_id })//where the reservation_id is equal to the reservation_id passed in
    .first();//returning the first element of the array
}
function update(updatedReservation) {
    return knex('reservations')
    .select('*')//selecting all columns
    .where({ reservation_id: updatedReservation.reservation_id })//where the reservation_id is equal to the reservation_id passed in
    .update(updatedReservation, '*')//updating the reservation with the updatedReservation object
    .then((res) => res[0]);//returning the first element of the array
}

function updateStatus(reservation_id, status) {
    return knex('reservations')
    .select('*')//selecting all columns
    .where({ reservation_id })//where the reservation_id is equal to the reservation_id passed in
    .update({ status }, '*')//updating the status with the status passed in
    .then(() => read(reservation_id));//returning the reservation with the reservation_id passed in
}

module.exports = {
    list,
    listByDate,
    create,
    read,
    update,
    updateStatus,
    searchByPhone,
};