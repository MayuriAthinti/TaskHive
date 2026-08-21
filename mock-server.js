const http = require('http');
const fs = require('fs');

const PORT = process.env.PORT || 4500;

function readDatabase() {
  const data = fs.readFileSync('./db.json', 'utf8');
  return JSON.parse(data);
}

function writeDatabase(db) {
  fs.writeFileSync('./db.json', JSON.stringify(db, null, 2));
}

function sendJson(res, statusCode, data) {
  res.writeHead(statusCode, {
    'Content-Type': 'application/json'
  });

  res.end(JSON.stringify(data));
}

function getRequestBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';

    req.on('data', chunk => {
      body += chunk;
    });

    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (error) {
        reject(error);
      }
    });
  });
}

const server = http.createServer(async (req, res) => {

  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, PUT, DELETE, OPTIONS'
  );
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Content-Type, Authorization'
  );

  // Preflight
  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  try {

    const db = readDatabase();

    // =========================
    // LOGIN
    // =========================

    if (req.url === '/auth/login' && req.method === 'POST') {

      const body = await getRequestBody(req);

      const user = db.users?.find(
        u =>
          u.email === body.email &&
          u.password === body.password
      );

      if (!user) {
        sendJson(res, 401, {
          message: 'Invalid email or password'
        });
        return;
      }

      sendJson(res, 200, {
        token: `mock-token-${user.id}`,
        user: {
          id: user.id,
          name: user.name,
          email: user.email
        }
      });

      return;
    }

    // =========================
    // REGISTER
    // =========================

    if (req.url === '/auth/register' && req.method === 'POST') {

      const body = await getRequestBody(req);

      const existingUser = db.users?.find(
        u => u.email === body.email
      );

      if (existingUser) {
        sendJson(res, 409, {
          message: 'User already exists'
        });
        return;
      }

      const newUser = {
        id: Date.now(),
        name: body.name,
        email: body.email,
        password: body.password
      };

      if (!db.users) {
        db.users = [];
      }

      db.users.push(newUser);

      writeDatabase(db);

      sendJson(res, 201, {
        token: `mock-token-${newUser.id}`,
        user: {
          id: newUser.id,
          name: newUser.name,
          email: newUser.email
        }
      });

      return;
    }

    // =========================
    // GET TASKS
    // =========================

    if (req.url === '/tasks' && req.method === 'GET') {

      sendJson(res, 200, db.tasks || []);

      return;
    }

    // =========================
    // GET PROJECTS
    // =========================

    if (req.url === '/projects' && req.method === 'GET') {

      sendJson(res, 200, db.projects || []);

      return;
    }

    // =========================
    // API NOT FOUND
    // =========================

    sendJson(res, 404, {
      message: 'Endpoint not found'
    });

  } catch (error) {

    console.error(error);

    sendJson(res, 500, {
      message: 'Internal server error'
    });
  }
});

server.listen(PORT, () => {
  console.log(`Mock server running on http://localhost:${PORT}`);
});