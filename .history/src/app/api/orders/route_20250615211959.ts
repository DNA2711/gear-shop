import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { CreateOrderRequest } from '@/types/order';

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body: CreateOrderRequest = await req.json();
        const { shipping_address, phone_number, items } = body;

        // Start transaction
        const client = await db.connect();
        try {
            await client.query('BEGIN');

            // Create order
            const orderResult = await client.query(
                `INSERT INTO orders (user_id, total_amount, shipping_address, phone_number)
                 VALUES ($1, $2, $3, $4)
                 RETURNING id`,
                [session.user.id, 0, shipping_address, phone_number]
            );
            const orderId = orderResult.rows[0].id;

            // Calculate total amount and insert order items
            let totalAmount = 0;
            for (const item of items) {
                const productResult = await client.query(
                    'SELECT price FROM products WHERE id = $1',
                    [item.product_id]
                );
                const price = productResult.rows[0].price;
                totalAmount += price * item.quantity;

                await client.query(
                    `INSERT INTO order_items (order_id, product_id, quantity, price)
                     VALUES ($1, $2, $3, $4)`,
                    [orderId, item.product_id, item.quantity, price]
                );
            }

            // Update order total amount
            await client.query(
                'UPDATE orders SET total_amount = $1 WHERE id = $2',
                [totalAmount, orderId]
            );

            await client.query('COMMIT');

            return NextResponse.json({ 
                message: 'Order created successfully',
                orderId 
            });
        } catch (error) {
            await client.query('ROLLBACK');
            throw error;
        } finally {
            client.release();
        }
    } catch (error) {
        console.error('Error creating order:', error);
        return NextResponse.json(
            { error: 'Failed to create order' },
            { status: 500 }
        );
    }
}

export async function GET(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const orders = await db.query(
            `SELECT o.*, 
                    json_agg(json_build_object(
                        'id', oi.id,
                        'product_id', oi.product_id,
                        'quantity', oi.quantity,
                        'price', oi.price
                    )) as items
             FROM orders o
             LEFT JOIN order_items oi ON o.id = oi.order_id
             WHERE o.user_id = $1
             GROUP BY o.id
             ORDER BY o.created_at DESC`,
            [session.user.id]
        );

        return NextResponse.json(orders.rows);
    } catch (error) {
        console.error('Error fetching orders:', error);
        return NextResponse.json(
            { error: 'Failed to fetch orders' },
            { status: 500 }
        );
    }
} 