import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Calendar, Clock, User } from 'lucide-react'
import Link from 'next/link'

interface Article {
  id: string
  title: string
  excerpt: string
  slug: string
  published: boolean
  created_at: string
  updated_at: string
  author: {
    name: string
    email: string
  }
}

async function getArticles(): Promise<Article[]> {
  try {
    const { query } = await import('@/lib/db')
    const result = await query(`
      SELECT 
        a.id, a.title, a.excerpt, a.slug, a.published, a.created_at, a.updated_at,
        u.name, u.email
      FROM articles a
      JOIN users u ON a.author_id = u.id
      WHERE a.published = true
      ORDER BY a.created_at DESC
    `)

    return result.rows.map(row => ({
      id: row.id,
      title: row.title,
      excerpt: row.excerpt,
      slug: row.slug,
      published: row.published,
      created_at: row.created_at,
      updated_at: row.updated_at,
      author: {
        name: row.name,
        email: row.email
      }
    }))
  } catch (error) {
    console.error('Failed to fetch articles:', error)
    return []
  }
}

export default async function Home() {
  const articles = await getArticles()

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <img
                src="/logo.svg"
                alt="Article Hub"
                className="w-8 h-8"
              />
              <h1 className="text-2xl font-bold">Article Hub</h1>
            </div>
            <nav className="flex items-center space-x-4">
              <Link href="/">
                <Button variant="ghost">Home</Button>
              </Link>
              <Link href="/admin">
                <Button variant="outline">Admin</Button>
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">Welcome to Article Hub</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Discover insightful articles on various topics. Read, learn, and explore new ideas.
          </p>
        </div>

        {articles.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">No articles published yet.</p>
            <p className="text-muted-foreground">Check back soon for new content!</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {articles.map((article) => (
              <Card key={article.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="secondary">Article</Badge>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Calendar className="w-4 h-4 mr-1" />
                      {new Date(article.created_at).toLocaleDateString()}
                    </div>
                  </div>
                  <CardTitle className="line-clamp-2">{article.title}</CardTitle>
                  <CardDescription className="line-clamp-3">
                    {article.excerpt}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <User className="w-4 h-4 mr-1" />
                      {article.author.name || 'Anonymous'}
                    </div>
                    <Link href={`/article/${article.slug}`}>
                      <Button variant="outline" size="sm">
                        Read More
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t mt-auto">
        <div className="container mx-auto px-4 py-6">
          <div className="text-center text-muted-foreground">
            <p>&copy; 2024 Article Hub. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}