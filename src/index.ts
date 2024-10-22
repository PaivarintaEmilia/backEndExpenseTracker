import { Hono, Context, Next } from 'hono';
import { drizzle } from 'drizzle-orm/d1';
import { users } from './db/schema';
import jwt from 'jsonwebtoken';
import { jwt as honoJwt } from 'hono/jwt';
import type { JwtVariables } from 'hono/jwt';

export type Env = {
  DB: D1Database;
  JWT_SECRET: string; // Lisää salaisuus JWT-tokenin allekirjoittamiseen
}

const app = new Hono<{ Bindings: Env; Variables: JwtVariables }>();

// CORS Middleware
app.use('*', async (c: Context, next: Next): Promise<void> => {
  c.header('Access-Control-Allow-Origin', 'http://localhost:5173');
  c.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  c.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');

  if (c.req.method === 'OPTIONS') {
      c.status(204); // Aseta statuskoodi 204
      return; // Älä palauta runkoa
  }

  await next(); // Jatka seuraavaan middlewareen tai reittikäsittelijään
});



// Rekisteröintireitti
app.post('/register', async (c) => {
  const db = drizzle(c.env.DB);
  const { username, password } = await c.req.json();

  // Uuden käyttäjän tietojen tallentaminen tietokantaan
  await db
      .insert(users)
      .values({ username, password })
      .returning();

  // JWT-tokenin luominen
  const token = jwt.sign({ username }, c.env.JWT_SECRET, { expiresIn: '1h' });
  console.log('JWT_SECRET:', token);

  // Tokenin palauttaminen front-endin puolelle
  c.header('Authorization', `Bearer ${token}`);
  return c.json({ message: 'User registered successfully' }); // Varmista, että tämä on oikein
});


// Aseta OPTIONS-reitti rekisteröintiin
app.options('/register', (c) => {
  try {
      c.header('Access-Control-Allow-Origin', 'http://localhost:5173');
      c.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
      c.header('Access-Control-Allow-Methods', 'POST, OPTIONS');
      return c.json({}, 204); // Palauta tyhjät vastaukset esikyselylle
  } catch (error) {
      console.error("Virhe OPTIONS-reitillä:", error);
      return c.json({ error: 'Internal Server Error' }, 500);
  }
});



// JWT Middleware (tarvittaessa)
// JWT Middleware (tarvittaessa)
app.use('/protected/*', async (c, next) => {
  const jwtMiddleware = honoJwt({
    secret: c.env.JWT_SECRET,
  });

  // Käytä jwtMiddleware, joka palauttaa Response-objektin
  const result = await jwtMiddleware(c, next); 

  // Jos result ei ole undefined, se tarkoittaa, että middleware on käsitellyt pyynnön
  if (result) {
    return result; // Palauta mahdollinen Response-objekti
  }
  
  // Jos kontrolli siirretään seuraavalle middlewarelle
  await next();
});


// Muut reitit
app.get('/users', async (c) => {
  const db = drizzle(c.env.DB);
  const result = await db.select().from(users).all();
  return c.json(result);
})
.post('/users', async (c) => {
  const db = drizzle(c.env.DB);
  const { username, password } = await c.req.json();
  const result = await db
    .insert(users)
    .values({ username, password })
    .returning();
  return c.json(result);
});

export default app;
