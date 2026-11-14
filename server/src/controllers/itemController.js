import Item from '../models/Item.js';

export async function getItems(req, res, next) {
  try {
    const { search, type, category, status } = req.query;
    const filter = {};
    if (type && ['lost', 'found'].includes(type)) filter.type = type;
    if (category) filter.category = category;
    if (status && ['open', 'claimed', 'returned'].includes(status)) filter.status = status;
    if (search?.trim()) filter.$or = [
      { title: { $regex: search.trim(), $options: 'i' } },
      { description: { $regex: search.trim(), $options: 'i' } },
      { location: { $regex: search.trim(), $options: 'i' } }
    ];
    const items = await Item.find(filter).populate('createdBy', 'name').sort({ createdAt: -1 });
    res.json({ count: items.length, items });
  } catch (error) { next(error); }
}

export async function getItem(req, res, next) {
  try {
    const item = await Item.findById(req.params.id).populate('createdBy', 'name');
    if (!item) return res.status(404).json({ message: 'Item not found.' });
    res.json({ item });
  } catch (error) { next(error); }
}

export async function createItem(req, res, next) {
  try {
    const { title, description, category, type, location, date, status, contactEmail, imageUrl } = req.body;
    const required = [title, description, category, type, location, date, contactEmail];
    if (required.some(value => !value)) return res.status(400).json({ message: 'Please complete all required fields.' });
    const item = await Item.create({ title, description, category, type, location, date, status, contactEmail, imageUrl, createdBy: req.user._id });
    res.status(201).json({ message: 'Listing created successfully.', item });
  } catch (error) { next(error); }
}

export async function updateItem(req, res, next) {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Item not found.' });
    if (item.createdBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') return res.status(403).json({ message: 'You can only edit your own listings.' });
    const allowed = ['title', 'description', 'category', 'type', 'location', 'date', 'status', 'contactEmail', 'imageUrl'];
    allowed.forEach(field => { if (req.body[field] !== undefined) item[field] = req.body[field]; });
    await item.save();
    res.json({ message: 'Listing updated successfully.', item });
  } catch (error) { next(error); }
}

export async function deleteItem(req, res, next) {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Item not found.' });
    if (item.createdBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') return res.status(403).json({ message: 'You can only delete your own listings.' });
    await item.deleteOne();
    res.json({ message: 'Listing deleted successfully.' });
  } catch (error) { next(error); }
}
