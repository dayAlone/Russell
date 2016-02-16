import current from './default';
current.domain = 'www.russellhobbs-promo.ru';
current.mongoose.uri = process.env.MONGOLAB_URI;
console.log(process.env.MONGOLAB_URI)
current.crypto.hash.iterations = 12000;
export default current;
