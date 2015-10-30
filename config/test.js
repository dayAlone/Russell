import current from './default';
current.domain = 'rh.radia.ru';
if (process.env.MONGOLAB_URI) current.mongoose.uri = process.env.MONGOLAB_URI;
current.crypto.hash.iterations = 12000;

export default current;
