const service = require("./reservations.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const hasProperties = require("../errors/hasProperties");

const VALID_PROPERTIES = [
  "first_name",
  "last_name",
  "mobile_number",
  "reservation_date",
  "reservation_time",
  "people",
  "status",
  "reservation_id",
  "created_at",
  "updated_at",
];

const hasRequiredProperties = hasProperties(
  "first_name",
  "last_name",
  "mobile_number",
  "reservation_date",
  "reservation_time",
  "people"
);

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

function hasValidDate(req, res, next) {
  const { data = {} } = req.body;
  const { reservation_date, reservation_time } = data;

  console.log("Received reservation_date:", reservation_date);
  console.log("Received reservation_time:", reservation_time);

  if (!reservation_date || isNaN(Date.parse(reservation_date))) {
    return next({
      status: 400,
      message: `Invalid reservation_date`,
    });
  }

  if (!reservation_time || !/^\d{2}:\d{2}$/.test(reservation_time)) {
    return next({
      status: 400,
      message: `Invalid reservation_time`,
    });
  }

  const day = new Date(reservation_date).getUTCDay();
  if (day === 2) {
    return next({
      status: 400,
      message: `Restaurant is closed on Tuesdays`,
    });
  }

  const formattedDate = new Date(`${reservation_date}T${reservation_time}:00`);
  console.log("Formatted reservation date and time:", formattedDate);

  if (isNaN(formattedDate.getTime())) {
    return next({
      status: 400,
      message: `Invalid reservation date and time combination`,
    });
  }

  const now = new Date(); // Compare using UTC
  console.log("Current date and time:", now);

  if (formattedDate <= now) {
    return next({
      status: 400,
      message: `Reservation must be in the future`,
    });
  }

  next();
}



async function validateBody(request, res, next) {
  const required = [
    "first_name",
    "last_name",
    "mobile_number",
    "reservation_date",
    "reservation_time",
    "people",
  ];

  for (const field of required) {
    if (!request.body.data.hasOwnProperty(field) || request.body.data[field] === "") {
      return next({ status: 400, message: `Field required: '${field}'` });
    }
  }

  if (typeof request.body.data.people !== "number") {
    return next({
      status: 400,
      message: `The 'people' field must be a number.`,
    });
  }

  if (request.body.data.people < 1) {
    return next({
      status: 400,
      message: `The 'people' field must be at least 1.`,
    });
  }

  if (
    Number.isNaN(Date.parse(`${request.body.data.reservation_date} ${request.body.data.reservation_time}`))
  ) {
    return next({
      status: 400,
      message: `'reservation_date' or 'reservation_time' field is not in the correct format`,
    });
  }

  next();
}




function hasValidTime(req, res, next) {
  const { data = {} } = req.body;
  const time = data["reservation_time"];

  const timeRegex = /^([01]?\d|2[0-3]):([0-5]\d)(:([0-5]\d))?$/;
  if (!timeRegex.test(time)) {
    return next({
      status: 400,
      message: "Invalid reservation_time format. Use HH:MM or HH:MM:SS.",
    });
  }

  const [hours, minutes] = time.split(":").map(Number);
  if (hours < 10 || (hours === 10 && minutes < 30)) {
    return next({
      status: 400,
      message: "Reservation must be after 10:30AM.",
    });
  }
  if (hours > 21 || (hours === 21 && minutes > 30)) {
    return next({
      status: 400,
      message: "Reservation must be before 9:30PM.",
    });
  }

  next();
}


function hasValidNumber(req, res, next) {
  const { data = {} } = req.body;
  const people = data["people"];

  if (typeof people !== "number" || people < 1) {
    return next({
      status: 400,
      message: `The 'people' field must be a number greater than or equal to 1.`,
    });
  }

  if (!Number.isInteger(people)) {
    return next({
      status: 400,
      message: `The 'people' field must be a whole number.`,
    });
  }

  next();
}


async function reservationExists(req, res, next) {
  const { reservation_id } = req.params;
  const reservation = await service.read(reservation_id);
  if (reservation) {
    res.locals.reservation = reservation;
    return next();
  }
  next({ status: 404, message: `Reservation ${reservation_id} cannot be found.` });
}

async function validateData(request, res, next) {
  if (!request.body.data) {
      return next({ status: 400, message: "Body must include a data object" });
  }
  next();
}

function hasValidStatus(req, res, next) {
  const { status } = req.body.data;
  const currentStatus = res.locals.reservation.status;

  if (currentStatus === "finished" || currentStatus === "cancelled") {
    return next({
      status: 400,
      message: `Reservation status is finished`,
    });
  }
  if (
    status === "booked" ||
    status === "seated" ||
    status === "finished" ||
    status === "cancelled"
  ) {
    res.locals.status = status;
    return next();
  }
  next({
    status: 400,
    message: `Invalid status: ${status}`,
  });
}

/**
 * List handler for reservation resources
 */
async function list(req, res) {
  const { date, mobile_number } = req.query;//destructure date and mobile_number from the query

  if (date) {
    res.json({ data: await service.listByDate(date) });//return the list of reservations by date
  } else if (mobile_number) {
    res.json({ data: await service.searchByPhone(mobile_number) });//return the list of reservations by phone number
  } else {
    res.json({ data: await service.list() });//return the list of all reservations
  }
}

async function create(req, res) {
  const data  = await service.create(req.body.data);
  res.status(201).json({ data  });
}

async function read(req, res) {
  const { reservation } = res.locals;
  res.json({ data: { ...reservation } });
}

async function update(req, res) {
  const updatedRes = {
    ...req.body.data,
    reservation_id: res.locals.reservation.reservation_id,
  };
  const data = await service.update(updatedRes);
  res.status(200).json({ data });
}

async function updateStatus(req, res) {
  const { status } = res.locals;
  const { reservation_id } = res.locals.reservation;
  const data = await service.updateStatus(reservation_id, status);
  res.status(200).json({ data });
}




module.exports = {
  list: asyncErrorBoundary(list),
  create: [
    asyncErrorBoundary(validateData),  // Ensure data object exists
    hasRequiredProperties,            // Validate required properties are present
    hasValidProperties,               // Check for invalid fields
    hasValidNumber,                   // Ensure 'people' is a valid number before date/time
    hasValidDate,                     // Validate reservation date and ensure not a closed day
    hasValidTime,                     // Validate reservation time
    asyncErrorBoundary(validateBody), // Additional validation logic (general)
    asyncErrorBoundary(create),       // Create reservation
  ],
  
  read: [asyncErrorBoundary(reservationExists), read],
  update: [
    reservationExists,
    hasRequiredProperties,
    hasValidProperties,
    hasValidDate,
    hasValidNumber,
    hasValidTime,
    hasValidStatus,
    asyncErrorBoundary(validateBody),
    asyncErrorBoundary(update), // Move this to the end
  ],
  updateStatus: [
    reservationExists,
    hasValidStatus,
    asyncErrorBoundary(updateStatus),
  ],
  reservationExists,
};
