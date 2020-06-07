import Knex from 'knex';

export async function seed(knex: Knex) {
  await knex('items').insert([
    { title: 'Light Bulbs', image: 'lampadas.svg' },
    { title: 'Batteries', image: 'baterias.svg' },
    { title: 'Papers and Cards', image: 'papeis-papelao.svg' },
    { title: 'Electrical Waste', image: 'eletronicos.svg' },
    { title: 'Organic Waste', image: 'organicos.svg' },
    { title: 'Cooking Oil', image: 'oleo.svg' },
  ]);
}
