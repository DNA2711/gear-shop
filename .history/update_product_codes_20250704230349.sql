-- Update CPU codes
UPDATE products 
SET product_code = CASE
    -- Intel CPUs
    WHEN product_code LIKE 'INTCPUI9%' THEN CONCAT('INTCPI9', RIGHT(product_code, 2))
    WHEN product_code LIKE 'INTCPUI7%' THEN CONCAT('INTCPI7', RIGHT(product_code, 2))
    WHEN product_code LIKE 'INTCPUI5%' THEN CONCAT('INTCPI5', RIGHT(product_code, 2))
    WHEN product_code LIKE 'INTCPUI3%' THEN CONCAT('INTCPI3', RIGHT(product_code, 2))
    -- AMD CPUs
    WHEN product_code LIKE 'AMDCPUR9%' THEN CONCAT('AMDCPR9', RIGHT(product_code, 2))
    WHEN product_code LIKE 'AMDCPUR7%' THEN CONCAT('AMDCPR7', RIGHT(product_code, 2))
    WHEN product_code LIKE 'AMDCPUR5%' THEN CONCAT('AMDCPR5', RIGHT(product_code, 2))
    WHEN product_code LIKE 'AMDCPUR3%' THEN CONCAT('AMDCPR3', RIGHT(product_code, 2))
    -- Keep others unchanged for now
    ELSE product_code
END
WHERE product_code LIKE 'INTCPU%' OR product_code LIKE 'AMDCPU%';

-- Update Mainboard codes
UPDATE products 
SET product_code = CASE
    WHEN product_code LIKE 'ASUMAINB%' THEN CONCAT('ASUMB', RIGHT(product_code, 3))
    WHEN product_code LIKE 'MSIMAINB%' THEN CONCAT('MSIMB', RIGHT(product_code, 3))
    WHEN product_code LIKE 'GIGMAINB%' THEN CONCAT('GIGMB', RIGHT(product_code, 3))
    ELSE product_code
END
WHERE product_code LIKE '%MAINB%';

-- Update RAM codes
UPDATE products 
SET product_code = CASE
    WHEN product_code LIKE 'CORSRAM%' THEN CONCAT('CRSRM', RIGHT(product_code, 3))
    WHEN product_code LIKE 'GSKRAM%' THEN CONCAT('GSKRM', RIGHT(product_code, 3))
    WHEN product_code LIKE 'KINGRAM%' THEN CONCAT('KINRM', RIGHT(product_code, 3))
    ELSE product_code
END
WHERE product_code LIKE '%RAM%';

-- Update GPU codes
UPDATE products 
SET product_code = CASE
    WHEN product_code LIKE 'MSIGPU%' THEN CONCAT('MSIGP', RIGHT(product_code, 3))
    WHEN product_code LIKE 'ASUSGPU%' THEN CONCAT('ASUSGP', RIGHT(product_code, 3))
    WHEN product_code LIKE 'GIGGPU%' THEN CONCAT('GIGGP', RIGHT(product_code, 3))
    ELSE product_code
END
WHERE product_code LIKE '%GPU%';

-- Update Storage codes
UPDATE products 
SET product_code = CASE
    WHEN product_code LIKE 'SAMSSD%' THEN CONCAT('SAMSD', RIGHT(product_code, 3))
    WHEN product_code LIKE 'WDHDD%' THEN CONCAT('WDHHD', RIGHT(product_code, 3))
    WHEN product_code LIKE 'SEAHDD%' THEN CONCAT('SEADD', RIGHT(product_code, 3))
    ELSE product_code
END
WHERE product_code LIKE '%SSD%' OR product_code LIKE '%HDD%';

-- Update PSU codes
UPDATE products 
SET product_code = CASE
    WHEN product_code LIKE 'CORSPSU%' THEN CONCAT('CRSPS', RIGHT(product_code, 3))
    WHEN product_code LIKE 'SEASONIC%' THEN CONCAT('SEAPS', RIGHT(product_code, 3))
    WHEN product_code LIKE 'EVGAPSU%' THEN CONCAT('EVGPS', RIGHT(product_code, 3))
    ELSE product_code
END
WHERE product_code LIKE '%PSU%';

-- Update Case codes
UPDATE products 
SET product_code = CASE
    WHEN product_code LIKE 'CORSCASE%' THEN CONCAT('CRSCS', RIGHT(product_code, 3))
    WHEN product_code LIKE 'NZXTCASE%' THEN CONCAT('NZTCS', RIGHT(product_code, 3))
    WHEN product_code LIKE 'PHANTEKS%' THEN CONCAT('PHTCS', RIGHT(product_code, 3))
    ELSE product_code
END
WHERE product_code LIKE '%CASE%'; 