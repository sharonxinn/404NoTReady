const HealthMetric = require('../models/HealthMetric');

exports.createMetric = async (req, res) => {
  try {
    const { userId, weight, height } = req.body;

    const metric = new HealthMetric({
      userId,
      weight,
      height,
      recordedAt: new Date()
    });

    await metric.save();

    // Use translated message
    res.status(201).json({ message: res.__('health.metric_saved') });

  } catch (err) {
    res.status(500).json({ error: res.__('health.error_saving') });
  }
};
