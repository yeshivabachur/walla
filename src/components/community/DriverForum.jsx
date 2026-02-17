import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MessageCircle, ThumbsUp } from 'lucide-react';
import { toast } from 'sonner';

export default function DriverForum({ driverEmail, driverName }) {
  const queryClient = useQueryClient();
  const [newPost, setNewPost] = useState({ title: '', content: '', category: 'tips' });

  const { data: posts = [] } = useQuery({
    queryKey: ['communityPosts'],
    queryFn: () => base44.entities.CommunityPost.list('-created_date', 20)
  });

  const createMutation = useMutation({
    mutationFn: async (data) => {
      return await base44.entities.CommunityPost.create(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['communityPosts']);
      setNewPost({ title: '', content: '', category: 'tips' });
      toast.success('Post shared!');
    }
  });

  const likeMutation = useMutation({
    mutationFn: async (post) => {
      await base44.entities.CommunityPost.update(post.id, { likes: post.likes + 1 });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['communityPosts']);
    }
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageCircle className="w-5 h-5 text-indigo-600" />
          Driver Community
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2 p-3 bg-gray-50 rounded-lg">
          <Input
            placeholder="Post title"
            value={newPost.title}
            onChange={(e) => setNewPost({...newPost, title: e.target.value})}
          />
          <Textarea
            placeholder="Share your tips, stories, or questions..."
            value={newPost.content}
            onChange={(e) => setNewPost({...newPost, content: e.target.value})}
            rows={3}
          />
          <div className="flex gap-2">
            <Select value={newPost.category} onValueChange={(v) => setNewPost({...newPost, category: v})}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="tips">💡 Tips</SelectItem>
                <SelectItem value="question">❓ Question</SelectItem>
                <SelectItem value="story">📖 Story</SelectItem>
              </SelectContent>
            </Select>
            <Button
              onClick={() => createMutation.mutate({
                author_email: driverEmail,
                author_name: driverName,
                ...newPost
              })}
              disabled={!newPost.title || !newPost.content}
            >
              Post
            </Button>
          </div>
        </div>

        <div className="space-y-2 max-h-96 overflow-y-auto">
          {posts.map(post => (
            <div key={post.id} className="bg-white border rounded-lg p-3">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h4 className="font-semibold">{post.title}</h4>
                  <p className="text-xs text-gray-500">by {post.author_name}</p>
                </div>
              </div>
              <p className="text-sm text-gray-700 mb-2">{post.content}</p>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => likeMutation.mutate(post)}
                >
                  <ThumbsUp className="w-3 h-3 mr-1" />
                  {post.likes}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}