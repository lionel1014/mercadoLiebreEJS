const fs = require('fs');
const path = require('path');

const productsFilePath = path.join(__dirname, '../data/productsDataBase.json');
const products = JSON.parse(fs.readFileSync(productsFilePath, 'utf-8'));

const toThousand = n => n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");

const findProductbyId = ({params}) => {
	const product = products.find(product => product.id == params.id);
	return product;
}

const error404 = ({req,res}, message = "Producto no encontrado") => {
	const error = {
		status: 404,
		stack: message,
	};

	res.status(404).render("error", {
		message: "Producto no encontrado",
		path: req.originalUrl,
		error,
	});
}

const controller = {
	// Root - Show all products
	index: (req, res) => {
		res.render("products",{products})
	},

	// Detail - Detail from one product
	detail: (req, res) => {
		const product = findProductbyId(req)

		if(product){
			res.render("detail",{product})
		}else{
			error404({req,res});
		}
	},

	// Create - Form to create
	create: (req, res) => {
		res.render("product-create-form")
	},
	
	// Create -  Method to store
	store: (req, res) => {
		const { name, price, discount, category, description} = req.body;

		const newProduct = {
			id: products.length + 1,
			name,
			price,
			discount,
			category,
			description,
			image: 'default-image-png'
		};
		products.push(newProduct);

		// Guardar el array actualizado en el archivo
		fs.writeFileSync(productsFilePath, JSON.stringify(products, null, 2), 'utf-8');

		res.redirect(`/products/${newProduct.id}`);
	},

	// Update - Form to edit
	edit: (req, res) => {
		const product = findProductbyId(req);
		if(product){
			res.render("product-edit-form",{product})
		}else{
			error404({req,res});
		}
	},

	// Update - Method to update
	update: (req, res) => {
		const productId = req.params.id;
		const { name, price, discount, category, description } = req.body;
		const productIndex = products.findIndex(product => product.id == productId);

		if (productIndex !== -1) {
			products[productIndex].name = name;
			products[productIndex].price = price;
			products[productIndex].discount = discount;
			products[productIndex].category = category;
			products[productIndex].description = description;

			fs.writeFileSync(productsFilePath, JSON.stringify(products, null, 2), 'utf-8');
			res.redirect(`/products/${productId}`);
		} else {
			error404({req,res},"Producto no actualizado");
		}
	},

	// Delete - Delete one product from DB
	destroy : (req, res) => {
		const productId = req.params.id;
		const restProducts = products.filter(product => product.id != productId);

		if (restProducts !== -1) {

			fs.writeFileSync(productsFilePath, JSON.stringify(restProducts, null, 2), 'utf-8');
			res.redirect(`/`);
		} else {
			error404({req,res},"Producto no borrado");
		}
	}
};

module.exports = controller;