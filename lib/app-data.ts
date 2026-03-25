import { sql } from './db.js';
import crypto from 'node:crypto';

function inferAvatarGender(name: string) {
  const firstName = name.trim().split(/\s+/)[0]?.toLowerCase() || '';
  const femaleNames = new Set([
    'ada', 'ama', 'anna', 'bella', 'chloe', 'diana', 'ella', 'emma', 'faith', 'grace',
    'hana', 'ivy', 'jane', 'julia', 'kate', 'lisa', 'maria', 'mary', 'maya', 'nana',
    'nora', 'olivia', 'queen', 'ruth', 'sarah', 'sophia', 'tina', 'zara',
  ]);
  const maleNames = new Set([
    'alex', 'ben', 'charles', 'daniel', 'david', 'edward', 'eli', 'emmanuel', 'ethan',
    'felix', 'george', 'henry', 'isaac', 'james', 'john', 'joseph', 'jude', 'kelvin',
    'kwame', 'leo', 'mark', 'michael', 'nathan', 'noah', 'owen', 'paul', 'samuel',
  ]);

  if (femaleNames.has(firstName)) {
    return 'girl';
  }

  if (maleNames.has(firstName)) {
    return 'boy';
  }

  // Heuristic fallback when the name is unknown.
  return /a$|e$|i$/.test(firstName) ? 'girl' : 'boy';
}

function buildGeneratedAvatar(name: string) {
  const variant = inferAvatarGender(name);
  return `https://avatar.iran.liara.run/public/${variant}?username=${encodeURIComponent(name)}`;
}

function isGeneratedAvatar(avatar?: string) {
  return Boolean(
    avatar &&
      (avatar.includes('avatar.iran.liara.run/public/') ||
        avatar.includes('api.dicebear.com/7.x/avataaars/svg'))
  );
}

async function ensureOrganizerExists(organizerId: string) {
  const existingRows = await sql.query(`select id from organizers where id = $1 limit 1`, [organizerId]);

  if (existingRows[0]) {
    return;
  }

  const userRows = await sql.query(
    `select name, email, avatar from app_users where id = $1 limit 1`,
    [organizerId]
  );

  const user = userRows[0];
  const organizerName = user?.name || 'Pulse Studio';
  const organizerAvatar =
    user?.avatar ||
    buildGeneratedAvatar(organizerName);
  const organizerBio = user?.email
    ? `Organizer account for ${user.email}`
    : 'Organizer profile created automatically.';

  await sql.query(
    `
      insert into organizers (id, name, bio, avatar, is_verified, events_hosted, rating)
      values ($1, $2, $3, $4, false, 0, 5.0)
      on conflict (id) do nothing
    `,
    [organizerId, organizerName, organizerBio, organizerAvatar]
  );
}

function mapEvent(row: any) {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    date: row.date,
    time: row.time,
    location: row.location,
    address: row.address,
    price: Number(row.price),
    capacity: Number(row.capacity),
    ticketsSold: Number(row.tickets_sold),
    category: row.category,
    imageUrl: row.image_url,
    organizerId: row.organizer_id,
    organizer: {
      id: row.organizer_id,
      name: row.organizer_name,
      bio: row.organizer_bio,
      avatar: row.organizer_avatar,
      isVerified: row.organizer_is_verified,
      eventsHosted: Number(row.organizer_events_hosted),
      rating: Number(row.organizer_rating),
    },
    isTrending: row.is_trending,
    isVerified: row.is_verified,
    trustScore: row.trust_score == null ? undefined : Number(row.trust_score),
  };
}

function mapTicket(row: any) {
  return {
    id: row.ticket_id,
    eventId: row.event_id,
    userId: row.user_id,
    purchaseDate: row.purchase_date,
    qrCode: row.qr_code,
    status: row.status,
    price: Number(row.ticket_price),
    event: mapEvent(row),
  };
}

const eventSelect = `
  select
    e.id,
    e.title,
    e.description,
    to_char(e.event_date, 'YYYY-MM-DD') as date,
    e.event_time as time,
    e.location,
    e.address,
    e.price,
    e.capacity,
    e.tickets_sold,
    e.category,
    e.image_url,
    e.organizer_id,
    e.is_trending,
    e.is_verified,
    e.trust_score,
    o.name as organizer_name,
    o.bio as organizer_bio,
    o.avatar as organizer_avatar,
    o.is_verified as organizer_is_verified,
    o.events_hosted as organizer_events_hosted,
    o.rating as organizer_rating
  from events e
  join organizers o on o.id = e.organizer_id
`;

const ticketEventFields = `
  e.id,
  e.title,
  e.description,
  to_char(e.event_date, 'YYYY-MM-DD') as date,
  e.event_time as time,
  e.location,
  e.address,
  e.price,
  e.capacity,
  e.tickets_sold,
  e.category,
  e.image_url,
  e.organizer_id,
  e.is_trending,
  e.is_verified,
  e.trust_score,
  o.name as organizer_name,
  o.bio as organizer_bio,
  o.avatar as organizer_avatar,
  o.is_verified as organizer_is_verified,
  o.events_hosted as organizer_events_hosted,
  o.rating as organizer_rating
`;

export async function getEvents() {
  const rows = await sql.query(`${eventSelect} order by e.event_date asc, e.event_time asc`);
  const categoriesRows = await sql.query(`select distinct category from events order by category asc`);

  return {
    events: rows.map(mapEvent),
    categories: categoriesRows.map((row: any) => row.category),
  };
}

export async function getEventById(id: string) {
  const rows = await sql.query(`${eventSelect} where e.id = $1 limit 1`, [id]);
  return rows[0] ? mapEvent(rows[0]) : null;
}

export async function getUserDashboard(userId: string) {
  const userRows = await sql.query(
    `select id, name, email, avatar from app_users where id = $1 limit 1`,
    [userId]
  );

  const upcomingRows = await sql.query(
    `
      select
        t.id as ticket_id,
        t.event_id,
        t.user_id,
        to_char(t.purchase_date, 'YYYY-MM-DD') as purchase_date,
        t.qr_code,
        t.status,
        t.price as ticket_price,
        ${ticketEventFields}
      from tickets t
      join events e on e.id = t.event_id
      join organizers o on o.id = e.organizer_id
      where t.user_id = $1 and t.status = 'upcoming'
      order by e.event_date asc, e.event_time asc
    `,
    [userId]
  );

  const savedRows = await sql.query(
    `
      ${eventSelect}
      join saved_events se on se.event_id = e.id
      where se.user_id = $1
      order by e.event_date asc, e.event_time asc
    `,
    [userId]
  );

  const recommendedRows = await sql.query(
    `${eventSelect} order by e.trust_score desc nulls last, e.event_date asc limit 4`
  );

  return {
    user: userRows[0] || null,
    upcomingTickets: upcomingRows.map(mapTicket),
    savedEvents: savedRows.map(mapEvent),
    recommendedEvents: recommendedRows.map(mapEvent),
  };
}

export async function getUserTickets(userId: string) {
  const rows = await sql.query(
    `
      select
        t.id as ticket_id,
        t.event_id,
        t.user_id,
        to_char(t.purchase_date, 'YYYY-MM-DD') as purchase_date,
        t.qr_code,
        t.status,
        t.price as ticket_price,
        ${ticketEventFields}
      from tickets t
      join events e on e.id = t.event_id
      join organizers o on o.id = e.organizer_id
      where t.user_id = $1
      order by e.event_date asc, e.event_time asc
    `,
    [userId]
  );

  return rows.map(mapTicket);
}

export async function getOrganizerDashboard(organizerId: string) {
  await ensureOrganizerExists(organizerId);

  const eventsRows = await sql.query(
    `${eventSelect} where e.organizer_id = $1 order by e.event_date asc, e.event_time asc`,
    [organizerId]
  );

  const statsRows = await sql.query(
    `
      select
        count(*)::int as total_events,
        coalesce(sum(tickets_sold), 0)::int as tickets_sold,
        coalesce(sum(tickets_sold * price), 0)::numeric as revenue,
        count(*) filter (where event_date >= current_date)::int as active_events
      from events
      where organizer_id = $1
    `,
    [organizerId]
  );

  const monthlyRows = await sql.query(
    `
      select
        to_char(date_trunc('month', event_date), 'Mon') as month,
        coalesce(sum(tickets_sold), 0)::int as sales,
        coalesce(sum(tickets_sold * price), 0)::numeric as revenue
      from events
      where organizer_id = $1
      group by date_trunc('month', event_date)
      order by date_trunc('month', event_date)
    `,
    [organizerId]
  );

  const recentTicketsRows = await sql.query(
    `
      select
        u.name,
        to_char(t.purchase_date, 'YYYY-MM-DD') as purchase_date
      from tickets t
      join app_users u on u.id = t.user_id
      join events e on e.id = t.event_id
      where e.organizer_id = $1
      order by t.purchase_date desc
      limit 4
    `,
    [organizerId]
  );

  return {
    stats: {
      totalEvents: Number(statsRows[0]?.total_events || 0),
      ticketsSold: Number(statsRows[0]?.tickets_sold || 0),
      revenue: Number(statsRows[0]?.revenue || 0),
      activeEvents: Number(statsRows[0]?.active_events || 0),
    },
    events: eventsRows.map(mapEvent),
    salesData: monthlyRows.map((row: any) => ({ month: row.month, sales: Number(row.sales) })),
    revenueData: monthlyRows.map((row: any) => ({ month: row.month, revenue: Number(row.revenue) })),
    recentCheckins: recentTicketsRows.map((row: any) => ({
      name: row.name,
      time: row.purchase_date,
    })),
  };
}

export async function createEvent(input: {
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  address: string;
  category: string;
  price: string;
  capacity: string;
  imageUrl: string;
  organizerId: string;
}) {
  await ensureOrganizerExists(input.organizerId);

  const idRows = await sql.query(`select concat('evt-', coalesce(max(substring(id from 5)::int), 0) + 1) as id from events`);
  const nextId = idRows[0]?.id || `evt-${Date.now()}`;

  await sql.query(
    `
      insert into events (
        id, title, description, event_date, event_time, location, address, price,
        capacity, tickets_sold, category, image_url, organizer_id, is_trending, is_verified, trust_score
      )
      values ($1, $2, $3, $4::date, $5, $6, $7, $8::numeric, $9::int, 0, $10, $11, $12, false, true, 85)
    `,
    [
      nextId,
      input.title,
      input.description,
      input.date,
      input.time,
      input.location,
      input.address,
      input.price,
      input.capacity,
      input.category,
      input.imageUrl,
      input.organizerId,
    ]
  );

  await sql.query(
    `
      update organizers
      set events_hosted = (
        select count(*)::int from events where organizer_id = $1
      )
      where id = $1
    `,
    [input.organizerId]
  );

  return getEventById(nextId);
}

export async function purchaseTickets(input: {
  eventId: string;
  userId: string;
  quantity: number;
}) {
  const event = await getEventById(input.eventId);

  if (!event) {
    throw new Error('Event not found');
  }

  const availableTickets = event.capacity - event.ticketsSold;

  if (input.quantity < 1) {
    throw new Error('Quantity must be at least 1');
  }

  if (availableTickets < input.quantity) {
    throw new Error('Not enough tickets available');
  }

  const idRows = await sql.query(`select coalesce(max(substring(id from 5)::int), 0) as max_id from tickets`);
  let nextId = Number(idRows[0]?.max_id || 0);

  for (let index = 0; index < input.quantity; index += 1) {
    nextId += 1;
    const ticketId = `tkt-${nextId}`;
    const qrCode = `QR${Date.now()}${index}`;

    await sql.query(
      `
        insert into tickets (id, event_id, user_id, purchase_date, qr_code, status, price)
        values ($1, $2, $3, current_date, $4, 'upcoming', $5)
      `,
      [ticketId, input.eventId, input.userId, qrCode, event.price]
    );
  }

  await sql.query(
    `
      update events
      set tickets_sold = tickets_sold + $2
      where id = $1
    `,
    [input.eventId, input.quantity]
  );

  return getUserTickets(input.userId);
}

function hashPassword(password: string) {
  return crypto.createHash('sha256').update(password).digest('hex');
}

export async function signupUser(input: {
  name: string;
  email: string;
  password: string;
  isOrganizer?: boolean;
}) {
  const existingRows = await sql.query(`select id from app_users where lower(email) = lower($1) limit 1`, [
    input.email,
  ]);

  if (existingRows[0]) {
    throw new Error('An account with that email already exists.');
  }

  const idRows = await sql.query(
    `select concat('user-', coalesce(max(substring(id from 6)::int), 0) + 1) as id from app_users`
  );
  const nextId = idRows[0]?.id || `user-${Date.now()}`;
  const avatar = buildGeneratedAvatar(input.name);

  await sql.query(
    `
      insert into app_users (id, name, email, avatar, password_hash)
      values ($1, $2, $3, $4, $5)
    `,
    [nextId, input.name, input.email, avatar, hashPassword(input.password)]
  );

  if (input.isOrganizer) {
    await ensureOrganizerExists(nextId);
  }

  return {
    id: nextId,
    name: input.name,
    email: input.email,
    avatar,
    isOrganizer: Boolean(input.isOrganizer),
  };
}

export async function loginUser(input: { email: string; password: string }) {
  const rows = await sql.query(
    `
      select id, name, email, avatar, password_hash
      from app_users
      where lower(email) = lower($1)
      limit 1
    `,
    [input.email]
  );

  const user = rows[0];

  if (!user) {
    throw new Error('No account found for that email.');
  }

  if (user.password_hash !== hashPassword(input.password)) {
    throw new Error('Incorrect password.');
  }

  const organizerRows = await sql.query(`select id from organizers where id = $1 limit 1`, [user.id]);

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    avatar: user.avatar,
    isOrganizer: Boolean(organizerRows[0]),
  };
}

export async function getUserProfile(userId: string) {
  const rows = await sql.query(
    `
      select id, name, email, avatar
      from app_users
      where id = $1
      limit 1
    `,
    [userId]
  );

  const user = rows[0];

  if (!user) {
    throw new Error('User not found.');
  }

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    avatar: user.avatar,
  };
}

export async function updateUserProfile(input: {
  userId: string;
  name: string;
  email: string;
  avatar?: string;
}) {
  const currentRows = await sql.query(
    `
      select avatar
      from app_users
      where id = $1
      limit 1
    `,
    [input.userId]
  );

  const currentAvatar = currentRows[0]?.avatar as string | undefined;
  const nextAvatar = input.avatar?.trim()
    ? input.avatar.trim()
    : isGeneratedAvatar(currentAvatar)
      ? buildGeneratedAvatar(input.name)
      : buildGeneratedAvatar(input.name);

  const rows = await sql.query(
    `
      update app_users
      set
        name = $2,
        email = $3,
        avatar = $4
      where id = $1
      returning id, name, email, avatar
    `,
    [input.userId, input.name, input.email, nextAvatar]
  );

  const user = rows[0];

  if (!user) {
    throw new Error('User not found.');
  }

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    avatar: user.avatar,
  };
}
