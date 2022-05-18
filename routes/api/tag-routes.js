const router = require('express').Router();
const { Tag, Product, ProductTag } = require('../../models');

// The `/api/tags` endpoint

router.get('/', async (req, res) => {
  // find all tags
  // be sure to include its associated Product data
  try {
    const TagData = await Tag.findAll({
        include: [{ model: Product }]
    });
    res.status(200).json(TagData);
    
  } catch (error) {
    res.status(500).json(error);
  }
});

router.get('/:id', async (req, res) => {
  // find a single tag by its `id`
  // be sure to include its associated Product data
  try {
    const TagData = await Tag.findByPk(req.params.id,
      {
        include: [{ model: Product }]
      }
    );
    if (!TagData) {
      res.status(404).json("Error: No tag found!");
      return;
    }

    res.status(200).json(TagData);
    
  } catch (error) {
    res.status(500).json(error);
  }
});

router.post('/', async (req, res) => {
  // create a new tag
  try {
    if (!req.body.tag_name) {
      res.status(404).json("Error: Tag name not provided, or not provided properly");
      return;
    }
    const addedTag = await Tag.create(req.body);

    res.status(200).json(addedTag);

  } catch (error) {
    res.status(500).json(error);
  }
});

router.put('/:id', async (req, res) => {
  try {
    // update a tag's name by its `id` value
    const tagToUpdate = await Tag.findByPk(req.params.id);
    if (!tagToUpdate) {
      res.status(404).json("Error: No tag found!");
      return;
    }

    tagToUpdate.tag_name = req.body.tag_name;
    await tagToUpdate.save();

    res.status(200).json(tagToUpdate);

  } catch (error) {
    res.status(500).json(error);
  }
});

router.delete('/:id', async (req, res) => {
  // delete on tag by its `id` value
  try {
    const tagToDestroy = await Tag.findByPk(req.params.id);
    const tagAssociations = await ProductTag.findAll({
      where: {
        tag_id: req.params.id
      }
    });

    if (!tagToDestroy){
      res.status(404).json("Error: No tag found!");
      return;
    }

    await tagToDestroy.destroy();
    res.status(200).json(tagToDestroy);

    if (tagAssociations.length) {
      await tagAssociations.destroy();
      res.status(200).json(tagAssociations);
    }

  } catch (error) {
    res.status(500).json(error);
  }
});

module.exports = router;
