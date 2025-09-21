# MERN Sales Analytics Dashboard – Technical Documentation

**Prepared for:** Shanture Fresher Hiring Challenge  

This guide explains the backend architecture, database model, and analytics workflow of the **Sales Analytics Dashboard** project.

---

## 1️⃣ Database Schema Overview

The backend uses **MongoDB**, a flexible document database, to manage customer, product, and sales information efficiently. The database, named `sales-dashboard`, has four main collections.

### 1.1 `customers`
Holds customer profiles separate from transactional data, making updates simpler without touching historical sales records.

**Schema (models/Customer.js):**

```javascript
const customerSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  region: { type: String, required: true, enum: ['North', 'South', 'East', 'West', 'Central'] },
  type: { type: String, required: true, enum: ['Individual', 'Business', 'Government'] }
}, { timestamps: true });
```

**Field Notes:**
- **name**: Customer or company name.
- **region**: Location for regional reporting.
- **type**: Customer segment (e.g., business or individual).
- **timestamps**: Auto-generated `createdAt` / `updatedAt` values.

---

### 1.2 `products`
Stores catalog information, helping keep sales records lightweight.

**Schema (models/Product.js):**

```javascript
const productSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  category: { type: String, required: true, enum: ['Electronics', 'Apparel', 'Groceries', 'Books', 'Home Goods'] },
  price: { type: Number, required: true, min: 0 }
}, { timestamps: true });
```

**Field Notes:**
- **name**: Product title.
- **category**: Classification used for category-level metrics.
- **price**: Selling price per unit.

---

### 1.3 `sales`
Logs every order and links it to customer and product data.

**Schema (models/Sale.js):**

```javascript
const saleSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true },
  quantity: { type: Number, required: true, min: 1 },
  totalRevenue: { type: Number, required: true, min: 0 },
  reportDate: { type: Date, required: true, index: true }
}, { timestamps: true });
```

**Field Notes:**
- **productId**: Points to an item in the `products` collection.
- **customerId**: Links to a record in `customers`.
- **quantity**: Items sold.
- **totalRevenue**: `quantity × price` for that sale.
- **reportDate**: Timestamp for filtering by date.

---

### 1.4 `analyticsreports`
Captures pre-calculated report data for selected date ranges, avoiding repetitive computations for historical queries.

**Schema (models/AnalyticsReport.js):**

```javascript
const analyticsReportSchema = new mongoose.Schema({
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  generatedAt: { type: Date, default: Date.now },
  metrics: {
    totalRevenue: { type: Number, default: 0 },
    avgOrderValue: { type: Number, default: 0 },
    totalSales: { type: Number, default: 0 },
    topSellingProducts: [{ name: String, totalQuantity: Number, _id: false }],
    salesByRegion: [{ region: String, totalRevenue: Number, _id: false }]
  }
}, { timestamps: true });
```

**Field Notes:**
- **startDate / endDate**: Time span for the report.
- **generatedAt**: Creation date.
- **metrics**: Contains KPIs, product rankings, and revenue by region.

---

## 2️⃣ Aggregation Pipelines

The main analytics live in `controllers/analyticsController.js` and run when a user requests `POST /api/reports`. All pipelines start with `$match` to filter by `reportDate` using an index for speed.

### 2.1 KPI Pipeline
Computes overall revenue, total sales, and average order value.

```javascript
Sale.aggregate([
  { $match: { reportDate: { $gte: new Date(startDate), $lte: new Date(endDate) } } },
  { $group: {
      _id: null,
      totalRevenue: { $sum: '$totalRevenue' },
      totalSales: { $sum: 1 }
  }},
  { $project: {
      _id: 0,
      totalRevenue: 1,
      totalSales: 1,
      avgOrderValue: {
        $cond: [
          { $eq: ['$totalSales', 0] },
          0,
          { $divide: ['$totalRevenue', '$totalSales'] }
        ]
      }
  }}
]);
```

**Stages:**
- `$match`: Selects sales in the date range.
- `$group`: Totals revenue and counts sales.
- `$project`: Formats output and prevents division by zero.

---

### 2.2 Top Products Pipeline
Finds the five most-sold products.

```javascript
Sale.aggregate([
  { $match: { reportDate: { $gte: new Date(startDate), $lte: new Date(endDate) } } },
  { $group: { _id: '$productId', totalQuantity: { $sum: '$quantity' } } },
  { $sort: { totalQuantity: -1 } },
  { $limit: 5 },
  { $lookup: { from: 'products', localField: '_id', foreignField: '_id', as: 'productInfo' } },
  { $unwind: '$productInfo' },
  { $project: { _id: 0, name: '$productInfo.name', totalQuantity: 1 } }
]);
```

**Stages:**
- `$group`: Totals quantity by product.
- `$sort` & `$limit`: Picks top performers.
- `$lookup` & `$unwind`: Enriches with product names.
- `$project`: Returns only required fields.

---

### 2.3 Revenue by Region Pipeline
Shows revenue split across regions.

```javascript
Sale.aggregate([
  { $match: { reportDate: { $gte: new Date(startDate), $lte: new Date(endDate) } } },
  { $lookup: { from: 'customers', localField: 'customerId', foreignField: '_id', as: 'customerInfo' } },
  { $unwind: '$customerInfo' },
  { $group: { _id: '$customerInfo.region', totalRevenue: { $sum: '$totalRevenue' } } },
  { $sort: { totalRevenue: -1 } },
  { $project: { _id: 0, region: '$_id', totalRevenue: 1 } }
]);
```

**Stages:**
- `$lookup`: Joins with customer info.
- `$unwind`: Extracts region field.
- `$group`: Totals revenue per region.
- `$sort` & `$project`: Orders and cleans the result.

---

### ✅ Summary

This design supports:
- Optimized queries via indexes.
- Snapshot-based analytics to save compute.
- Modular pipelines for KPIs, products, and regional trends.
