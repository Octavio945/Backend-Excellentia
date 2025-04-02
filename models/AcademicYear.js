const { DataTypes, Op } = require('sequelize');
const sequelize = require('../config/db');

const AcademicYear = sequelize.define('AcademicYear', {
  start_date: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  end_date: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  is_active: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  }
}, {
  timestamps: true,
  hooks: {
    beforeCreate: async (academicYear, options) => {
      const overlappingAcademicYear = await AcademicYear.findOne({
        where: {
          [Op.or]: [
            {
              start_date: { [Op.lt]: academicYear.end_date },
              end_date: { [Op.gt]: academicYear.start_date },
            },
          ],
        },
      });
      
      if (overlappingAcademicYear) {
        throw new Error('Les années académiques se chevauchent !');
      }
    },
    beforeUpdate: async (academicYear, options) => {
      const overlappingAcademicYear = await AcademicYear.findOne({
        where: {
          [Op.or]: [
            {
              start_date: { [Op.lt]: academicYear.end_date },
              end_date: { [Op.gt]: academicYear.start_date },
            },
          ],
          id: { [Op.ne]: academicYear.id },
        },
      });
      
      if (overlappingAcademicYear) {
        throw new Error('Les années académiques se chevauchent !');
      }
    },
  },
});

module.exports = AcademicYear;