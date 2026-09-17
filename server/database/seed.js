const bcrypt = require('bcryptjs');
const { initDb, query, getIsMysql } = require('./db');

async function seedDatabase() {
  console.log('🌱 Starting YieldRent Database Migration & Seeding...');
  await initDb();

  const isMysql = getIsMysql();

  // Create tables
  if (isMysql) {
    await query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(150) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        role ENUM('farmer', 'owner', 'admin') NOT NULL DEFAULT 'farmer',
        phone VARCHAR(30) DEFAULT '',
        location VARCHAR(150) DEFAULT 'Maharashtra, India',
        avatar TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    await query(`
      CREATE TABLE IF NOT EXISTS machinery (
        id INT AUTO_INCREMENT PRIMARY KEY,
        owner_id INT NOT NULL,
        title VARCHAR(200) NOT NULL,
        category VARCHAR(100) NOT NULL,
        brand_model VARCHAR(100) NOT NULL,
        hp_power VARCHAR(50) DEFAULT '50 HP',
        fuel_type VARCHAR(50) DEFAULT 'Diesel',
        hourly_rate DECIMAL(10,2) NOT NULL,
        daily_rate DECIMAL(10,2) NOT NULL,
        location VARCHAR(150) NOT NULL,
        latitude DECIMAL(10,6) DEFAULT 18.5204,
        longitude DECIMAL(10,6) DEFAULT 73.8567,
        image_url TEXT,
        description TEXT,
        operational_guidelines TEXT,
        is_available TINYINT(1) DEFAULT 1,
        rating DECIMAL(3,2) DEFAULT 4.80,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    await query(`
      CREATE TABLE IF NOT EXISTS bookings (
        id INT AUTO_INCREMENT PRIMARY KEY,
        machinery_id INT NOT NULL,
        farmer_id INT NOT NULL,
        start_date DATE NOT NULL,
        end_date DATE NOT NULL,
        rental_type ENUM('daily', 'hourly') DEFAULT 'daily',
        duration INT NOT NULL,
        total_amount DECIMAL(10,2) NOT NULL,
        status ENUM('pending', 'confirmed', 'rejected', 'completed', 'cancelled') DEFAULT 'pending',
        farmer_notes TEXT,
        owner_notes TEXT,
        weather_condition_at_booking VARCHAR(100) DEFAULT 'Clear Sky',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (machinery_id) REFERENCES machinery(id) ON DELETE CASCADE,
        FOREIGN KEY (farmer_id) REFERENCES users(id) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    await query(`
      CREATE TABLE IF NOT EXISTS inquiries (
        id INT AUTO_INCREMENT PRIMARY KEY,
        machinery_id INT,
        sender_id INT NOT NULL,
        receiver_id INT NOT NULL,
        message TEXT NOT NULL,
        is_read TINYINT(1) DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (sender_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (receiver_id) REFERENCES users(id) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    await query(`
      CREATE TABLE IF NOT EXISTS reviews (
        id INT AUTO_INCREMENT PRIMARY KEY,
        machinery_id INT NOT NULL,
        farmer_id INT NOT NULL,
        rating INT NOT NULL,
        comment TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (machinery_id) REFERENCES machinery(id) ON DELETE CASCADE,
        FOREIGN KEY (farmer_id) REFERENCES users(id) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    await query(`
      CREATE TABLE IF NOT EXISTS weather_logs (
        id INT AUTO_INCREMENT PRIMARY KEY,
        location VARCHAR(150) NOT NULL,
        temperature DECIMAL(5,2),
        condition_text VARCHAR(100),
        humidity INT,
        wind_speed DECIMAL(5,2),
        advisory TEXT,
        logged_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);
  } else {
    // SQLite Schema
    await query(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL,
        role TEXT NOT NULL DEFAULT 'farmer',
        phone TEXT DEFAULT '',
        location TEXT DEFAULT 'Maharashtra, India',
        avatar TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await query(`
      CREATE TABLE IF NOT EXISTS machinery (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        owner_id INTEGER NOT NULL,
        title TEXT NOT NULL,
        category TEXT NOT NULL,
        brand_model TEXT NOT NULL,
        hp_power TEXT DEFAULT '50 HP',
        fuel_type TEXT DEFAULT 'Diesel',
        hourly_rate REAL NOT NULL,
        daily_rate REAL NOT NULL,
        location TEXT NOT NULL,
        latitude REAL DEFAULT 18.5204,
        longitude REAL DEFAULT 73.8567,
        image_url TEXT,
        description TEXT,
        operational_guidelines TEXT,
        is_available INTEGER DEFAULT 1,
        rating REAL DEFAULT 4.80,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE CASCADE
      );
    `);

    await query(`
      CREATE TABLE IF NOT EXISTS bookings (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        machinery_id INTEGER NOT NULL,
        farmer_id INTEGER NOT NULL,
        start_date TEXT NOT NULL,
        end_date TEXT NOT NULL,
        rental_type TEXT DEFAULT 'daily',
        duration INTEGER NOT NULL,
        total_amount REAL NOT NULL,
        status TEXT DEFAULT 'pending',
        farmer_notes TEXT,
        owner_notes TEXT,
        weather_condition_at_booking TEXT DEFAULT 'Clear Sky',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (machinery_id) REFERENCES machinery(id) ON DELETE CASCADE,
        FOREIGN KEY (farmer_id) REFERENCES users(id) ON DELETE CASCADE
      );
    `);

    await query(`
      CREATE TABLE IF NOT EXISTS inquiries (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        machinery_id INTEGER,
        sender_id INTEGER NOT NULL,
        receiver_id INTEGER NOT NULL,
        message TEXT NOT NULL,
        is_read INTEGER DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (sender_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (receiver_id) REFERENCES users(id) ON DELETE CASCADE
      );
    `);

    await query(`
      CREATE TABLE IF NOT EXISTS reviews (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        machinery_id INTEGER NOT NULL,
        farmer_id INTEGER NOT NULL,
        rating INTEGER NOT NULL,
        comment TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (machinery_id) REFERENCES machinery(id) ON DELETE CASCADE,
        FOREIGN KEY (farmer_id) REFERENCES users(id) ON DELETE CASCADE
      );
    `);

    await query(`
      CREATE TABLE IF NOT EXISTS weather_logs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        location TEXT NOT NULL,
        temperature REAL,
        condition_text TEXT,
        humidity INTEGER,
        wind_speed REAL,
        advisory TEXT,
        logged_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `);
  }

  // Check if users already exist
  const existingUsers = await query('SELECT count(*) as count FROM users');
  const userCount = existingUsers[0].count || existingUsers[0]['count(*)'] || 0;

  if (Number(userCount) === 0) {
    console.log('Inserting seed users...');
    const hashedFarmerPassword = await bcrypt.hash('farmer123', 10);
    const hashedOwnerPassword = await bcrypt.hash('owner123', 10);

    // Users
    await query(`
      INSERT INTO users (name, email, password, role, phone, location, avatar) VALUES
      (?, ?, ?, ?, ?, ?, ?),
      (?, ?, ?, ?, ?, ?, ?),
      (?, ?, ?, ?, ?, ?, ?);
    `, [
      'Ramesh Patil', 'farmer@yieldrent.com', hashedFarmerPassword, 'farmer', '+91 98220 12345', 'Nashik, Maharashtra', 'https://images.unsplash.com/photo-1595273670150-bd0c3c392e46?w=150&auto=format&fit=crop',
      'Vikram Shinde', 'owner@yieldrent.com', hashedOwnerPassword, 'owner', '+91 94220 67890', 'Pune, Maharashtra', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop',
      'Anil Deshmukh', 'anil@yieldrent.com', hashedFarmerPassword, 'farmer', '+91 98901 23456', 'Kolhapur, Maharashtra', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop'
    ]);

    console.log('Inserting seed machinery...');
    // Seed Machinery
    const machineryItems = [
      [
        2, // owner: Vikram
        'John Deere 5310 PowerTech 4WD Tractor',
        'Tractor',
        'John Deere 5310 GearPro',
        '55 HP',
        'Diesel',
        750.00,
        4500.00,
        'Pune, Maharashtra',
        18.5204,
        73.8567,
        'https://images.unsplash.com/photo-1592982537447-7440770cbfc9?w=800&auto=format&fit=crop&q=80',
        'Top-of-the-line 55 HP 4WD heavy-duty tractor equipped with dual clutch, power steering, and oil-immersed brakes. Ideal for deep plowing, heavy subsoiler operations, rotavator tilling, and trolley transport.',
        'Requires valid commercial driving license. Clean fuel tank after full day operations. Max towing capacity: 3.5 tonnes.',
        1,
        4.92
      ],
      [
        2,
        'Mahindra 575 DI Sarpanch Tractor',
        'Tractor',
        'Mahindra 575 DI',
        '45 HP',
        'Diesel',
        600.00,
        3500.00,
        'Nashik, Maharashtra',
        19.9975,
        73.7898,
        'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=800&auto=format&fit=crop&q=80',
        'Highly fuel-efficient 45 HP workhorse. Great for small to medium farms for sowing, harrowing, leveling, and threshing operations.',
        'Operate at recommended 1500-1800 RPM for best fuel economy. Return with full tank or fuel surcharge applies.',
        1,
        4.78
      ],
      [
        2,
        'Kubota DC-68G Multi-Crop Combine Harvester',
        'Harvester',
        'Kubota DC-68G',
        '68 HP',
        'Diesel',
        2200.00,
        15000.00,
        'Kolhapur, Maharashtra',
        16.7050,
        74.2433,
        'https://images.unsplash.com/photo-1589923188900-85dae523342b?w=800&auto=format&fit=crop&q=80',
        'Rubber-crawler paddy & wheat combine harvester with 2-meter cutter bar width. Handles wet and muddy fields effortlessly with minimal grain loss (<1.5%). Comes with expert operator.',
        'Field moisture should be checked before starting. Operator provided with rental package.',
        1,
        4.95
      ],
      [
        2,
        'Shaktiman Regular Light Rotavator (7 Feet)',
        'Rotavator',
        'Shaktiman 7FT L-Type',
        '45-60 HP Compatible',
        'PTO Driven',
        350.00,
        1800.00,
        'Pune, Maharashtra',
        18.5204,
        73.8567,
        'https://images.unsplash.com/photo-1615811361523-6bd03d7748e7?w=800&auto=format&fit=crop&q=80',
        'Boron steel L-type blades ensure perfect soil pulverization and weed removal in a single pass. Ideal for paddy, sugarcane, and cotton soil prep.',
        'Requires 540 RPM PTO tractor connection. Grease nipples every 8 hours of continuous operation.',
        1,
        4.85
      ],
      [
        2,
        'Falcon Boom Sprayer (500L Capacity, 36ft Swath)',
        'Sprayer',
        'Falcon Agrotech 500',
        'Tractor PTO Driven',
        'Chemical / Organic',
        400.00,
        2200.00,
        'Nashik, Maharashtra',
        19.9975,
        73.7898,
        'https://images.unsplash.com/photo-1628352081506-83c43123ed6d?w=800&auto=format&fit=crop&q=80',
        'High-precision hydraulic boom sprayer with anti-drip ceramic nozzles and diaphragm pump. Covers 15 to 20 acres per day with uniform droplet distribution.',
        'Flush tank thoroughly with clean water after each chemical spraying session to prevent nozzle clogging.',
        1,
        4.70
      ],
      [
        2,
        'Landforce Automatic Seed Drill & Fertilizer Spreader (9 Tynes)',
        'Seed Drill',
        'Landforce 9-Tyne',
        '35-50 HP Compatible',
        'Ground Wheel Driven',
        300.00,
        1600.00,
        'Ahmednagar, Maharashtra',
        19.0952,
        74.7496,
        'https://images.unsplash.com/photo-1595974482597-4b8da8879bc5?w=800&auto=format&fit=crop&q=80',
        'Simultaneous seed planting and fertilizer application with adjustable seed metering fluted rollers. Perfect for wheat, soybean, maize, and gram sowing.',
        'Calibrate seed cup openings according to crop seed size before beginning field operations.',
        1,
        4.65
      ]
    ];

    for (const item of machineryItems) {
      await query(`
        INSERT INTO machinery (
          owner_id, title, category, brand_model, hp_power, fuel_type,
          hourly_rate, daily_rate, location, latitude, longitude,
          image_url, description, operational_guidelines, is_available, rating
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, item);
    }

    console.log('Inserting seed bookings...');
    // Seed Bookings
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const dayAfter = new Date(today);
    dayAfter.setDate(dayAfter.getDate() + 2);

    const fmt = (d) => d.toISOString().split('T')[0];

    await query(`
      INSERT INTO bookings (
        machinery_id, farmer_id, start_date, end_date, rental_type, duration, total_amount, status, farmer_notes, weather_condition_at_booking
      ) VALUES
      (1, 1, ?, ?, 'daily', 2, 9000.00, 'confirmed', 'Need tractor for pre-monsoon deep plowing in 5 acre sugarcane field.', 'Clear Sky, 29°C'),
      (3, 1, ?, ?, 'daily', 1, 15000.00, 'pending', 'Paddy harvesting scheduled based on favorable dry weather forecast.', 'Sunny, 31°C');
    `, [fmt(tomorrow), fmt(dayAfter), fmt(dayAfter), fmt(dayAfter)]);

    console.log('Inserting seed inquiries...');
    // Seed Inquiries
    await query(`
      INSERT INTO inquiries (machinery_id, sender_id, receiver_id, message) VALUES
      (1, 1, 2, 'Hello Vikram ji, is the John Deere 5310 available with a trolley attachment as well?'),
      (1, 2, 1, 'Namaste Ramesh ji! Yes, trolley attachment can be provided at Rs. 400 extra per day.');
    `);

    console.log('Inserting seed reviews...');
    // Seed Reviews
    await query(`
      INSERT INTO reviews (machinery_id, farmer_id, rating, comment) VALUES
      (1, 1, 5, 'The John Deere 5310 was in pristine condition. Excellent power for our heavy black soil! Vikram provided quick handover.'),
      (2, 3, 5, 'Great fuel mileage on the Mahindra 575 DI. Finished 4 acres rotavator work without any issue.');
    `);

    console.log('✅ Seed data successfully populated!');
  } else {
    console.log('ℹ️ Database already contains data, skipping seed insertion.');
  }
}

if (require.main === module) {
  seedDatabase()
    .then(() => {
      console.log('Database initialization complete.');
      process.exit(0);
    })
    .catch((err) => {
      console.error('Database migration/seed error:', err);
      process.exit(1);
    });
}

module.exports = { seedDatabase };
