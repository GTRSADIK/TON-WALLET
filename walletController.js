const { db } = require('../utils/ton');
const { ref, get, set, push } = require('firebase/database');

// Dummy login/signup (Firebase Realtime DB)
exports.login = async (req, res) => {
    const { userId } = req.body;
    const snapshot = await get(ref(db, 'users/' + userId));
    if(snapshot.exists()) {
        res.json({ success: true, balance: snapshot.val().balance });
    } else {
        res.json({ success: false, message: 'User not found' });
    }
};

exports.signup = async (req, res) => {
    const { userId, name } = req.body;
    await set(ref(db, 'users/' + userId), { name, balance: 0, transactions: [] });
    res.json({ success: true });
};

exports.withdraw = async (req, res) => {
    const { userId, amount, address } = req.body;
    const snapshot = await get(ref(db, 'users/' + userId));
    if(!snapshot.exists()) return res.json({ success: false, message: 'User not found' });

    let balance = snapshot.val().balance;
    if(balance < amount) return res.json({ success: false, message: 'Insufficient balance' });

    // Deduct fee 0.05 TON
    const fee = 0.05;
    const newBalance = balance - amount - fee;

    await set(ref(db, 'users/' + userId + '/balance'), newBalance);
    await push(ref(db, 'users/' + userId + '/transactions'), { type: 'withdraw', amount, address, fee, date: Date.now() });

    // TODO: TON transaction using tonweb (send amount-fee to address, fee to admin)
    res.json({ success: true, newBalance });
};

exports.deposit = async (req, res) => {
    const { userId, amount } = req.body;
    const snapshot = await get(ref(db, 'users/' + userId));
    if(!snapshot.exists()) return res.json({ success: false, message: 'User not found' });

    let balance = snapshot.val().balance;
    const newBalance = balance + amount;

    await set(ref(db, 'users/' + userId + '/balance'), newBalance);
    await push(ref(db, 'users/' + userId + '/transactions'), { type: 'deposit', amount, date: Date.now() });

    res.json({ success: true, newBalance });
};

exports.getBalance = async (req, res) => {
    const { userId } = req.params;
    const snapshot = await get(ref(db, 'users/' + userId));
    if(!snapshot.exists()) return res.json({ success: false, message: 'User not found' });
    res.json({ success: true, balance: snapshot.val().balance });
};