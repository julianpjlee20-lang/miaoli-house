import { NextResponse } from 'next/server';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type') || 'all'; // all, sale, presale
  const district = searchParams.get('district') || '後龍鎮';

  try {
    let query = '';
    let params: any[] = [district];

    if (type === 'sale') {
      query = `
        SELECT 
          id, city, district, road as address, building_type as "buildingType",
          area_building as "areaBuilding", area_land as "areaLand",
          price, price_per_ping as "pricePerPing", 
          floor, total_floors as "totalFloors",
          build_year as "buildYear", transaction_date as "transactionDate",
          transaction_type as "transactionType"
        FROM real_estate_transactions 
        WHERE district = $1
        ORDER BY transaction_date DESC
        LIMIT 100
      `;
    } else if (type === 'presale') {
      query = `
        SELECT 
          id, city, district, project_name as "projectName", 
          developer, address, unit_price as "unitPrice",
          total_price as "totalPrice", area, floor,
          transaction_date as "transactionDate"
        FROM presale_transactions 
        WHERE district = $1
        ORDER BY transaction_date DESC
        LIMIT 100
      `;
    } else {
      // Return both
      const [sales, presales] = await Promise.all([
        pool.query(`
          SELECT 
            id, city, district, road as address, building_type as "buildingType",
            area_building as "areaBuilding", area_land as "areaLand",
            price, price_per_ping as "pricePerPing", 
            floor, total_floors as "totalFloors",
            build_year as "buildYear", transaction_date as "transactionDate",
            transaction_type as "transactionType", 'sale' as "type"
          FROM real_estate_transactions 
          WHERE district = $1
          ORDER BY transaction_date DESC
        `),
        pool.query(`
          SELECT 
            id, city, district, project_name as "projectName", 
            developer, address, unit_price as "unitPrice",
            total_price as "totalPrice", area, floor,
            transaction_date as "transactionDate", 'presale' as "type"
          FROM presale_transactions 
          WHERE district = $1
          ORDER BY transaction_date DESC
        `)
      ]);

      return NextResponse.json({
        sales: sales.rows,
        presales: presales.rows,
        total: sales.rows.length + presales.rows.length
      });
    }

    const result = await pool.query(query, params);
    return NextResponse.json({
      data: result.rows,
      count: result.rows.length
    });

  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch data' },
      { status: 500 }
    );
  }
}
