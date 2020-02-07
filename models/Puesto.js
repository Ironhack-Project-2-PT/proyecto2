const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const puestoSchema = new Schema({
  name: {type: String, required: true },
  mainDish: {type: String, required: true},
  openingTime: Number,
  closingTime: Number, 
  averagePrice: Number,
  openingDays: [{ type: String, enum: ['lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado', 'domingo'] }],
  address: {type: String,
    required: true,
  },
  description: String,
  lat: {type:Number, required: true},
  lng: {type:Number, required: true},
  image: {type: String, default:'g'}
});

const Puesto = mongoose.model('Puesto', puestoSchema);
module.exports = Puesto;


Puesto.create({
  name: 'Sushi Haruki-Go',
  mainDish:'Sushi',
  openingTime: 10,
  closingTime: 18,
  averagePrice: 45,
  openingDays: ['lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado'],
  address: 'Insurgentes Sur 168',
  description: 'Hay sushi rico rico rico',
  lat: 19.422440,
  lng: -99.163177,
  coordinates: {lat: 19.422440, lng: -99.163177},
  image: "public/6b6b3134-58c6-4be8-b02b-f091d1d37d36.jpeg"
})
.then(puesto => { console.log('The puesto is saved and its value is: ', puesto) })
.catch(err => { console.log('An error happened:', err) });
