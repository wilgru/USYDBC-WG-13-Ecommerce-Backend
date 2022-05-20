const router = require('express').Router();
const { Category, Product } = require('../../models');

// The `/api/categories` endpoint

router.get('/', async (req, res) => {
  // find all categories
  // be sure to include its associated Products
  try {
    const CategoryData = await Category.findAll({
      include: [{ model: Product }]
    });
    res.json(CategoryData)
    
  } catch (error) {
    res.status(500).json(error);
  }
});

router.get('/:id', async (req, res) => {
  // find one category by its `id` value
  // be sure to include its associated Products
  try {
    const CategoryData = await Category.findByPk(req.params.id,
      {
        include: [{ model: Product }]
      }
    );
    if (!CategoryData) {
      res.status(404).json("Error: category was not found");
      return;
    }

    res.status(200).json(CategoryData);
    
  } catch (error) {
    res.status(500).json(error);
  }
});

router.post('/', async (req, res) => {
  // create a new category
  try {
    if (!req.body.category_name) {
      res.status(404).json("Error: category name not provided, or not provided properly");
      return;
    }
    const addedCategory = await Category.create(req.body);

    res.status(200).json(addedCategory);

  } catch (error) {
    res.status(500).json(error);
  }
});

router.put('/:id', async (req, res) => {
  // update a category by its `id` value
  try {
    // update a category's name by its `id` value
    const categoryToUpdate = await Category.findByPk(req.params.id);
    if (!categoryToUpdate) {
      res.status(404).json("Error: Couldn't update because the category was not found");
      return;
    }

    categoryToUpdate.category_name = req.body.category_name;
    await categoryToUpdate.save();

    res.status(200).json(categoryToUpdate);

  } catch (error) {
    res.status(500).json(error);
  }
});

router.delete('/:id', async (req, res) => {
    // delete on category by its `id` value
    try {
      const categoryToDestroy = await Category.destroy({
        where: {
          id: req.params.id
        }
      });

      if (!categoryToDestroy){
        res.status(404).json("Error: Couldn't delete because the category was not found");
        return;
      }
  
      res.status(200).json(categoryToDestroy);
  
    } catch (error) {
      res.status(500).json(error);
    }
});

module.exports = router;
