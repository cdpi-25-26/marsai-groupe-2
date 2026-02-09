'use strict';
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.createTable('events', {
			id_event: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: Sequelize.INTEGER
			},
			name: {
				type: Sequelize.STRING(255),
				allowNull: false
			},
			description: {
				type: Sequelize.TEXT,
				allowNull: true
			},
			start_date: {
				type: Sequelize.DATE,
				allowNull: false
			},
			end_date: {
				type: Sequelize.DATE,
				allowNull: false
			},
			location: {
				type: Sequelize.STRING(255),
				allowNull: true
			},
			event_type: {
				type: Sequelize.ENUM('CONFERENCE', 'WORKSHOP', 'MEETUP', 'WEBINAR'),
				allowNull: false
			},
			createdAt: {
				allowNull: false,
				type: Sequelize.DATE,
				defaultValue: Sequelize.fn('NOW')
			},
			updatedAt: {
				allowNull: false,
				type: Sequelize.DATE,
				defaultValue: Sequelize.fn('NOW')
			}
		});
	},
	async down(queryInterface, Sequelize) {
		await queryInterface.dropTable('events');
	}
};
