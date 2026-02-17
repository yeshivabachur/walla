import React from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Briefcase, Download } from 'lucide-react';
import { toast } from 'sonner';

export default function CorporateExpenseTracker({ userEmail }) {
  const queryClient = useQueryClient();

  const { data: expenses = [] } = useQuery({
    queryKey: ['corporateExpenses', userEmail],
    queryFn: () => base44.entities.CorporateExpense.filter({ user_email: userEmail, exported: false })
  });

  const exportMutation = useMutation({
    mutationFn: async () => {
      const csv = expenses.map(e => 
        `${e.ride_request_id},${e.amount},${e.expense_category || 'Transportation'}`
      ).join('\n');
      
      for (const expense of expenses) {
        await base44.entities.CorporateExpense.update(expense.id, {
          exported: true,
          export_date: new Date().toISOString().split('T')[0]
        });
      }
      return csv;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['corporateExpenses']);
      toast.success('Expenses exported!');
    }
  });

  const total = expenses.reduce((sum, e) => sum + e.amount, 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-sm">
          <Briefcase className="w-4 h-4 text-indigo-600" />
          Corporate Expenses
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="bg-indigo-50 rounded p-3">
          <p className="text-xs text-gray-600">Total Pending</p>
          <p className="text-2xl font-bold text-indigo-600">${total.toFixed(2)}</p>
          <Badge>{expenses.length} rides</Badge>
        </div>
        <Button onClick={() => exportMutation.mutate()} disabled={expenses.length === 0} className="w-full" size="sm">
          <Download className="w-4 h-4 mr-2" />
          Export to CSV
        </Button>
      </CardContent>
    </Card>
  );
}