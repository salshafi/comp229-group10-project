import User from '../models/User.js';

const safeUser = user => ({ id: user._id, name: user.name, email: user.email, role: user.role, createdAt: user.createdAt });

export async function getUsers(req, res, next) {
  try { const users = await User.find().sort({ createdAt: -1 }); res.json({ count: users.length, users: users.map(safeUser) }); }
  catch (error) { next(error); }
}

export async function getUser(req, res, next) {
  try {
    if (req.user.role !== 'admin' && req.user._id.toString() !== req.params.id) return res.status(403).json({ message: 'You can only view your own profile.' });
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found.' });
    res.json({ user: safeUser(user) });
  } catch (error) { next(error); }
}

export async function updateUser(req, res, next) {
  try {
    if (req.user.role !== 'admin' && req.user._id.toString() !== req.params.id) return res.status(403).json({ message: 'You can only update your own profile.' });
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found.' });
    if (req.body.name) user.name = req.body.name;
    if (req.body.email) user.email = req.body.email.toLowerCase().trim();
    // Role changes are deliberately excluded from this endpoint.
    await user.save();
    res.json({ user: safeUser(user) });
  } catch (error) { next(error); }
}

export async function deleteUser(req, res, next) {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found.' });
    await user.deleteOne();
    res.json({ message: 'User deleted.' });
  } catch (error) { next(error); }
}
