import dotenv from 'dotenv';
dotenv.config();
console.log('--- Environment Check ---');
console.log('MONGO_URI from process.env:', process.env.MONGO_URI);
console.log('PORT from process.env:', process.env.PORT);
console.log('All keys in process.env:', Object.keys(process.env).filter(k => !k.includes('SESSION') && !k.includes('PRIV')).join(', '));
