'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2, Save, Eye } from 'lucide-react'
import Link from 'next/link'

export default function NewArticle() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [title, setTitle] = useState('')
  const [excerpt, setExcerpt] = useState('')
  const [content, setContent] = useState('')
  const [published, setPublished] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [preview, setPreview] = useState(false)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/admin/login')
    }
  }, [status, router])

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    if (!title || !content) {
      setError('Title and content are required')
      setLoading(false)
      return
    }

    try {
      const slug = generateSlug(title)
      const response = await fetch('/api/articles', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          excerpt,
          content,
          slug,
          published,
          authorId: session?.user?.id
        }),
      })

      if (response.ok) {
        router.push('/admin/dashboard')
      } else {
        const data = await response.json()
        setError(data.error || 'Failed to create article')
      }
    } catch (error) {
      setError('An error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    )
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
              <h1 className="text-2xl font-bold">Create New Article</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/admin/dashboard">
                <Button variant="outline">Back to Dashboard</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Article Settings */}
            <Card>
              <CardHeader>
                <CardTitle>Article Settings</CardTitle>
                <CardDescription>Basic information about your article</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Enter article title"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="excerpt">Excerpt</Label>
                  <Textarea
                    id="excerpt"
                    value={excerpt}
                    onChange={(e) => setExcerpt(e.target.value)}
                    placeholder="Brief description of your article"
                    rows={3}
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="published"
                    checked={published}
                    onCheckedChange={setPublished}
                  />
                  <Label htmlFor="published">Publish immediately</Label>
                </div>
              </CardContent>
            </Card>

            {/* Content */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Content *</CardTitle>
                    <CardDescription>Write your article content in Markdown format</CardDescription>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setPreview(!preview)}
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    {preview ? 'Edit' : 'Preview'}
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {preview ? (
                  <div className="prose prose-gray max-w-none">
                    <div className="whitespace-pre-wrap">{content}</div>
                  </div>
                ) : (
                  <Textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Write your article content here..."
                    rows={20}
                    className="font-mono"
                    required
                  />
                )}
              </CardContent>
            </Card>

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {/* Actions */}
            <div className="flex justify-end space-x-4">
              <Link href="/admin/dashboard">
                <Button variant="outline">Cancel</Button>
              </Link>
              <Button type="submit" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    {published ? 'Publish Article' : 'Save Draft'}
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>
      </main>
    </div>
  )
}