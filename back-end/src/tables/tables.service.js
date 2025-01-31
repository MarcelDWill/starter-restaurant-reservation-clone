const knex = require("../db/connection");

function list() {
    return knex("tables")
    .select("*")
    .orderBy("table_name");
    }

function create(table) {
    return knex("tables")
    .insert(table)
    .returning("*")
    .then((createdRecord) => createdRecord[0]);
}

function read(table_id) {
    return knex("tables")
    .select("*")
    .where({ table_id })
    .first();

}

function readReservation(reservation_id) {
    return knex("reservations")
    .select("*")
    .where({ reservation_id: reservation_id })
    .then((selectedResults) => selectedResults[0]);
}

function seat(table_id, reservation_id) {
    return knex("tables")
      .where({ table_id })
      .update({ reservation_id }, ["*"]);
  }

function update(updatedTable) {
    return knex("tables")
    .select("*")
    .where({ table_id: updatedTable.table_id })
    .update(updatedTable, "*")
    .then((updatedRecord) => updatedRecord[0]);
}

function updateStatus(reservation_id, status){
    return knex("reservations")
        .where({ reservation_id: reservation_id })
        .update({ status: status })
}

function destroy(table_id) {
    return knex("tables")
    .where({ table_id }).del();
}

function deleteSeat(table_id) {
    return knex("tables")
    .select("*")
    .where({ table_id })
    .update({ reservation_id: null });
}


module.exports = {
    list,
    seat,
    create,
    read,
    update,
    updateStatus,
    destroy,
    deleteSeat,
    readReservation,
};