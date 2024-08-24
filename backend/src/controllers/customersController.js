import mongoose from 'mongoose';

const db = mongoose.connection;

// Controller to get new customers over time
export const getNewCustomersOverTime = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return res.status(400).json({ message: 'Invalid date format' });
    }

    const shopifyCustomer = db.collection('shopifyCustomers');

    const newCustomers = await shopifyCustomer.aggregate([
      {
        $match: {
          created_at: {
            $gte: start.toISOString(),
            $lte: end.toISOString()
          }
        }
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: { $toDate: "$created_at" } } },
          newCustomers: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } } 
    ]).toArray();

    res.json(newCustomers);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Controller to get repeat customers
export const getRepeatCustomers = async (req, res) => {
  try {
      const { timeFrame } = req.query;

      if (!['daily', 'monthly', 'quarterly', 'yearly'].includes(timeFrame)) {
          return res.status(400).json({ message: 'Invalid time frame' });
      }

      let groupFormat;
      switch (timeFrame) {
        case 'daily':
          groupFormat = {
              year: { $year: "$createdAt" },
              month: { $month: "$createdAt" },
              day: { $dayOfMonth: "$createdAt" }
          };
          break;
        case 'monthly':
          groupFormat = {
              year: { $year: "$createdAt" },
              month: { $month: "$createdAt" }
          };
          break;
        case 'quarterly':
          groupFormat = {
              year: { $year: "$createdAt" },
              quarter: { $ceil: { $divide: [{ $month: "$createdAt" }, 3] } }
          };
          break;
        case 'yearly':
          groupFormat = { year: { $year: "$createdAt" } };
          break;
        default:
          throw new Error('Invalid time frame');
      };

      const shopifyOrders = db.collection('shopifyOrders');

      const repeatCustomers = await shopifyOrders.aggregate([
        {
            $addFields: {
                createdAt: { $dateFromString: { dateString: "$created_at" } }
            }
        },
        {
            $group: {
                _id: {
                    customerEmail: "$customer.email", 
                    ...groupFormat 
                },
                count: { $sum: 1 } 
            }
        },
        {
            $match: {
                count: { $gt: 1 } 
            }
        },
        {
            $group: {
                _id: "$_id.customerEmail", 
                totalOrders: { $sum: "$count" }
            }
        }
    ]).toArray();

      return res.status(200).json(repeatCustomers);
  } catch (error) {
      console.error(`Error fetching repeat customers:`, error);
      return res.status(500).json({ message: 'Server error' });
  }
};

// Controller to get geographical distribution of customers
export const getGeographicalDistribution = async (req, res) => {
  try {
    const shopifyCustomers = db.collection('shopifyCustomers');

    const geoData = await shopifyCustomers.aggregate([
      {
        $match: {
            "default_address.city": { $ne: null }
        }
      },
      {
        $group: {
          _id: '$default_address.city',
          customerCount: { $sum: 1 }
        }
      },
      {
        $sort: { customerCount: -1 }
      }
    ]).toArray();

    return res.status(200).json(geoData);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch geographical distribution data' });
  }
};
