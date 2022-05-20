const router = require('express').Router();
const { Product, Category, Tag, ProductTag } = require('../../models');

// The `/api/products` endpoint

// get all products
router.get('/', async (req, res) => {
  // find all products
  // be sure to include its associated Category and Tag data
  try {
    const ProductData = await Product.findAll({
        include: [{ model: Category }, { model: Tag }],
        attributes: {exclude: ['category_id']} // if we're gettinng the category, then we dont ready need this exrta ID
    });
    res.status(200).json(ProductData)
    
  } catch (error) {
    res.status(500).json(error);
  }
});

// get one product
router.get('/:id', async (req, res) => {
  // find a single product by its `id`
  // be sure to include its associated Category and Tag data
  try {
    const ProductData = await Product.findByPk(req.params.id,
      {
        include: [{ model: Category}, { model: Tag }],
        attributes: {exclude: ['category_id']}
      }
    );

    if (!ProductData) {
      res.status(404).json("Error: Product not found!");
      return;
    }

    res.status(200).json(ProductData)
    
  } catch (error) {
    res.status(500).json(error);
  }
});

// create new product
router.post('/', (req, res) => {
  /* req.body should look like this...
    {
      product_name: "Basketball",
      price: 200.00,
      stock: 3,
      tagIds: [1, 2, 3, 4]
    }
  */
  Product.create(req.body)
    .then((product) => {
      // if there's product tags, we need to create pairings to bulk create in the ProductTag model
      if (req.body.tagIds.length) {
        const productTagIdArr = req.body.tagIds.map((tag_id) => {
          return {
            product_id: product.id,
            tag_id,
          };
        });
        ProductTag.bulkCreate(productTagIdArr);
      }
      // if no product tags, just respond
      res.status(200).json(product);
    })
    // .then((productTagIds) => res.status(200).json(productTagIds))
    .catch((err) => {
      console.log(err);
      res.status(400).json(err);
    });
});

// update product
router.put('/:id', async (req, res) => {
  try {
    // update product data
    const productData = await Product.findByPk(req.params.id);
    if (!productData) {
      res.status(404).json("Error: Couldn't update product becasue product was not found.");
      return;
    }

    productData.product_name = req.body.product_name;
    productData.price = req.body.price;
    productData.stock = req.body.stock;
    productData.category_id = req.body.category_id;
    productData.tagIds = req.body.tagIds;
    await productData.save();

    // find all associated tags from ProductTag
    const productTagData = await ProductTag.findAll({ where: { product_id: req.params.id } });

    // get list of current tag_ids
    const productTagIds = productTagData.map(({ tag_id }) => tag_id);
    // create filtered list of new tag_ids
    const newProductTags = req.body.tagIds
      .filter((tag_id) => !productTagIds.includes(tag_id))
      .map((tag_id) => {
        return {
          product_id: req.params.id,
          tag_id,
        };
      });
    // figure out which ones to remove
    const productTagsToRemove = productTagData
      .filter(({ tag_id }) => !req.body.tagIds.includes(tag_id))
      .map(({ id }) => id);

    // run both actions
    await ProductTag.destroy({ where: { id: productTagsToRemove } })
    await ProductTag.bulkCreate(newProductTags)

    res.status(200).json(productData)

    } catch(err) {
      // console.log(err);
      res.status(500).json(err);
    }
});

router.delete('/:id', async (req, res) => {
  // delete one product by its `id` value
    // delete on tag by its `id` value
    try {
      const productToDestroy = await Product.destroy({
        where: {
          id: req.params.id
        }
      });
  
      if (!productToDestroy){
        res.status(404).json("Error: Couldn't delete because the product was not found");
        return;
      }
  
      await productToDestroy.destroy();
      
      await ProductTag.destroy({
        where: {
          tag_id: req.params.id
        }
      });
  
      res.status(200).json(productToDestroy);
  
    } catch (error) {
      res.status(500).json(error);
    }
});

module.exports = router;
