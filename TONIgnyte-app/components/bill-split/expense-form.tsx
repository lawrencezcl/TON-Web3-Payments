// components/bill-split/expense-form.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { 
  Form, 
  FormControl, 
  FormDescription, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useState } from "react";
import { useWallet } from "@/components/providers/wallet-provider";

const formSchema = z.object({
  description: z.string().min(2, {
    message: "Description must be at least 2 characters.",
  }),
  amount: z.string().refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) > 0, {
    message: "Amount must be a positive number.",
  }),
});

// Category options
const CATEGORIES = [
  'Food', 'Transport', 'Shopping', 'Entertainment', 'Travel', 'Other'
];

export function ExpenseForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      description: "",
      amount: "",
    },
  });

  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [participants, setParticipants] = useState([
    { id: 1, name: 'Alice' },
    { id: 2, name: 'Bob' }
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { connected } = useWallet();

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!connected) {
      setError("Please connect your wallet first");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      // Call the API to create the expense
      const response = await fetch('/api/splits/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          telegramId: 'user123', // In a real app, this would come from the user session
          description: values.description,
          amount: parseFloat(values.amount),
          participantTelegramIds: participants.map(p => p.name),
          category: selectedCategory
        })
      });

      if (!response.ok) {
        throw new Error('Failed to create expense');
      }

      // Reset the form
      form.reset();
      setSelectedCategory(null);
      
      // In a real app, we would refresh the expense list
      console.log('Expense created successfully');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  const addParticipant = () => {
    const newId = Math.max(...participants.map(p => p.id)) + 1;
    setParticipants([...participants, { id: newId, name: `Participant ${newId}` }]);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add New Expense</CardTitle>
      </CardHeader>
      <CardContent>
        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
            {error}
          </div>
        )}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Input placeholder="Dinner at Italian restaurant" {...field} />
                  </FormControl>
                  <FormDescription>
                    Enter a brief description of the expense
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Amount</FormLabel>
                  <FormControl>
                    <Input type="number" step="0.01" placeholder="0.00" {...field} />
                  </FormControl>
                  <FormDescription>
                    Enter the total amount in TON
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="space-y-2">
              <Label>Category</Label>
              <div className="flex flex-wrap gap-2">
                {CATEGORIES.map(category => (
                  <Badge
                    key={category}
                    variant={selectedCategory === category ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => setSelectedCategory(selectedCategory === category ? null : category)}
                  >
                    {category}
                  </Badge>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <Label>Participants</Label>
              <div className="flex flex-wrap gap-2">
                {participants.map(participant => (
                  <Badge key={participant.id} variant="secondary">
                    {participant.name}
                  </Badge>
                ))}
                <Badge variant="outline" className="cursor-pointer" onClick={addParticipant}>
                  + Add
                </Badge>
              </div>
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Adding Expense...' : 'Add Expense'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}