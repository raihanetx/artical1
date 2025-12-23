import { notFound } from 'next/navigation'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Calendar, User, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeHighlight from 'rehype-highlight'

interface Article {
  id: string
  title: string
  content: string
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

async function getArticle(slug: string): Promise<Article | null> {
  try {
    const { query } = await import('@/lib/db')
    const result = await query(`
      SELECT 
        a.id, a.title, a.content, a.excerpt, a.slug, a.published, a.created_at, a.updated_at,
        u.name, u.email
      FROM articles a
      JOIN users u ON a.author_id = u.id
      WHERE a.slug = $1 AND a.published = true
    `, [slug])

    if (result.rows.length === 0) {
      return null
    }

    const row = result.rows[0]
    return {
      id: row.id,
      title: row.title,
      content: row.content,
      excerpt: row.excerpt,
      slug: row.slug,
      published: row.published,
      created_at: row.created_at,
      updated_at: row.updated_at,
      author: {
        name: row.name,
        email: row.email
      }
    }
  } catch (error) {
    console.error('Failed to fetch article:', error)
    return null
  }
}

export default async function ArticlePage({ params }: { params: { slug: string } }) {
  const article = await getArticle(params.slug)

  if (!article) {
    notFound()
  }

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

      {/* Article Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Back Button */}
          <Link href="/" className="inline-flex items-center text-muted-foreground hover:text-foreground mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Articles
          </Link>

          {/* Article Header */}
          <Card className="mb-8">
            <CardContent className="pt-6">
              <div className="text-center mb-6">
                <Badge variant="secondary" className="mb-4">Article</Badge>
                <h1 className="text-4xl font-bold mb-4">{article.title}</h1>
                <p className="text-xl text-muted-foreground mb-6">{article.excerpt}</p>
                
                <div className="flex items-center justify-center text-sm text-muted-foreground space-x-6">
                  <div className="flex items-center">
                    <User className="w-4 h-4 mr-1" />
                    {article.author.name || 'Anonymous'}
                  </div>
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-1" />
                    {new Date(article.created_at).toLocaleDateString()}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Article Body */}
          <Card>
            <CardContent className="pt-6">
              <div className="prose prose-gray max-w-none">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  rehypePlugins={[rehypeHighlight]}
                  className="prose-headings:font-bold prose-h1:text-3xl prose-h2:text-2xl prose-h3:text-xl prose-p:text-base prose-p:leading-relaxed prose-code:bg-muted prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-pre:bg-muted prose-pre:p-4 prose-pre:rounded-lg prose-pre:overflow-x-auto"
                >
                  {article.content}
                </ReactMarkdown>
              </div>
            </CardContent>
          </Card>
        </div>
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