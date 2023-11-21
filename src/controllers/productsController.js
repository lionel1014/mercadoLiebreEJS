const fs = require('fs');
const path = require('path');

const productsFilePath = path.join(__dirname, '../data/productsDataBase.json');
const products = JSON.parse(fs.readFileSync(productsFilePath, 'utf-8'));

const toThousand = n => n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");

const findProductbyId = ({params}) => {
	const product = products.find(product => product.id == params.id);
	return product;
}

const controller = {
	// Root - Show all products
	index: (req, res) => {
		res.render("products",{products})
	},

	// Detail - Detail from one product
	detail: (req, res) => {
		const product = findProductbyId(req)
		res.render("detail",{product})
	},

	// Create - Form to create
	create: (req, res) => {
		res.render("product-create-form")
	},
	
	// Create -  Method to store
	store: (req, res) => {
		// Obtener datos del formulario
		const { name, price, discount, category, description} = req.body;

		// Crear un nuevo objeto de producto
		const newProduct = {
			id: products.length + 1, // Puedes generar el ID de manera más sofisticada si es necesario
			name,
			price,
			discount,
			category,
			description,
			image: 'default-image-png'
		};

		// Agregar el nuevo producto al array de productos
		products.push(newProduct);

		// Guardar el array actualizado en el archivo
		fs.writeFileSync(productsFilePath, JSON.stringify(products, null, 2), 'utf-8');

		// Redireccionar a la página de detalles del nuevo producto
		res.redirect(`/products/${newProduct.id}`);
	},

	// Update - Form to edit
	edit: (req, res) => {
		const product = findProductbyId(req);
		res.render("product-edit-form",{product})
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
			res.status(404).send('Producto no encontrado');
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
			res.status(404).send('Producto no borrado');
		}
	}
};

module.exports = controller;