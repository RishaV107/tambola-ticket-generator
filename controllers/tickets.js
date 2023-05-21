import db from "../databases/db.js";

export const createTicket = async (req, res) => {
  const { numberOfTickets } = req.body;

  try {
    const tickets = await generateTambolaTickets(numberOfTickets);

    const ticketIds = await saveTicketsToDatabase(tickets);

    res.json({ ticketIds });
  } catch (error) {
    console.error("Error creating Tambola ticket:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getTicket = async (req, res) => {
  const { page, limit } = req.query;

  try {
    const tickets = await fetchTicketsFromDatabase(page, limit);

    res.json({ tickets });
  } catch (error) {
    console.error("Error fetching Tambola tickets:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const generateTambolaTickets = async (numberOfTickets) => {
  const tickets = [];
  for (let i = 0; i < numberOfTickets; i++) {
    const ticket = generateSingleTicket();
    tickets.push(ticket);
  }
  return tickets;
};

const generateSingleTicket = () => {
  const ticket = [];
  const numbers = Array.from({ length: 90 }, (_, i) => i + 1);

  for (let i = 0; i < 3; i++) {
    const column = [];
    for (let j = 0; j < 9; j++) {
      if (i === 0 && j === 0) {
        const randomNumber = getRandomNumber(numbers, 1, 9);
        column.push(randomNumber);
      } else if (i === 2 && j === 8) {
        const randomNumber = getRandomNumber(numbers, 80, 90);
        column.push(randomNumber);
      } else {
        const maxNumber = i === 1 ? 20 + j * 10 : 10 + j * 10;
        const randomNumber = getRandomNumber(numbers, maxNumber - 9, maxNumber);
        if (numbers.length > 0 && Math.random() < 0.7) {
          const randomNumber = getRandomNumber(
            numbers,
            maxNumber - 9,
            maxNumber
          );
          column.push(randomNumber);
        } else {
          column.push(0);
        }
      }
    }
    ticket.push(column);
  }

  return ticket;
};

const getRandomNumber = (numbers, min, max) => {
  const availableNumbers = numbers.filter((num) => num >= min && num <= max);
  const randomIndex = Math.floor(Math.random() * availableNumbers.length);
  const randomNumber = availableNumbers[randomIndex];
  numbers.splice(numbers.indexOf(randomNumber), 1);
  return randomNumber;
};

const saveTicketsToDatabase = async (tickets) => {
  const ticketIds = [];
  for (const ticket of tickets) {
    const [result] = await db.query("INSERT INTO tickets (data) VALUES (?)", [
      JSON.stringify(ticket),
    ]);
    ticketIds.push(result.insertId);
  }
  return ticketIds;
};

const fetchTicketsFromDatabase = async (page, limit) => {
  const offset = (page - 1) * limit;
  const [results] = await db.query("SELECT * FROM tickets LIMIT ?, ?", [
    offset,
    +limit,
  ]);
  return results;
};
