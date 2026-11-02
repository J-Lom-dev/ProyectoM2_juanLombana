let users = [
  { id: 1, name: "Ana Garcia", email: "ana@example.com"},
  { id: 2, name: "Carlos Ruiz", email: "carlos@example.com"},
];
let nextId = 3;

export const getAllUsers = (req, res) => {
  res.status(200).json(users);
};

export const getUsersById = (req, res) => {
  const id = Number(req.params.id);

  if (isNaN(id)) {
    return res.status(400).json({ error: "id must be a number" });
  }

  const user = users.find((u) => u.id === id);

  if (!user) {
    return res.status(404).json({ error: "user not found" });
  }

  res.status(200).json(user);
};

export const createUsers = (req, res) => {
  const { name, email } = req.body;

  if (!name || typeof name !== "string" || name.trim() == "") {
    return res.status(400).json({
      error: "name is required and cannot be empty",
    });
  }

  if (!email || typeof email !== "string" || email.trim() === "") {
    return res.status(400).json({
      error: "author is required and must be a non-empty string",
    });
  }

  const newuser = {
    id: nextId++,
    name: name.trim(),
    email: email.trim(),
  };

  users.push(newuser);

  res.status(201).json(newuser);
};

export const demo = (req, res) => {
  const id = req.params.id;

  const limit = req.query.limit; 
  const name = req.query.name;

  const data = req.body;

  res.json({
    params: { id },
    query: { limit, name },
    body: data,
  });
};
