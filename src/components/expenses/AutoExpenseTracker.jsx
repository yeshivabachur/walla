import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Receipt, Upload } from 'lucide-react';
import { toast } from 'sonner';

export default function AutoExpenseTracker({ driverEmail }) {
  const queryClient = useQueryClient();
  const [expense, setExpense] = useState({
    type: 'fuel',
    amount: '',
    description: ''
  });

  const addMutation = useMutation({
    mutationFn: async (data) => {
      return await base44.entities.ExpenseLog.create(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['expenses']);
      setExpense({ type: 'fuel', amount: '', description: '' });
      toast.success('Expense logged!');
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    addMutation.mutate({
      driver_email: driverEmail,
      expense_type: expense.type,
      amount: parseFloat(expense.amount),
      date: new Date().toISOString().split('T')[0],
      description: expense.description,
      vehicle_id: driverEmail
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Receipt className="w-5 h-5" />
          Quick Expense Log
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-3">
          <Select value={expense.type} onValueChange={(v) => setExpense({...expense, type: v})}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="fuel">⛽ Fuel</SelectItem>
              <SelectItem value="maintenance">🔧 Maintenance</SelectItem>
              <SelectItem value="tolls">🛣️ Tolls</SelectItem>
              <SelectItem value="parking">🅿️ Parking</SelectItem>
            </SelectContent>
          </Select>
          <Input
            type="number"
            placeholder="Amount"
            value={expense.amount}
            onChange={(e) => setExpense({...expense, amount: e.target.value})}
          />
          <Input
            placeholder="Description (optional)"
            value={expense.description}
            onChange={(e) => setExpense({...expense, description: e.target.value})}
          />
          <Button type="submit" className="w-full" disabled={!expense.amount}>
            <Upload className="w-4 h-4 mr-2" />
            Log Expense
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}