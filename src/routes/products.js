// ************ Require's ************
const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path')

const storage = multer.diskStorage({
	destination: (req,file,cd) => {
		cd(null, path.join(__dirname, '../../public/images/products'))
	},
	filename: (req,file,cd) =>{
        console.log(file);
		const uniqueSuffix = Date.now();
		const fileExtension = path.extname(file.originalname);
		cd(null, `${file.fieldname}-${uniqueSuffix}${fileExtension}`);
	}
})

const upload = multer({storage});

// ************ Controller Require ************
const productsController = require('../controllers/productsController');

/*** GET ALL PRODUCTS ***/ 
router.get('/', productsController.index); 

/*** CREATE ONE PRODUCT ***/ 
router.post('/', upload.single('form-image'), productsController.store);
router.get('/create', productsController.create); 


/*** GET ONE PRODUCT ***/ 
router.get('/:id/', productsController.detail); 

/*** EDIT ONE PRODUCT ***/ 
router.get('/edit/:id', productsController.edit); 
router.put('/:id', productsController.update); 


/*** DELETE ONE PRODUCT***/ 
router.delete('/:id', productsController.destroy); 


module.exports = router;
