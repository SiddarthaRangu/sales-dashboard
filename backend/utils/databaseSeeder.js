const mongoose = require('mongoose');
const dotenv = require('dotenv');
const { faker } = require('@faker-js/faker');

dotenv.config();

const Customer = require('../models/Customer');
const Product = require('../models/Product');
const Sale = require('../models/Sale');
const AnalyticsReport = require('../models/AnalyticsReport');

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('[Seeder] Database connection established.');

    console.log('[Seeder] Clearing all existing data...');
    await Promise.all([
      Customer.deleteMany(), Product.deleteMany(), Sale.deleteMany(), AnalyticsReport.deleteMany()
    ]);

    // Generate Customers
    const customers = await Customer.insertMany(Array.from({ length: 50 }, () => ({
      name: faker.company.name(),
      type: faker.helpers.arrayElement(['Individual', 'Business', 'Government']),
      region: faker.helpers.arrayElement(['North', 'South', 'East', 'West', 'Central']),
    })));
    console.log(`[Seeder] Created ${customers.length} customer records.`);

    // Generate Products
    const products = await Product.insertMany(Array.from({ length: 100 }, () => ({
      name: faker.commerce.productName(),
      category: faker.helpers.arrayElement(['Electronics', 'Apparel', 'Groceries', 'Books', 'Home Goods']),
      price: parseFloat(faker.commerce.price({ min: 5, max: 3000 })),
    })));
    console.log(`[Seeder] Created ${products.length} product records.`);

    // Generate Sales Records
    const sales = Array.from({ length: 750 }, () => {
      const product = faker.helpers.arrayElement(products);
      const customer = faker.helpers.arrayElement(customers);
      const quantity = faker.number.int({ min: 1, max: 15 });
      return {
        productId: product._id, customerId: customer._id, quantity,
        totalRevenue: quantity * product.price,
        reportDate: faker.date.between({ from: '2022-01-01T00:00:00.000Z', to: new Date() }),
      };
    });
    await Sale.insertMany(sales);
    console.log(`[Seeder] Created ${sales.length} sale records.`);

    console.log('[Seeder] Data seeding process completed successfully!');
  } catch (error) {
    console.error('[Seeder] An error occurred:', error);
  } finally {
    await mongoose.connection.close();
    console.log('[Seeder] Database connection closed.');
  }
};

seedDatabase();