const { Op } = require('sequelize');

const pool = require('../models').AppearingPool;
const poolUsage = require('../models').UserPoolUsage;

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

    if (!lastAppearance) {
      throw new Error('There is nothing out here');
    }

    const { modelType, modelId } = lastAppearance;

    try {
      const model = require('../models')[modelType]; // Using square brackets to access the model based on modelType
      const modelInstance = await model.findByPk(modelId);

      return {modelInstance, lastAppearance};
    } catch (error) {
      throw new Error(error.message);
    }

  } catch (err) {
    throw new Error("Its seems that something is wrong: " + err.message);
  }
}

exports.checkPool = async (req, res) => {

  getActualPoolWithModel()
    .then((response) => {

      const { modelInstance } = response;
      return res.status(200).json(modelInstance);
    }).catch((error) => {
      return res.status(500).json(error);
    });
}

exports.executeAction = async (req, res) => {
  try {

    const { useItem, itemExternalId } = req.body;

    const response = await getActualPoolWithModel();
    const { modelInstance, lastAppearance } = response;

    const existingPoolUsage = await poolUsage.findOne({
      where: {
        userId: req.userId,
        appearingPoolId: lastAppearance.id
      }
    });

    if (existingPoolUsage) {
      return res.status(200).json({ message: `You already have your chance, try again next time` });
    }

    var itemAction = null;

    if (useItem) {
      //todo get the item from db
      itemAction = 0.9;
    }

    const message = await modelInstance.executeAction(req.userId, itemAction);

    await poolUsage.create({
      userId: req.userId,
      appearingPoolId: lastAppearance.id
    });

    return res.status(200).json({ message: message });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
