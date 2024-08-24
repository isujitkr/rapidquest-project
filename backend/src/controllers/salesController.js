import mongoose from 'mongoose';

const db = mongoose.connection;

// Controller to get sales over time
export const getSalesOverTime = async (req, res) => {
  try {
    const { timeFrame } = req.query;

    if (!['daily', 'monthly', 'quarterly', 'yearly'].includes(timeFrame)) {
      return res.status(400).json({ message: 'Invalid time frame' });
    }

    let groupFormat;

    switch (timeFrame) {
      case 'daily':
        groupFormat = {
          date: {
            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" }
          }
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
          quarter: {
            $ceil: { $divide: [{ $month: "$createdAt" }, 3] }
          }
        };
        break;
      case 'yearly':
        groupFormat = {
          year: { $year: "$createdAt" }
        };
        break;
      default:
        throw new Error('Invalid time frame');
    }

    const shopifyOrders = db.collection('shopifyOrders');

    const salesData = await shopifyOrders.aggregate([
      {
        $addFields: {
          createdAt: { $dateFromString: { dateString: "$created_at" } },
          totalPrice: { $toDouble: "$total_price_set.shop_money.amount" }
        }
      },
      {
        $group: {
          _id: groupFormat,
          totalSales: { $sum: "$totalPrice" }
        }
      },
      {
        $sort: { "_id": 1 }
      }
    ]).toArray();

    return res.status(200).json(salesData);
  } catch (error) {
    console.error(`Error fetching total sales over time:`, error);
    return res.status(500).json({ message: 'Server error' });
  }
};


// Controller to get sales growth rate over time
export const getSalesGrowthRate = async (req, res) => {
  try {
      const salesData = await db.collection('shopifyOrders').aggregate([
          {
              $group: {
                  _id: {
                      year: { $year: { $dateFromString: { dateString: "$created_at" } } },
                      month: { $month: { $dateFromString: { dateString: "$created_at" } } }
                  },
                  totalSales: { $sum: { $toDouble: "$total_price" } }
              }
          },
          {
              $sort: { "_id.year": 1, "_id.month": 1 }
          }
      ]).toArray();

      const growthRates = salesData.reduce((acc, curr, index, array) => {
          if (index > 0) {
              const previous = array[index - 1].totalSales;
              const current = curr.totalSales;
              const growthRate = ((current - previous) / previous) * 100; 
              acc.push({
                  period: `${curr._id.year}-${String(curr._id.month).padStart(2, '0')}`,
                  totalSales: current,
                  growthRate: growthRate.toFixed(2)
              });
          }
          return acc;
      }, []);

      return res.status(200).json(growthRates);
  } catch (error) {
      console.error(`Error fetching sales growth rate:`, error);
      return res.status(500).json({ message: 'Server error' });
  }
};

// Controller to get customer lifetime value by cohort
export const getCustomerLifetimeValue = async (req, res) => {
  try {
    const firstPurchaseData = await db.collection('shopifyOrders').aggregate([
      {
        $group: {
          _id: "$customer.id",
          firstPurchaseDate: { $min: { $dateFromString: { dateString: "$created_at" } } },
          totalRevenue: { $sum: { $toDouble: "$total_price" } }
        }
      }
    ]).toArray();

    const firstPurchaseMap = firstPurchaseData.reduce((map, entry) => {
      map[entry._id] = entry;
      return map;
    }, {});

    const cohortData = await db.collection('shopifyCustomers').aggregate([
      {
        $lookup: {
          from: 'shopifyOrders',
          localField: '_id',
          foreignField: 'customer.id', 
          as: 'shopifyOrders'
        }
      },
      {
        $unwind: {
          path: '$shopifyOrders',
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $addFields: {
          firstPurchaseMonth: {
            $dateToString: {
              format: "%Y-%m",
              date: {
                $ifNull: [
                  { $dateFromString: { dateString: "$shopifyOrders.created_at" } },
                  { $dateFromString: { dateString: "$updated_at" } }
                ]
              }
            }
          }
        }
      },
      {
        $group: {
          _id: "$firstPurchaseMonth",
          totalLifetimeValue: {
            $sum: {
              $toDouble: "$shopifyOrders.total_price"
            }
          }
        }
      }
    ]).toArray();

    return res.status(200).json(cohortData);
  } catch (error) {
    console.error(`Error fetching customer lifetime value by cohorts:`, error);
    return res.status(500).json({ message: 'Server error' });
  }
};



