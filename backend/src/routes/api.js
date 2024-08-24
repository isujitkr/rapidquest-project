import express from 'express';
import { getSalesOverTime, getSalesGrowthRate, getCustomerLifetimeValue } from '../controllers/salesController.js';
import { getNewCustomersOverTime, getRepeatCustomers, getGeographicalDistribution } from '../controllers/customersController.js';

const router = express.Router();

// Sales Routes
router.get('/sales-over-time', getSalesOverTime);
router.get('/sales-growth-rate', getSalesGrowthRate);
router.get('/customer-lifetime-value', getCustomerLifetimeValue);

// Customer Routes
router.get('/new-customers-over-time', getNewCustomersOverTime);
router.get('/repeat-customers', getRepeatCustomers);
router.get('/geographical-distribution', getGeographicalDistribution);

export default router;