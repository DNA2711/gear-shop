-- Add payment_method column to orders table
-- This is needed for the updated payment system

ALTER TABLE orders 
ADD COLUMN payment_method VARCHAR(10) DEFAULT 'cod' AFTER phone_number;

-- Update existing orders to have 'cod' as default payment method
UPDATE orders 
SET payment_method = 'cod' 
WHERE payment_method IS NULL;

-- Add index for better performance on payment method queries
CREATE INDEX idx_orders_payment_method ON orders(payment_method);

-- Show the updated table structure
DESCRIBE orders; 