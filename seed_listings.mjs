import pg from 'pg';
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const connectionString = "postgres://postgres.hgkvzlwwisuijygzpmbr:aLv4kR3h82MX9cVp@aws-1-eu-central-1.pooler.supabase.com:5432/postgres?sslmode=require";
const pool = new pg.Pool({ connectionString, ssl: { rejectUnauthorized: false } });

const brandsAndModels = [
  { brand: 'Renault', models: ['Clio', 'Megane', 'Symbol'] },
  { brand: 'Fiat', models: ['Egea', 'Linea', 'Fiorino'] },
  { brand: 'Ford', models: ['Focus', 'Fiesta', 'Courier'] },
  { brand: 'Volkswagen', models: ['Polo', 'Golf', 'Passat'] },
  { brand: 'Toyota', models: ['Corolla', 'Yaris', 'Auris'] },
  { brand: 'Hyundai', models: ['i20', 'Accent Blue', 'Elantra'] }
];

const damageTypes = ['Kazalı', 'Ağır Hasar Kayıtlı', 'Pert', 'Çarpışma Hasarlı', 'Motor Hasarlı', 'Sel Hasarlı'];
const grades = ['A', 'B', 'C', 'D', 'E'];
const fuelTypes = ['benzin', 'dizel', 'lpg', 'elektrik', 'hibrit'];
const transmissions = ['manuel', 'otomatik'];
const cities = ['İstanbul', 'Ankara', 'İzmir', 'Bursa', 'Antalya'];

const images = [
  '/images/cars/car1.png',
  '/images/cars/car2.png',
  '/images/cars/car3.png',
  '/images/cars/car4.png'
];

function getRandomItem(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
function getRandomInt(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }

function generateSlug(title) {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + getRandomInt(1000, 9999);
}

async function seed() {
  try {
    // 1. Get or create a user in auth.users
    let userRes = await pool.query('SELECT id FROM auth.users LIMIT 1');
    let userId;
    if (userRes.rows.length === 0) {
      console.log("No users in auth.users. Creating a dummy user...");
      const insertUser = await pool.query(`
        INSERT INTO auth.users (instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, recovery_sent_at, last_sign_in_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at, confirmation_token, email_change, email_change_token_new, recovery_token)
        VALUES ('00000000-0000-0000-0000-000000000000', gen_random_uuid(), 'authenticated', 'authenticated', 'dummy@dealer.com', '', now(), now(), now(), '{"provider":"email","providers":["email"]}', '{}', now(), now(), '', '', '', '')
        RETURNING id
      `);
      userId = insertUser.rows[0].id;
    } else {
      userId = userRes.rows[0].id;
    }

    // 2. Get or create a dealer
    let dealerRes = await pool.query('SELECT id FROM public.hazaral_dealers WHERE user_id = $1 LIMIT 1', [userId]);
    let dealerId;
    if (dealerRes.rows.length === 0) {
      console.log("Creating dummy dealer for user", userId);
      const insertDealer = await pool.query(`
        INSERT INTO public.hazaral_dealers (user_id, company_name, contact_name, phone, email, city, is_approved, is_verified, subscription_status)
        VALUES ($1, 'Dummy Galeri', 'Ahmet Yılmaz', '05555555555', 'dummy@dealer.com', 'İstanbul', true, true, 'active')
        RETURNING id
      `, [userId]);
      dealerId = insertDealer.rows[0].id;
    } else {
      dealerId = dealerRes.rows[0].id;
    }

    // 3. Insert 20 listings
    console.log("Inserting 20 listings for dealer", dealerId);
    for (let i = 0; i < 20; i++) {
      const bm = getRandomItem(brandsAndModels);
      const model = getRandomItem(bm.models);
      const year = getRandomInt(2010, 2024);
      const damageType = getRandomItem(damageTypes);
      const title = `Sahibinden ${year} ${bm.brand} ${model} - ${damageType}`;
      const slug = generateSlug(title);
      const price = getRandomInt(100, 1500) * 1000;
      const fuel = getRandomItem(fuelTypes);
      const trans = getRandomItem(transmissions);
      const city = getRandomItem(cities);
      const grade = getRandomItem(grades);
      const isFeatured = i < 6; // Make first 6 featured
      const featuredUntil = isFeatured ? new Date(Date.now() + 7*24*60*60*1000).toISOString() : null;

      const numImages = getRandomInt(1, 3);
      const carImages = [];
      for (let j = 0; j < numImages; j++) carImages.push(getRandomItem(images));
      const primaryImage = carImages[0];

      await pool.query(`
        INSERT INTO public.hazaral_listings (
          dealer_id, slug, status, title, brand, model, year, fuel_type, transmission, 
          city, damage_type, damage_grade, asking_price, images, primary_image, is_featured, featured_until
        ) VALUES (
          $1, $2, 'active', $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16
        )
      `, [
        dealerId, slug, title, bm.brand, model, year, fuel, trans, city, 
        [damageType], grade, price, carImages, primaryImage, isFeatured, featuredUntil
      ]);
    }

    console.log("Successfully seeded 20 live listings!");
  } catch (err) {
    console.error("Error seeding listings:", err);
  } finally {
    pool.end();
  }
}

seed();
