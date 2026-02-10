'use strict';
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.createTable('users', {
			id_user: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: Sequelize.INTEGER
			},
			first_name: {
				type: Sequelize.STRING(100),
				allowNull: false
			},
			last_name: {
				type: Sequelize.STRING(100),
				allowNull: false
			},
			email: {
				type: Sequelize.STRING(255),
				allowNull: false,
				unique: true
			},
			password: {
				type: Sequelize.STRING(255),
				allowNull: false
			},
			phone: {
				type: Sequelize.STRING(20),
				allowNull: true
			},
			mobile: {
				type: Sequelize.STRING(20),
				allowNull: true
			},
			birth_date: {
				type: Sequelize.DATE,
				allowNull: true
			},
			street: {
				type: Sequelize.STRING(50),
				allowNull: true
			},
			postal_code: {
				type: Sequelize.STRING(10),
				allowNull: true
			},
			city: {
				type: Sequelize.STRING(50),
				allowNull: true
			},
			country: {
				type: Sequelize.STRING(50),
				allowNull: true
			},
			biography: {
				type: Sequelize.STRING(255),
				allowNull: true
			},
			job: {
				type: Sequelize.ENUM(
					'ACTOR',
					'DIRECTOR',
					'PRODUCER',
					'WRITER',
					'OTHER'
				),
				allowNull: true
			},
			portfolio: {
				type: Sequelize.STRING(50),
				allowNull: true
			},
			youtube: {
				type: Sequelize.STRING(50),
				allowNull: true
			},
			instagram: {
				type: Sequelize.STRING(50),
				allowNull: true
			},
			linkedin: {
				type: Sequelize.STRING(50),
				allowNull: true
			},
			facebook: {
				type: Sequelize.STRING(50),
				allowNull: true
			},
			tiktok: {
				type: Sequelize.STRING(50),
				allowNull: true
			},
			known_by_mars_ai: {
				type: Sequelize.ENUM(
					'Par un ami',
					'Vu une publicité du festival',
					"Via le site internet ou application de l'IA"
				),
				allowNull: true
			},
			role: {
				type: Sequelize.ENUM('ADMIN', 'JURY', 'PRODUCER'),
				allowNull: false,
				defaultValue: 'PRODUCER'
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
		await queryInterface.dropTable('users');
	}
};
