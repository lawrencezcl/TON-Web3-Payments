import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { QrCode } from "lucide-react";

export function PaymentQR({ merchantId, amount }: { merchantId: string; amount: string }) {
  return (
    <Card>
      <CardContent className="p-6 flex flex-col items-center">
        <div className="border-2 border-gray-200 p-4 rounded-lg mb-4">
          {/* QR code would be generated here */}
          <div className="bg-gray-800 w-48 h-48 flex items-center justify-center">
            <QrCode className="text-white w-32 h-32" />
          </div>
        </div>
        <p className="text-lg font-medium mb-2">Pay to: Merchant #{merchantId}</p>
        <p className="text-2xl font-bold text-primary mb-4">{amount} TON</p>
        <Button>Confirm Payment</Button>
      </CardContent>
    </Card>
  );
}