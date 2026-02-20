import { NextResponse } from 'next/server';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

function parseNumeric(val: any): number {
  if (val === null || val === undefined || val === '') return 0;
  return parseFloat(String(val)) || 0;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type') || 'all';

  try {
    if (type === 'sale') {
      const result = await pool.query(`
        SELECT 
          id, city, district, road as "address", building_type as "buildingType",
          area_building as "areaBuilding", area_land as "areaLand",
          price, price_per_ping as "pricePerPing", 
          floor, total_floors as "totalFloors",
          build_year as "buildYear", transaction_date as "transactionDate",
          transaction_type as "transactionType"
        FROM real_estate_transactions 
        WHERE district = '後龍鎮'
        ORDER BY transaction_date DESC
        LIMIT 100
      `);
      
      const data = result.rows.map((row: any) => ({
        ...row,
        areaBuilding: parseNumeric(row.areaBuilding),
        areaLand: parseNumeric(row.areaLand),
        price: parseNumeric(row.price),
        pricePerPing: parseNumeric(row.pricePerPing),
      }));
      
      return NextResponse.json({ data, count: data.length });
    } 
    
    if (type === 'presale') {
      const result = await pool.query(`
        SELECT 
          id, city, district, project_name as "projectName", 
          developer, address, unit_price as "unitPrice",
          total_price as "totalPrice", area, floor,
          transaction_date as "transactionDate"
        FROM presale_transactions 
        WHERE district = '後龍鎮'
        ORDER BY transaction_date DESC
        LIMIT 100
      `);
      
      const data = result.rows.map((row: any) => ({
        ...row,
        unitPrice: parseNumeric(row.unitPrice),
        totalPrice: parseNumeric(row.totalPrice),
        area: parseNumeric(row.area),
      }));
      
      return NextResponse.json({ data, count: data.length });
    }
    
    // Return both
    const [sales, presales] = await Promise.all([
      pool.query(`
        SELECT 
          id, city, district, road as "address", building_type as "buildingType",
          area_building as "areaBuilding", area_land as "areaLand",
          price, price_per_ping as "pricePerPing", 
          floor, total_floors as "totalFloors",
          build_year as "buildYear", transaction_date as "transactionDate",
          transaction_type as "transactionType"
        FROM real_estate_transactions 
        WHERE district = '後龍鎮'
        ORDER BY transaction_date DESC
      `),
      pool.query(`
        SELECT 
          id, city, district, project_name as "projectName", 
          developer, address, unit_price as "unitPrice",
          total_price as "totalPrice", area, floor,
          transaction_date as "transactionDate"
        FROM presale_transactions 
        WHERE district = '後龍鎮'
        ORDER BY transaction_date DESC
      `)
    ]);

    const salesData = sales.rows.map((row: any) => ({
      ...row,
      areaBuilding: parseNumeric(row.areaBuilding),
      areaLand: parseNumeric(row.areaLand),
      price: parseNumeric(row.price),
      pricePerPing: parseNumeric(row.pricePerPing),
      type: 'sale'
    }));

    const presalesData = presales.rows.map((row: any) => ({
      ...row,
      unitPrice: parseNumeric(row.unitPrice),
      totalPrice: parseNumeric(row.totalPrice),
      area: parseNumeric(row.area),
      type: 'presale'
    }));

    return NextResponse.json({
      sales: salesData,
      presales: presalesData,
      total: salesData.length + presalesData.length
    });

  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch data' },
      { status: 500 }
    );
  }
}
