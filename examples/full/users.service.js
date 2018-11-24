"use strict";

const _ = require("lodash");

const users = [
	{ id: 1, name: "Genaro Krueger", birthday: new Date('1975-12-17') },
	{ id: 2, name: "Nicholas Paris", birthday: new Date('1981-01-27') },
	{ id: 3, name: "Quinton Loden", birthday: new Date('1995-03-22') },
	{ id: 4, name: "Bradford Knauer", birthday: new Date('2008-11-01') },
	{ id: 5, name: "Damien Accetta", birthday: new Date('1959-08-07') },
]

module.exports = {
	name: "users",
	settings: {
		graphql: {
			type: `
				type User {
					id: Int!,
					name: String!,
					birthday: Date,
					posts(limit: Int): [Post]
				}
			`,
			resolvers: {
				User: {
					posts: {
						action: "posts.findByUser",
						rootParams: {
							"id": "userID"
						}
					}
				}
			}			
		}
	},
	actions: {
		find: {
			//cache: true,
			params: {
				limit: { type: "number", optional: true }
			},
			graphql: {
				query: "users(limit: Int): [User]"
			},
			handler(ctx) {
				let result = _.cloneDeep(users);
				if (ctx.params.limit)
					result = users.slice(0, ctx.params.limit);
				else
					result = users;

				return _.cloneDeep(result);
			}
		},

		resolve: {
			params: {
				id: [
					{ type: "number" },
					{ type: "array", items: "number" }
				]
			},
			handler(ctx) {
				if (Array.isArray(ctx.params.id)) {
					return ctx.params.id.map(id => this.findByID(id));
				} else {
					return this.findByID(ctx.params.id);
				}
			}
		}
	},

	methods: {
		findByID(id) {
			return _.cloneDeep(users.find(user => user.id == id));
		}
	}
};
