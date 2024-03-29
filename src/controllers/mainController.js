const fs = require('fs');
const path = require('path');

const productsFilePath = path.join(__dirname, '../data/productsDataBase.json');
const products = JSON.parse(fs.readFileSync(productsFilePath, 'utf-8'));

const toThousand = n => n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");

const controller = {
	index: (req, res) => {
		const productVisited = products.filter(product => product.category == "visited");
		const productWithDiscount = products.filter(product => product.discount > 0);
		res.render("index",{productVisited,productWithDiscount})
	},
	search: (req, res) => {
		// Do the magic
	},
};

module.exports = controller;
