const { Op } = require('sequelize');

const pool = require('../models').AppearingPool;

exports.setPool = async (modelType, modelId, endurance) => {

  const now = new Date();
  const twoMinutesFromNow = new Date(now.getTime() + 2 * 60 * 1000);

  try {
      return await pool.create({
        modelId: modelId,
        modelType: modelType,
        endurance: endurance,
        untilDate: twoMinutesFromNow,
      });
    } catch (error) {
      throw new Error('Error adding appearance to the pool');
    }
}

async function getActualPool() {

  const now = new Date();

  try {

    const lastAppearance = await pool.findOne({
      where: {
        untilDate: {
          [Op.gt]: now
        }
      },
      order: [['id', 'DESC']]
    });

    return lastAppearance;

  } catch (err) {
    return null;
  }
}

async function getActualPoolWithModel() {
  try {
    const lastAppearance = await getActualPool();

    if (lastAppearance) {
      const { modelType, modelId } = lastAppearance;

      try {
        const model = require('../models')[modelType]; // Using square brackets to access the model based on modelType
        const modelInstance = await model.findByPk(modelId);
        return modelInstance;
      } catch (error) {
        console.error('Error fetching model:', error.message);
        return null;
      }
    } else {
      return null;
    }
  } catch (err) {
    console.error('Error fetching actual pool with model:', err.message);
    return null;
  }
}

exports.checkPool = async (req, res) => {

  getActualPoolWithModel()
    .then((appearance) => {

      if (appearance) {
        return res.status(200).json(appearance);
      } else {
        return res.status(404).json({message: "I guess is nothing out here"});
      }
    }).catch((error) => {
      return res.status(500).json(error);
    });

  return res.status();
}