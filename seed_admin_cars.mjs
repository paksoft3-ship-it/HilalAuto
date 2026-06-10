import pg from 'pg';
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const connectionString = "postgres://postgres.hgkvzlwwisuijygzpmbr:aLv4kR3h82MX9cVp@aws-1-eu-central-1.pooler.supabase.com:5432/postgres?sslmode=require";

const pool = new pg.Pool({ 
  connectionString,
  ssl: { rejectUnauthorized: false }
});

const brandsAndModels = [
  { brand: 'Renault', models: ['Clio', 'Megane', 'Symbol'] },
  { brand: 'Fiat', models: ['Egea', 'Linea', 'Fiorino'] },
  { brand: 'Ford', models: ['Focus', 'Fiesta', 'Courier'] },
  { brand: 'Volkswagen', models: ['Polo', 'Golf', 'Passat'] },
  { brand: 'Toyota', models: ['Corolla', 'Yaris', 'Auris'] },
  { brand: 'Hyundai', models: ['i20', 'Accent Blue', 'Elantra'] }
];

const damageTypes = [
  'Kazalı', 'Ağır Hasar Kayıtlı', 'Pert', 'Çarpışma Hasarlı', 'Motor Hasarlı', 'Sel Hasarlı'
];

const images = [
  '/images/cars/car1.png',
  '/images/cars/car2.png',
  '/images/cars/car3.png',
  '/images/cars/car4.png'
];

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomItem(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

async function seed() {
  try {
    for (let i = 1; i <= 20; i++) {
      const bm = getRandomItem(brandsAndModels);
      const model = getRandomItem(bm.models);
      const year = getRandomInt(2010, 2024);
      const damageType = getRandomItem(damageTypes);
      const title = `Sahibinden ${year} ${bm.brand} ${model} - ${damageType}`;
      const price = getRandomInt(100, 1500) * 1000;
      
      const numImages = getRandomInt(1, 3);
      const carImages = [];
      for (let j = 0; j < numImages; j++) {
        carImages.push(getRandomItem(images));
      }

      const description = `Acil satılık ${bm.brand} ${model}. ${damageType} durumunda. Araç fotoğraflarda göründüğü gibidir.`;

      const sql = `
        INSERT INTO public.hazaral_cars (
          title, brand, model, model_year, damage_type, price, description, images, status
        ) VALUES (
          $1, $2, $3, $4, $5, $6, $7, $8, 'available'
        )
      `;
      
      const values = [
        title, bm.brand, model, year, damageType, price, description, carImages
      ];
      
      await pool.query(sql, values);
      console.log(`Inserted: ${title}`);
    }
    console.log("Successfully seeded 20 dummy cars.");
  } catch (err) {
    console.error("Error seeding cars:", err);
  } finally {
    pool.end();
  }
}

seed();
