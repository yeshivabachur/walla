import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Sparkles } from 'lucide-react';
import { toast } from 'sonner';

export default function SemanticLocationSearch({ onLocationSelect, userEmail }) {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!query.trim()) return;

    setLoading(true);
    try {
      const result = await base44.integrations.Core.InvokeLLM({
        prompt: `Interpret natural language location: "${query}"

Examples:
- "the Italian place near the park" → specific restaurant
- "my office" → work location
- "that coffee shop on Main Street" → specific cafe

Provide the actual address and confidence score.`,
        response_json_schema: {
          type: 'object',
          properties: {
            address: { type: 'string' },
            confidence: { type: 'number' },
            context: { type: 'string' }
          }
        }
      });

      await base44.entities.SemanticLocation.create({
        user_email: userEmail,
        natural_description: query,
        resolved_address: result.address,
        confidence_score: result.confidence,
        context: result.context
      });

      onLocationSelect(result.address);
      toast.success(`Found: ${result.address}`);
      setQuery('');
    } catch (error) {
      toast.error('Could not understand location');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex gap-2">
      <div className="relative flex-1">
        <Sparkles className="absolute left-3 top-3 w-4 h-4 text-purple-600" />
        <Input
          placeholder="Describe location naturally..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          className="pl-10"
        />
      </div>
      <Button onClick={handleSearch} disabled={loading}>
        <Search className="w-4 h-4" />
      </Button>
    </div>
  );
}