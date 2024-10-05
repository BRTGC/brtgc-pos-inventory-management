// src/api/inventory/modify.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../lib/prisma';
import { isAuthenticated, isAdmin } from '../../../middleware/auth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Check if the user is authenticated
  await isAuthenticated(req, res, async () => {
    // Only allow admins to make changes
    await isAdmin(req, res, async () => {
      if (req.method === 'POST') {
        const { productId, quantity } = req.body;

        // Update inventory logic here
        const updatedInventory = await prisma.inventory.update({
          where: { productId },
          data: { quantity },
        });

        res.status(200).json(updatedInventory);
      } else {
        res.status(405).json({ message: 'Method not allowed' });
      }
    });
  });
}
