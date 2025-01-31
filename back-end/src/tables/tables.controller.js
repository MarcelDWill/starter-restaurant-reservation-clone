const service = require("./tables.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

const VALID_PROPERTIES = [
    "table_name",
    "capacity",
    "people",
    "reservation_id",
];

function hasProperties(...properties) {
    return function (req, res, next) {
        const { data = {} } = req.body; // Corrected to req.body
        try {
            properties.forEach((property) => {
                if (!data[property]) {
                    const error = new Error(`A '${property}' property is required.`);
                    error.status = 400;
                    throw error;
                }
            });
            next();
        } catch (error) {
            next(error);
        }
    };
}

const hasRequiredProperties = hasProperties("table_name", "capacity");

function hasValidProperties(req, res, next) {
    const { data = {} } = req.body;
    const invalidFields = Object.keys(data).filter(
        (field) => !VALID_PROPERTIES.includes(field)
    );

    if (invalidFields.length) {
        return next({
            status: 400,
            message: `Invalid field(s): ${invalidFields.join(", ")}`,
        });
    }
    next();
}

function validTableName(req, res, next) {
    const tableName = req.body.data.table_name;
    if (tableName.length <= 2) {
        return next({
            status: 400,
            message: "table_name must be longer than two characters.",
        });
    }
    next();
}

function validCapacity(req, res, next) {
    const capacity = req.body.data.capacity;
    if (typeof capacity !== "number" || capacity < 1 || !Number.isInteger(capacity)) {
        return next({
            status: 400,
            message: "capacity must be a positive whole number greater than 0",
        });
    }
    next();
}

async function tableExists(req, res, next) {
    const { table_id } = req.params;
    const table = await service.read(table_id);
    if (table) {
        res.locals.table = table;
        return next();
    }
    next({
        status: 404,
        message: `Table ${table_id} cannot be found.`,
    });
}

async function reservationIdExists(req, res, next) {
    const reservation_id = req.body.data.reservation_id;
    const reservation = await service.readReservation(reservation_id);
    if (reservation) {
        res.locals.reservation = reservation;
        return next();
    }
    next({
        status: 404,
        message: `Reservation ${reservation_id} does not exist.`,
    });
}

const hasReservationId = hasProperties("reservation_id");

function tableIsOccupied(req, res, next) {
    const { table } = res.locals;
    if (table.reservation_id) {
      return next({
        status: 400,
        message: "Table is occupied.",
      });
    }
    next();
  }

async function tableIsUnoccupied(req, res, next) {
    const { table_id } = req.params;
    const table = await service.read(table_id);

    if (!table) {
        return next({
            status: 404,
            message: `Table ${table_id} cannot be found.`,
        });
    }

    if (!table.reservation_id) {
        return next({
            status: 400,
            message: `Table ${table_id} is not occupied.`, // Ensure this message is clear
        });
    }
    next(); // Call next() if the table is occupied
}

async function validTableCapacity(req, res, next) {
    const table = res.locals.table;
    const reservation = res.locals.reservation;

    if (!table || !reservation) {
        return next({
            status: 400,
            message: "Table or reservation information is missing.",
        });
    }

    const capacity = table.capacity;
    const party = reservation.people;
    if (capacity < party) {
        return next({
            status: 400,
            message: `Table does not have sufficient capacity.`,
        });
    }
    next();
}

async function create(req, res) {
    const data = await service.create(req.body.data);
    res.status(201).json({ data });
}

async function list(req, res) {
    const data = await service.list();
    res.json({ data });
}

async function update(req, res) {
    const updatedTable = {
        ...req.body.data,
        table_id: res.locals.table.table_id,
    };
    const data = await service.update(updatedTable);
    res.json({ data });
}

async function seat(req, res, next) {
    const { table_id } = res.locals.table;
    const { reservation_id } = req.body.data;

    if (!reservation_id) {
        return next({
            status: 400,
            message: "reservation_id is required",
        });
    }

    try {
        const data = await service.seat(table_id, reservation_id);
        res.status(200).json({ data });
    } catch (error) {
        next(error);
    }
}

async function destroy(req, res) {
    const table_id = res.locals.table.table_id;
  const data = await service.destroy(table_id);
  res.sendStatus(204);
}

async function deleteSeat(req, res, next) {
    const { table_id, reservation_id } = res.locals.table;
  
    if (!reservation_id) {
      return next({
        status: 400,
        message: "Table is not occupied.",
      });
    }
  
    try {
      const status = "finished";
      await service.updateStatus(reservation_id, status);
      await service.deleteSeatAssignment(table_id);
      res.status(200).json({ data: { status: "finished" } });
    } catch (error) {
      next(error);
    }
  }

module.exports = {
    create: [
        hasValidProperties,
        hasRequiredProperties,
        validTableName,
        validCapacity,
        asyncErrorBoundary(create)
    ],

    list: asyncErrorBoundary(list),

    update: [
        hasRequiredProperties,
        hasValidProperties,
        hasReservationId,
        tableExists,
        reservationIdExists,
        validTableName,
        validCapacity,
        tableIsUnoccupied,
        asyncErrorBoundary(update)
    ],

    seat: [
        tableExists,                          // Ensure the table exists
        hasReservationId,                    // Ensure reservation_id is present
        reservationIdExists,                 // Ensure the reservation exists
        validTableCapacity,                  // Ensure the table capacity is sufficient for the reservation
        tableIsOccupied,                     // Ensure the table is not already occupied
        asyncErrorBoundary(seat)             // Seat the reservation if validations pass
    ],

    delete: [
        tableExists, 
        asyncErrorBoundary(destroy)],

    deleteSeat: [
        asyncErrorBoundary(tableExists), // Ensure the table exists
        tableIsOccupied,                 // Ensure the table is currently occupied
        asyncErrorBoundary(deleteSeat)   // Delete the seat assignment
        ],
};