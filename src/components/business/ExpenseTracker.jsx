import React from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, Download, DollarSign } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';

export default function ExpenseTracker({ userEmail }) {
  const { data: expenses = [] } = useQuery({
    queryKey: ['businessExpenses', userEmail],
    queryFn: () => base44.entities.BusinessExpense.filter({ user_email: userEmail }, '-created_date', 50),
    enabled: !!userEmail
  });

  const exportMutation = useMutation({
    mutationFn: async () => {
      const unexported = expenses.filter(e => !e.exported);
      
      // Create CSV export
      const csvContent = [
        'Date,Category,Client,Amount,Notes',
        ...unexported.map(e => 
          `${format(new Date(e.created_date), 'yyyy-MM-dd')},${e.expense_category},${e.client_name || 'N/A'},${e.amount},${e.notes || ''}`
        )
      ].join('\n');

      // Mark as exported
      for (const expense of unexported) {
        await base44.entities.BusinessExpense.update(expense.id, {
          exported: true,
          export_date: new Date().toISOString()
        });
      }

      return csvContent;
    },
    onSuccess: (csvContent) => {
      // Download CSV
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `walla-expenses-${format(new Date(), 'yyyy-MM-dd')}.csv`;
      a.click();
      toast.success('Expenses exported!');
    }
  });

  const unexportedTotal = expenses
    .filter(e => !e.exported)
    .reduce((sum, e) => sum + e.amount, 0);

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-indigo-600" />
            Business Expenses
          </span>
          <Badge className="bg-indigo-600 text-white">
            ${unexportedTotal.toFixed(2)}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-4 text-center">
          <DollarSign className="w-8 h-8 text-indigo-600 mx-auto mb-2" />
          <p className="text-sm text-gray-600 mb-1">Unexported Expenses</p>
          <p className="text-3xl font-bold text-indigo-600">${unexportedTotal.toFixed(2)}</p>
        </div>

        <Button
          onClick={() => exportMutation.mutate()}
          disabled={unexportedTotal === 0 || exportMutation.isPending}
          className="w-full bg-indigo-600 hover:bg-indigo-700 rounded-xl h-12"
        >
          <Download className="w-4 h-4 mr-2" />
          Export to CSV
        </Button>

        <div className="space-y-2">
          <p className="text-sm font-semibold text-gray-900">Recent Expenses</p>
          {expenses.slice(0, 5).map((expense) => (
            <div key={expense.id} className="bg-gray-50 rounded-xl p-3">
              <div className="flex justify-between items-start mb-1">
                <span className="text-sm font-medium">{expense.expense_category}</span>
                <span className="font-semibold">${expense.amount}</span>
              </div>
              {expense.client_name && (
                <p className="text-xs text-gray-600">{expense.client_name}</p>
              )}
              <div className="flex justify-between items-center mt-2">
                <span className="text-xs text-gray-500">
                  {format(new Date(expense.created_date), 'MMM d, yyyy')}
                </span>
                {expense.exported && (
                  <Badge className="bg-green-100 text-green-800 text-xs">Exported</Badge>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}