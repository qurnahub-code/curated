import { TrendingUp, DollarSign, ShoppingCart, Users } from "lucide-react";

interface AnalyticsTabProps {
  analytics: {
    totalRevenue: number;
    totalSales: number;
    avgOrderValue: number;
    conversionRate: number;
    monthlyRevenue: Array<{ month: string; revenue: number }>;
    topProducts: Array<{ name: string; sales: number; revenue: number }>;
    weeklyViews: Array<{ day: string; views: number }>;
  };
}

function StatCard({
  label,
  value,
  icon: Icon,
  change,
}: {
  label: string;
  value: string;
  icon: React.ComponentType<{ className?: string }>;
  change: string;
}) {
  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <div className="flex items-center justify-between">
        <p className="font-body text-sm text-muted-foreground">{label}</p>
        <div className="rounded-lg bg-primary/10 p-2">
          <Icon className="h-4 w-4 text-primary" />
        </div>
      </div>
      <p
        className="mt-2 text-2xl font-bold tracking-tight text-foreground"
        style={{ fontFamily: "var(--font-display)" }}
      >
        {value}
      </p>
      <p className="mt-1 font-body text-xs text-emerald-600">{change}</p>
    </div>
  );
}

export function AnalyticsTab({ analytics }: AnalyticsTabProps) {
  const maxRevenue = analytics.monthlyRevenue.length > 0 
    ? Math.max(...analytics.monthlyRevenue.map((m) => m.revenue)) 
    : 1;
  const maxViews = analytics.weeklyViews.length > 0 
    ? Math.max(...analytics.weeklyViews.map((v) => v.views)) 
    : 1;

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Total Revenue"
          value={`$${analytics.totalRevenue.toLocaleString()}`}
          icon={DollarSign}
          change="+12.5% from last month"
        />
        <StatCard
          label="Total Sales"
          value={analytics.totalSales.toString()}
          icon={ShoppingCart}
          change="+8.3% from last month"
        />
        <StatCard
          label="Avg Order Value"
          value={`$${analytics.avgOrderValue}`}
          icon={TrendingUp}
          change="+3.2% from last month"
        />
        <StatCard
          label="Conversion Rate"
          value={`${analytics.conversionRate}%`}
          icon={Users}
          change="+0.5% from last month"
        />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-border bg-card p-5">
          <h3
            className="text-lg font-semibold tracking-tight text-foreground"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Monthly Revenue
          </h3>
          <div className="mt-6 flex items-end gap-3 h-48">
            {analytics.monthlyRevenue.map((month) => (
              <div key={month.month} className="flex-1 flex flex-col items-center gap-2">
                <div
                  className="w-full rounded-t-md bg-primary/80 transition-all hover:bg-primary"
                  style={{
                    height: `${(month.revenue / maxRevenue) * 100}%`,
                    minHeight: "4px",
                  }}
                />
                <span className="font-body text-xs text-muted-foreground">
                  {month.month}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-5">
          <h3
            className="text-lg font-semibold tracking-tight text-foreground"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Weekly Page Views
          </h3>
          <div className="mt-6 flex items-end gap-3 h-48">
            {analytics.weeklyViews.map((day) => (
              <div key={day.day} className="flex-1 flex flex-col items-center gap-2">
                <div
                  className="w-full rounded-t-md bg-accent/80 transition-all hover:bg-accent"
                  style={{
                    height: `${(day.views / maxViews) * 100}%`,
                    minHeight: "4px",
                  }}
                />
                <span className="font-body text-xs text-muted-foreground">
                  {day.day}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card p-5">
        <h3
          className="text-lg font-semibold tracking-tight text-foreground"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Top Products
        </h3>
        <div className="mt-4 flex flex-col gap-3">
          {analytics.topProducts.length === 0 ? (
            <p className="font-body text-sm text-muted-foreground py-4 text-center">
              No sales data available.
            </p>
          ) : (
            analytics.topProducts.map((product, i) => (
              <div
                key={product.name}
                className="flex items-center gap-4 rounded-lg bg-muted/30 p-3"
              >
                <span
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 font-body text-sm font-bold text-primary"
                >
                  {i + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="font-body text-sm font-medium text-foreground truncate">
                    {product.name}
                  </p>
                  <p className="font-body text-xs text-muted-foreground">
                    {product.sales} sales
                  </p>
                </div>
                <span className="font-body text-sm font-bold text-primary">
                  ${product.revenue.toLocaleString()}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

