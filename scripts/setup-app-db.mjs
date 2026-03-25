import { neon } from '@neondatabase/serverless';

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error('DATABASE_URL is not set');
}

const sql = neon(connectionString);

const organizers = [
  ['org-1', 'LiveSound Productions', 'Premier event organizer specializing in live music experiences', 'https://api.dicebear.com/7.x/initials/svg?seed=LiveSound', true, 24, 4.8],
  ['org-2', 'Urban Events Co.', 'Creating memorable experiences in the heart of the city', 'https://api.dicebear.com/7.x/initials/svg?seed=Urban', true, 18, 4.7],
  ['org-3', 'TechConnect', 'Bringing together tech enthusiasts and innovators', 'https://api.dicebear.com/7.x/initials/svg?seed=TechConnect', true, 32, 4.9],
  ['org-4', 'Culinary Collective', 'Celebrating food, culture, and community', 'https://api.dicebear.com/7.x/initials/svg?seed=Culinary', true, 15, 4.6],
  ['org-5', 'Wellness Warriors', 'Promoting health and mindfulness through events', 'https://api.dicebear.com/7.x/initials/svg?seed=Wellness', true, 12, 4.9],
];

const users = [
  ['user-1', 'Alex Johnson', 'alex.johnson@example.com', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex'],
  ['user-2', 'Sarah Johnson', 'sarah.johnson@example.com', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah'],
  ['user-3', 'Mike Davis', 'mike.davis@example.com', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mike'],
  ['user-4', 'Emma Wilson', 'emma.wilson@example.com', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emma'],
];

const events = [
  ['evt-1', 'Summer Music Festival 2026', 'Join us for an unforgettable evening featuring top artists from around the world. This year\'s lineup includes chart-topping performers across multiple genres. Enjoy food trucks, craft beverages, and an electric atmosphere under the stars.', '2026-07-15', '18:00', 'Central Park Amphitheater', '123 Park Avenue, New York, NY 10001', 75, 5000, 3200, 'Music', 'https://images.unsplash.com/photo-1672841821756-fc04525771c2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb25jZXJ0JTIwY3Jvd2QlMjBtdXNpYyUyMGZlc3RpdmFsfGVufDF8fHx8MTc3NDQwNTEzNHww&ixlib=rb-4.1.0&q=80&w=1080', 'org-1', true, true, 96],
  ['evt-2', 'Jazz Night Live', 'Experience the smooth sounds of contemporary jazz in an intimate setting. Featuring Grammy-nominated artists and a special guest appearance. Includes complimentary wine reception.', '2026-04-20', '20:00', 'Blue Note Jazz Club', '456 Jazz Street, New York, NY 10012', 45, 300, 285, 'Music', 'https://images.unsplash.com/photo-1757439160077-dd5d62a4d851?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxqYXp6JTIwbGl2ZSUyMHBlcmZvcm1hbmNlfGVufDF8fHx8MTc3NDQwNTEzNHww&ixlib=rb-4.1.0&q=80&w=1080', 'org-1', false, true, 94],
  ['evt-3', 'Tech Summit 2026', 'The premier technology conference featuring keynotes from industry leaders, hands-on workshops, and networking opportunities. Topics include AI, blockchain, and the future of tech.', '2026-05-10', '09:00', 'Convention Center', '789 Tech Plaza, San Francisco, CA 94102', 299, 2000, 1650, 'Tech', 'https://images.unsplash.com/photo-1582192904915-d89c7250b235?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0ZWNoJTIwY29uZmVyZW5jZSUyMHByZXNlbnRhdGlvbnxlbnwxfHx8fDE3NzQzNTI5MDB8MA&ixlib=rb-4.1.0&q=80&w=1080', 'org-3', true, true, 98],
  ['evt-4', 'Street Food Festival', 'Explore flavors from around the world at our annual street food festival. Over 50 vendors, live cooking demonstrations, and entertainment for the whole family.', '2026-06-05', '11:00', 'Waterfront Park', '321 Harbor Drive, Seattle, WA 98101', 25, 3000, 2100, 'Food & Drink', 'https://images.unsplash.com/photo-1551883709-2516220df0bc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmb29kJTIwZmVzdGl2YWwlMjBvdXRkb29yfGVufDF8fHx8MTc3NDM3MTAxMXww&ixlib=rb-4.1.0&q=80&w=1080', 'org-4', true, true, 92],
  ['evt-5', 'Modern Art Exhibition Opening', 'Be among the first to experience our latest exhibition featuring contemporary artists pushing the boundaries of visual expression. Includes guided tours and artist meet-and-greet.', '2026-04-25', '18:30', 'City Museum of Art', '555 Museum Row, Chicago, IL 60601', 35, 500, 420, 'Arts', 'https://images.unsplash.com/photo-1713779490284-a81ff6a8ffae?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhcnQlMjBnYWxsZXJ5JTIwZXhoaWJpdGlvbnxlbnwxfHx8fDE3NzQ0MDUxMzV8MA&ixlib=rb-4.1.0&q=80&w=1080', 'org-2', false, true, 95],
  ['evt-6', 'Mindfulness & Yoga Retreat', 'A transformative weekend retreat focused on mindfulness, yoga, and holistic wellness. Includes accommodations, organic meals, and guided meditation sessions.', '2026-05-15', '10:00', 'Serenity Wellness Center', '777 Peace Lane, Boulder, CO 80301', 450, 50, 38, 'Wellness', 'https://images.unsplash.com/photo-1767452985665-fb3a6c9f4009?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx5b2dhJTIwd2VsbG5lc3MlMjByZXRyZWF0fGVufDF8fHx8MTc3NDM0NzQwM3ww&ixlib=rb-4.1.0&q=80&w=1080', 'org-5', false, true, 97],
  ['evt-7', 'NBA Championship Finals Watch Party', 'Join fellow basketball fans for an electrifying watch party experience. Multiple screens, food and drink specials, and prizes throughout the game.', '2026-06-18', '19:00', 'Sports Arena Plaza', '888 Arena Boulevard, Los Angeles, CA 90015', 30, 800, 645, 'Sports', 'https://images.unsplash.com/photo-1593202459074-6da90623cbe0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiYXNrZXRiYWxsJTIwc3BvcnRzJTIwZ2FtZXxlbnwxfHx8fDE3NzQ0MDUxMzZ8MA&ixlib=rb-4.1.0&q=80&w=1080', 'org-2', true, true, 91],
  ['evt-8', 'Business Leaders Networking Gala', 'Connect with industry leaders, innovators, and decision-makers at our exclusive networking gala. Formal attire. Includes three-course dinner and open bar.', '2026-04-30', '19:30', 'Grand Ballroom Hotel', '999 Executive Drive, Boston, MA 02101', 175, 300, 245, 'Business', 'https://images.unsplash.com/photo-1675716921224-e087a0cca69a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXNpbmVzcyUyMG5ldHdvcmtpbmclMjBldmVudHxlbnwxfHx8fDE3NzQzMDEzNTF8MA&ixlib=rb-4.1.0&q=80&w=1080', 'org-3', false, true, 93],
  ['evt-9', 'Electronic Dance Night', 'The biggest EDM event of the year featuring world-renowned DJs. State-of-the-art sound and lighting. 21+ only.', '2026-08-20', '22:00', 'Warehouse District Club', '111 Dance Floor Ave, Miami, FL 33101', 65, 1500, 1200, 'Music', 'https://images.unsplash.com/photo-1692176548571-86138128e36c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbGVjdHJvbmljJTIwbXVzaWMlMjBkanxlbnwxfHx8fDE3NzQ0MDM0MjN8MA&ixlib=rb-4.1.0&q=80&w=1080', 'org-1', true, true, 89],
  ['evt-10', 'Comedy Night Spectacular', 'An evening of laughter featuring stand-up comedy from rising stars and established performers. Two-drink minimum.', '2026-05-08', '20:00', 'Laugh Factory', '222 Comedy Lane, Austin, TX 78701', 40, 250, 180, 'Arts', 'https://images.unsplash.com/photo-1769761341012-526493327ac7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb21lZHklMjBzaG93JTIwdGhlYXRlcnxlbnwxfHx8fDE3NzQzODYyMDh8MA&ixlib=rb-4.1.0&q=80&w=1080', 'org-2', false, true, 90],
  ['evt-11', 'Wine Tasting Experience', 'Sample premium wines from renowned vineyards. Expert sommeliers will guide you through each tasting. Light appetizers included.', '2026-04-28', '17:00', 'The Vineyard Loft', '333 Wine Country Road, Napa, CA 94558', 85, 100, 72, 'Food & Drink', 'https://images.unsplash.com/photo-1762455129210-c886b9295056?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3aW5lJTIwdGFzdGluZyUyMGV2ZW50fGVufDF8fHx8MTc3NDM0NzQwM3ww&ixlib=rb-4.1.0&q=80&w=1080', 'org-4', false, true, 94],
  ['evt-12', 'Startup Pitch Competition', 'Watch innovative startups compete for funding. Network with investors, entrepreneurs, and industry experts. Cash prizes for winners.', '2026-05-22', '14:00', 'Innovation Hub', '444 Startup Street, San Francisco, CA 94103', 50, 400, 325, 'Business', 'https://images.unsplash.com/photo-1620206299258-ac415ce0f7d3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdGFydHVwJTIwcGl0Y2glMjBjb21wZXRpdGlvbnxlbnwxfHx8fDE3NzQzNDc3MjJ8MA&ixlib=rb-4.1.0&q=80&w=1080', 'org-3', false, true, 96],
];

const tickets = [
  ['tkt-1', 'evt-1', 'user-1', '2026-03-10', 'QR123456789', 'upcoming', 75],
  ['tkt-2', 'evt-3', 'user-1', '2026-03-15', 'QR987654321', 'upcoming', 299],
  ['tkt-3', 'evt-2', 'user-1', '2026-02-20', 'QR456789123', 'used', 45],
  ['tkt-4', 'evt-4', 'user-2', '2026-03-12', 'QR321654987', 'upcoming', 25],
  ['tkt-5', 'evt-7', 'user-3', '2026-03-14', 'QR654987321', 'upcoming', 30],
  ['tkt-6', 'evt-8', 'user-4', '2026-03-16', 'QR852456159', 'upcoming', 175],
];

const savedEvents = [
  ['user-1', 'evt-1'],
  ['user-1', 'evt-3'],
  ['user-1', 'evt-6'],
];

await sql.query(`
  create table if not exists app_users (
    id text primary key,
    name text not null,
    email text not null unique,
    avatar text not null
  )
`);

await sql.query(`
  create table if not exists organizers (
    id text primary key,
    name text not null,
    bio text not null,
    avatar text not null,
    is_verified boolean not null default false,
    events_hosted integer not null default 0,
    rating numeric(3, 1) not null default 0
  )
`);

await sql.query(`
  create table if not exists events (
    id text primary key,
    title text not null,
    description text not null,
    event_date date not null,
    event_time text not null,
    location text not null,
    address text not null,
    price numeric(10, 2) not null,
    capacity integer not null,
    tickets_sold integer not null default 0,
    category text not null,
    image_url text not null,
    organizer_id text not null references organizers(id) on delete cascade,
    is_trending boolean not null default false,
    is_verified boolean not null default false,
    trust_score integer
  )
`);

await sql.query(`
  create table if not exists tickets (
    id text primary key,
    event_id text not null references events(id) on delete cascade,
    user_id text not null references app_users(id) on delete cascade,
    purchase_date date not null,
    qr_code text not null,
    status text not null,
    price numeric(10, 2) not null
  )
`);

await sql.query(`
  create table if not exists saved_events (
    user_id text not null references app_users(id) on delete cascade,
    event_id text not null references events(id) on delete cascade,
    primary key (user_id, event_id)
  )
`);

for (const row of organizers) {
  await sql.query(
    `
      insert into organizers (id, name, bio, avatar, is_verified, events_hosted, rating)
      values ($1, $2, $3, $4, $5, $6, $7)
      on conflict (id) do update
      set name = excluded.name,
          bio = excluded.bio,
          avatar = excluded.avatar,
          is_verified = excluded.is_verified,
          events_hosted = excluded.events_hosted,
          rating = excluded.rating
    `,
    row
  );
}

for (const row of users) {
  await sql.query(
    `
      insert into app_users (id, name, email, avatar)
      values ($1, $2, $3, $4)
      on conflict (id) do update
      set name = excluded.name,
          email = excluded.email,
          avatar = excluded.avatar
    `,
    row
  );
}

for (const row of events) {
  await sql.query(
    `
      insert into events (
        id, title, description, event_date, event_time, location, address, price,
        capacity, tickets_sold, category, image_url, organizer_id, is_trending, is_verified, trust_score
      )
      values ($1, $2, $3, $4::date, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)
      on conflict (id) do update
      set title = excluded.title,
          description = excluded.description,
          event_date = excluded.event_date,
          event_time = excluded.event_time,
          location = excluded.location,
          address = excluded.address,
          price = excluded.price,
          capacity = excluded.capacity,
          tickets_sold = excluded.tickets_sold,
          category = excluded.category,
          image_url = excluded.image_url,
          organizer_id = excluded.organizer_id,
          is_trending = excluded.is_trending,
          is_verified = excluded.is_verified,
          trust_score = excluded.trust_score
    `,
    row
  );
}

for (const row of tickets) {
  await sql.query(
    `
      insert into tickets (id, event_id, user_id, purchase_date, qr_code, status, price)
      values ($1, $2, $3, $4::date, $5, $6, $7)
      on conflict (id) do update
      set event_id = excluded.event_id,
          user_id = excluded.user_id,
          purchase_date = excluded.purchase_date,
          qr_code = excluded.qr_code,
          status = excluded.status,
          price = excluded.price
    `,
    row
  );
}

for (const row of savedEvents) {
  await sql.query(
    `
      insert into saved_events (user_id, event_id)
      values ($1, $2)
      on conflict (user_id, event_id) do nothing
    `,
    row
  );
}

await sql.query(`
  update organizers o
  set events_hosted = sub.event_count
  from (
    select organizer_id, count(*)::int as event_count
    from events
    group by organizer_id
  ) sub
  where sub.organizer_id = o.id
`);

console.log('App tables created and seeded successfully.');
