import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Dog, Check } from 'lucide-react';

export default function PetRideOptions({ enabled, onToggle, petConfig, setPetConfig }) {
  return (
    <Card className="border-0 shadow-sm">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Dog className="w-5 h-5 text-indigo-600" />
            <span className="font-semibold text-gray-900">Traveling with Pet</span>
          </div>
          <Button
            variant={enabled ? "default" : "outline"}
            size="sm"
            onClick={() => onToggle(!enabled)}
            className="rounded-lg"
          >
            {enabled ? <Check className="w-4 h-4 mr-1" /> : null}
            {enabled ? 'Added' : 'Add Pet'}
          </Button>
        </div>

        {enabled && (
          <div className="grid grid-cols-2 gap-3 mt-3">
            <Select value={petConfig.type} onValueChange={(v) => setPetConfig({...petConfig, type: v})}>
              <SelectTrigger className="rounded-lg">
                <SelectValue placeholder="Pet Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="dog">Dog</SelectItem>
                <SelectItem value="cat">Cat</SelectItem>
                <SelectItem value="bird">Bird</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>

            <Select value={petConfig.size} onValueChange={(v) => setPetConfig({...petConfig, size: v})}>
              <SelectTrigger className="rounded-lg">
                <SelectValue placeholder="Size" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="small">Small</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="large">Large</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}

        {enabled && (
          <p className="text-xs text-gray-600 mt-2">
            You'll be matched with pet-certified drivers
          </p>
        )}
      </CardContent>
    </Card>
  );
}