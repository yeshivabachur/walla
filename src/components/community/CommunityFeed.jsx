import React from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart, MessageCircle, Users } from 'lucide-react';
import { motion } from 'framer-motion';

export default function CommunityFeed() {
  const { data: posts = [] } = useQuery({
    queryKey: ['communityPosts'],
    queryFn: () => base44.entities.CommunityBoard.list('-created_date', 10)
  });

  const categoryColors = {
    story: 'bg-purple-100 text-purple-800',
    tip: 'bg-green-100 text-green-800',
    question: 'bg-blue-100 text-blue-800',
    appreciation: 'bg-pink-100 text-pink-800',
    issue: 'bg-red-100 text-red-800'
  };

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="w-5 h-5 text-indigo-600" />
          Community Stories
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 max-h-96 overflow-y-auto">
        {posts.slice(0, 5).map((post, i) => (
          <motion.div
            key={post.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="bg-gray-50 rounded-xl p-4"
          >
            <div className="flex items-start justify-between mb-2">
              <div>
                <h4 className="font-semibold text-gray-900">{post.title}</h4>
                <Badge className={`${categoryColors[post.category]} text-xs mt-1`}>
                  {post.category}
                </Badge>
              </div>
              {post.featured && <Badge className="bg-yellow-500 text-white">Featured</Badge>}
            </div>
            <p className="text-sm text-gray-600 line-clamp-2">{post.content}</p>
            <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
              <span className="flex items-center gap-1">
                <Heart className="w-3 h-3" />
                {post.likes}
              </span>
              <span className="flex items-center gap-1">
                <MessageCircle className="w-3 h-3" />
                {post.comments?.length || 0}
              </span>
            </div>
          </motion.div>
        ))}
      </CardContent>
    </Card>
  );
}