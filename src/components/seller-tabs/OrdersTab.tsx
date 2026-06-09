import { CheckCircle, Clock, XCircle } from "lucide-react";
import type { Order } from "@/lib/data";
import { Badge } from "@/components/ui/badge";

interface OrdersTabProps {
  orders: Order[];
}

const statusConfig = {
  completed: {
    icon: CheckCircle,
    color: "bg-emerald-50 text-emerald-700",
    label: "Completed",
  },
  pending: {
    icon: Clock,
    color: "bg-amber-50 text-amber-700",
    label: "Pending",
  },
  refunded: {
    icon: XCircle,
    color: "bg-red-50 text-red-700",
    label: "Refunded",
  },
};

export function OrdersTab({ orders }: OrdersTabProps) {
  return (
    <div className="rounded-xl border border-border overflow-hidden">
      <div className="overflow-x-auto">
        {orders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center bg-card">
            <p className="font-body text-sm font-medium text-foreground">
              No orders found
            </p>
            <p className="font-body text-xs text-muted-foreground mt-1">
              Transactions will display here once customers purchase your items.
            </p>
          </div>
        ) : (
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-border bg-muted/40">
                <th className="px-4 py-3 font-body text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Order ID
                </th>
                <th className="px-4 py-3 font-body text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Product
                </th>
                <th className="px-4 py-3 font-body text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Buyer
                </th>
                <th className="px-4 py-3 font-body text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Date
                </th>
                <th className="px-4 py-3 font-body text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-4 py-3 font-body text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => {
                const config = statusConfig[order.status];
                const StatusIcon = config.icon;
                return (
                  <tr
                    key={order.id}
                    className="border-b border-border last:border-0 hover:bg-muted/20 transition-colors"
                  >
                    <td className="px-4 py-3 font-body text-sm font-mono text-muted-foreground">
                      {order.id}
                    </td>
                    <td className="px-4 py-3 font-body text-sm text-foreground">
                      {order.productTitle}
                    </td>
                    <td className="px-4 py-3 font-body text-sm text-muted-foreground">
                      {order.buyer}
                    </td>
                    <td className="px-4 py-3 font-body text-sm text-muted-foreground">
                      {new Date(order.date).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 font-body text-sm font-medium text-foreground">
                      ${order.amount}
                    </td>
                    <td className="px-4 py-3">
                      <Badge
                        variant="secondary"
                        className={`${config.color} font-body text-xs gap-1`}
                      >
                        <StatusIcon className="h-3 w-3" />
                        {config.label}
                      </Badge>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

