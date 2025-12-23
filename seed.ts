import { query } from './src/lib/db'
import bcrypt from 'bcryptjs'
import { v4 as uuidv4 } from 'uuid'

async function seedDatabase() {
  try {
    console.log('Seeding database...')
    
    // Create admin user
    const adminId = uuidv4()
    const hashedPassword = await bcrypt.hash('admin123', 10)
    
    await query(
      `INSERT INTO users (id, email, name, password, role, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, NOW(), NOW())
       ON CONFLICT (email) DO NOTHING`,
      [adminId, 'admin@example.com', 'Admin User', hashedPassword, 'ADMIN']
    )
    
    console.log('Admin user created: admin@example.com / admin123')
    
    // Create a sample article
    const articleId = uuidv4()
    await query(
      `INSERT INTO articles (id, title, excerpt, content, slug, published, author_id, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), NOW())
       ON CONFLICT (slug) DO NOTHING`,
      [
        articleId,
        'Welcome to Article Hub',
        'This is a sample article to get you started with the platform.',
        `# Welcome to Article Hub

This is a sample article that demonstrates the capabilities of our article platform.

## Features

- **Markdown Support**: Write articles using Markdown syntax
- **Admin Dashboard**: Manage your articles with ease
- **Responsive Design**: Works on all devices
- **Neon Database**: Fast and reliable database backend

## Getting Started

1. Log in to the admin dashboard
2. Create your first article
3. Publish it for the world to see

## Code Example

\`\`\`javascript
function hello() {
  console.log('Hello, Article Hub!');
}
\`\`\`

Enjoy writing and sharing your articles!`,
        'welcome-to-article-hub',
        true,
        adminId
      ]
    )
    
    console.log('Sample article created')
    console.log('Database seeded successfully!')
    
  } catch (error) {
    console.error('Error seeding database:', error)
  } finally {
    process.exit(0)
  }
}

seedDatabase()