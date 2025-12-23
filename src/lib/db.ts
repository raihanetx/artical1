import { Pool } from 'pg'

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
})

export async function query(text: string, params?: any[]) {
  const start = Date.now()
  try {
    const res = await pool.query(text, params)
    const duration = Date.now() - start
    console.log('Executed query', { text, duration, rows: res.rowCount })
    return res
  } catch (error) {
    console.error('Database query error', error)
    throw error
  }
}

export async function initDatabase() {
  try {
    // Create users table
    await query(`
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        email TEXT UNIQUE NOT NULL,
        name TEXT,
        password TEXT NOT NULL,
        role TEXT DEFAULT 'USER',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `)

    // Create articles table
    await query(`
      CREATE TABLE IF NOT EXISTS articles (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        content TEXT NOT NULL,
        excerpt TEXT,
        slug TEXT UNIQUE NOT NULL,
        published BOOLEAN DEFAULT FALSE,
        author_id TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `)

    // Create indexes
    await query(`CREATE INDEX IF NOT EXISTS idx_articles_slug ON articles(slug)`)
    await query(`CREATE INDEX IF NOT EXISTS idx_articles_published ON articles(published)`)
    await query(`CREATE INDEX IF NOT EXISTS idx_articles_author ON articles(author_id)`)
    await query(`CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)`)

    console.log('Database initialized successfully')
  } catch (error) {
    console.error('Database initialization error:', error)
    throw error
  }
}

export default pool