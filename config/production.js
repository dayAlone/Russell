import current from './default';
current.domain = 'russellhobbs-promo.com';
current.mongoose.uri = process.env.MONGOLAB_URI;
current.crypto.hash.iterations = 12000;
export default current;
