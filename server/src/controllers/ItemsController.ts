import { Request, Response } from 'express';
import knex from '../database/connection';

class ItemsController {
  async index(req: Request, res: Response) {
    const items = await knex('items').select('*');

    const serializedItems = items.map((item) => {
      return {
        id: item.id,
        title: item.title,
        // image_url: `http://localhost:3333/uploads/${item.image}`,
        image_url: `http://192.168.0.100:3333/uploads/${item.image}`,
      };
    });

    // return res.json(items);
    return res.json(serializedItems);

    // return res.json({ message: 'Welcome to Next Level Week 1.0' });
  }
}

export default ItemsController;
