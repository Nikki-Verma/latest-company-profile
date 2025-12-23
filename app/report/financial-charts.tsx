"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip } from "@/components/ui/chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  BarChart3,
  DollarSign,
  Eye,
  Globe,
  PieChart,
  Table,
  Target,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import { useState } from "react";
import ReactMarkdown from "react-markdown";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart as RechartsPieChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";

interface FinancialChartsProps {
  data: any;
}

const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#8884D8",
  "#82CA9D",
  "#FFC658",
  "#FF7C7C",
];

// Enhanced tooltip components
const RevenueTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-lg">
        <p className="font-semibold text-gray-900 mb-2">{`Year: ${label}`}</p>
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex items-center gap-2 mb-1">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-sm font-medium">{entry.name}:</span>
            <span className="text-sm font-bold" style={{ color: entry.color }}>
              ${entry.value?.toLocaleString() || 0}B
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

const RatioTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-lg">
        <p className="font-semibold text-gray-900 mb-2">{`Year: ${label}`}</p>
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex items-center gap-2 mb-1">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-sm font-medium">{entry.name}:</span>
            <span className="text-sm font-bold" style={{ color: entry.color }}>
              {entry.dataKey.includes("margin") ||
              entry.dataKey.includes("roa") ||
              entry.dataKey.includes("roe")
                ? `${entry.value?.toFixed(1) || 0}%`
                : entry.value?.toFixed(1) || 0}
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

const SegmentTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-lg">
        <p className="font-semibold text-gray-900 mb-2">{data.segment}</p>
        <div className="space-y-1">
          <p className="text-sm">
            <span className="font-medium">Revenue:</span> $
            {data.revenue_usd_million?.toLocaleString()}M
          </p>
          <p className="text-sm">
            <span className="font-medium">Share:</span>{" "}
            {data.percentage_of_total}%
          </p>
        </div>
      </div>
    );
  }
  return null;
};

const GeographicTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-lg">
        <p className="font-semibold text-gray-900 mb-2">{label}</p>
        <div className="space-y-1">
          <p className="text-sm">
            <span className="font-medium">Revenue:</span> $
            {payload[0].value?.toLocaleString()}M
          </p>
          <p className="text-sm">
            <span className="font-medium">Share:</span>{" "}
            {payload[0].payload.percentage?.toFixed(1)}%
          </p>
        </div>
      </div>
    );
  }
  return null;
};

export default function FinancialCharts({ data }: FinancialChartsProps) {
  const [showTable, setShowTable] = useState(false);
  const [hoveredLegend, setHoveredLegend] = useState<string | null>(null);
  const [selectedMetrics, setSelectedMetrics] = useState<string[]>([
    "revenue",
    "profit",
    "operating_income",
    "ebitda",
  ]);

  // Process financial data
  const financialData = [];
  const years = data.revenue?.map((item: any) => item.year) || [];

  for (const year of years) {
    const yearData: any = { year };

    // Revenue data
    const revenueItem = data.revenue?.find((item: any) => item.year === year);
    if (revenueItem) yearData.revenue = revenueItem.value;

    // Profit data
    const profitItem = data.profit?.find((item: any) => item.year === year);
    if (profitItem) yearData.profit = profitItem.value;

    // Operating income
    const opIncomeItem = data.operating_income?.find(
      (item: any) => item.year === year,
    );
    if (opIncomeItem) yearData.operating_income = opIncomeItem.value;

    // Net income
    const netIncomeItem = data.net_income?.find(
      (item: any) => item.year === year,
    );
    if (netIncomeItem) yearData.net_income = netIncomeItem.value;

    // EBITDA
    const ebitdaItem = data.EBITDA?.find((item: any) => item.year === year);
    if (ebitdaItem) yearData.ebitda = ebitdaItem.value;

    // Margins and ratios
    const marginItem = data.EBITDA_margin?.find(
      (item: any) => item.year === year,
    );
    if (marginItem) yearData.ebitda_margin = marginItem.value;

    const roaItem = data.ROA?.find((item: any) => item.year === year);
    if (roaItem) yearData.roa = roaItem.value;

    const roeItem = data.ROE?.find((item: any) => item.year === year);
    if (roeItem) yearData.roe = roeItem.value;

    const debtItem = data.Debt_to_Equity_ratio?.find(
      (item: any) => item.year === year,
    );
    if (debtItem) yearData.debt_equity = debtItem.value;

    financialData.push(yearData);
  }

  // Process revenue breakdown data
  const revenueBreakdown = data.Revenue_Breakdown || {};
  const segmentData =
    revenueBreakdown.revenue_by_segment?.map((segment: any, index: number) => ({
      segment: segment.segment,
      revenue_usd_million: segment.revenue_usd_million,
      percentage_of_total: segment.percentage_of_total,
      color: COLORS[index % COLORS.length],
    })) || [];

  const divisionData =
    revenueBreakdown.revenue_by_division?.map(
      (division: any, index: number) => ({
        division: division.division,
        division_type: division.division_type,
        revenue_usd_million: division.revenue_usd_million,
        percentage_of_total: division.percentage_of_total,
        color: COLORS[index % COLORS.length],
      }),
    ) || [];

  // Process geographic data from segments
  const geographicData: any[] = [];
  revenueBreakdown.revenue_by_segment?.forEach((segment: any) => {
    segment.geography_breakdown?.forEach((geo: any) => {
      const existing = geographicData.find(
        (item) => item.region === geo.region,
      );
      if (existing) {
        existing.revenue_usd_million += geo.revenue_usd_million;
        existing.percentage += geo.percentage_of_total;
      } else {
        geographicData.push({
          region: geo.region,
          revenue_usd_million: geo.revenue_usd_million,
          percentage: geo.percentage_of_total,
        });
      }
    });
  });

  // Sort geographic data by revenue
  geographicData.sort((a, b) => b.revenue_usd_million - a.revenue_usd_million);

  // Calculate trends
  const calculateTrend = (dataArray: any[], key: string) => {
    if (!dataArray || dataArray.length < 2) return 0;
    const latest = dataArray[dataArray.length - 1]?.[key] || 0;
    const previous = dataArray[dataArray.length - 2]?.[key] || 0;
    return previous !== 0 ? ((latest - previous) / previous) * 100 : 0;
  };

  const revenueTrend = calculateTrend(financialData, "revenue");
  const profitTrend = calculateTrend(financialData, "profit");
  const ebitdaTrend = calculateTrend(financialData, "ebitda");
  const roeTrend = calculateTrend(financialData, "roe");

  // Custom Legend component with hover functionality that fits within chart
  const CustomLegend = ({ payload, onMouseEnter, onMouseLeave }: any) => (
    <div className="flex flex-wrap justify-center gap-2 px-2 py-2 bg-gray-50 rounded-lg mx-2 mb-2 max-w-full overflow-hidden">
      {payload.map((entry: any, index: number) => (
        <div
          key={index}
          className="flex items-center gap-1 cursor-pointer hover:bg-white px-2 py-1 rounded text-xs flex-shrink-0"
          onMouseEnter={() => onMouseEnter(entry.dataKey)}
          onMouseLeave={() => onMouseLeave()}
        >
          <div
            className="w-2 h-2 rounded-full flex-shrink-0"
            style={{ backgroundColor: entry.color }}
          />
          <span className="font-medium whitespace-nowrap text-xs">
            {entry.value}
          </span>
        </div>
      ))}
    </div>
  );

  if (showTable) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">Financial Data Tables</h3>
          <Button
            onClick={() => setShowTable(false)}
            variant="outline"
            size="sm"
          >
            <Eye className="h-4 w-4 mr-2" />
            View Visualizations
          </Button>
        </div>

        {/* Financial Performance Table */}
        <Card>
          <CardHeader>
            <CardTitle>Financial Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="border border-gray-300 px-4 py-2 text-left">
                      Year
                    </th>
                    <th className="border border-gray-300 px-4 py-2 text-right">
                      Revenue ($B)
                    </th>
                    <th className="border border-gray-300 px-4 py-2 text-right">
                      Net Profit ($B)
                    </th>
                    <th className="border border-gray-300 px-4 py-2 text-right">
                      Operating Income ($B)
                    </th>
                    <th className="border border-gray-300 px-4 py-2 text-right">
                      EBITDA ($B)
                    </th>
                    <th className="border border-gray-300 px-4 py-2 text-right">
                      EBITDA Margin (%)
                    </th>
                    <th className="border border-gray-300 px-4 py-2 text-right">
                      ROA (%)
                    </th>
                    <th className="border border-gray-300 px-4 py-2 text-right">
                      ROE (%)
                    </th>
                    <th className="border border-gray-300 px-4 py-2 text-right">
                      Debt/Equity
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {financialData.map((row, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="border border-gray-300 px-4 py-2 font-medium">
                        {row.year}
                      </td>
                      <td className="border border-gray-300 px-4 py-2 text-right">
                        {row.revenue?.toLocaleString() || "N/A"}
                      </td>
                      <td className="border border-gray-300 px-4 py-2 text-right">
                        {row.profit?.toLocaleString() || "N/A"}
                      </td>
                      <td className="border border-gray-300 px-4 py-2 text-right">
                        {row.operating_income?.toLocaleString() || "N/A"}
                      </td>
                      <td className="border border-gray-300 px-4 py-2 text-right">
                        {row.ebitda?.toLocaleString() || "N/A"}
                      </td>
                      <td className="border border-gray-300 px-4 py-2 text-right">
                        {row.ebitda_margin?.toFixed(1) || "N/A"}
                      </td>
                      <td className="border border-gray-300 px-4 py-2 text-right">
                        {row.roa?.toFixed(1) || "N/A"}
                      </td>
                      <td className="border border-gray-300 px-4 py-2 text-right">
                        {row.roe?.toFixed(1) || "N/A"}
                      </td>
                      <td className="border border-gray-300 px-4 py-2 text-right">
                        {row.debt_equity?.toFixed(1) || "N/A"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Revenue Breakdown Tables */}
        {segmentData.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>
                  Revenue by Segment ({revenueBreakdown.fiscal_year})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse border border-gray-300">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="border border-gray-300 px-4 py-2 text-left">
                          Segment
                        </th>
                        <th className="border border-gray-300 px-4 py-2 text-right">
                          Revenue ($M)
                        </th>
                        <th className="border border-gray-300 px-4 py-2 text-right">
                          Share (%)
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {segmentData.map((segment: any, index: number) => (
                        <tr key={index} className="hover:bg-gray-50">
                          <td className="border border-gray-300 px-4 py-2 font-medium">
                            {segment.segment}
                          </td>
                          <td className="border border-gray-300 px-4 py-2 text-right">
                            {segment.revenue_usd_million?.toLocaleString()}
                          </td>
                          <td className="border border-gray-300 px-4 py-2 text-right">
                            {segment.percentage_of_total}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>
                  Revenue by Division ({revenueBreakdown.fiscal_year})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse border border-gray-300">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="border border-gray-300 px-4 py-2 text-left">
                          Division
                        </th>
                        <th className="border border-gray-300 px-4 py-2 text-right">
                          Revenue ($M)
                        </th>
                        <th className="border border-gray-300 px-4 py-2 text-right">
                          Share (%)
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {divisionData.map((division: any, index: number) => (
                        <tr key={index} className="hover:bg-gray-50">
                          <td className="border border-gray-300 px-4 py-2 font-medium">
                            {division.division}
                          </td>
                          <td className="border border-gray-300 px-4 py-2 text-right">
                            {division.revenue_usd_million?.toLocaleString()}
                          </td>
                          <td className="border border-gray-300 px-4 py-2 text-right">
                            {division.percentage_of_total}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {geographicData.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>
                Revenue by Geographic Region ({revenueBreakdown.fiscal_year})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-gray-300">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="border border-gray-300 px-4 py-2 text-left">
                        Region
                      </th>
                      <th className="border border-gray-300 px-4 py-2 text-right">
                        Revenue ($M)
                      </th>
                      <th className="border border-gray-300 px-4 py-2 text-right">
                        Share (%)
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {geographicData.map((region: any, index: number) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="border border-gray-300 px-4 py-2 font-medium">
                          {region.region}
                        </td>
                        <td className="border border-gray-300 px-4 py-2 text-right">
                          {region.revenue_usd_million?.toLocaleString()}
                        </td>
                        <td className="border border-gray-300 px-4 py-2 text-right">
                          {region.percentage?.toFixed(1)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center pdf-avoid-break">
        <h3 className="text-lg font-semibold">
          Financial Performance Visualizations
        </h3>
        <Button onClick={() => setShowTable(true)} variant="outline" size="sm">
          <Table className="h-4 w-4 mr-2" />
          View Tables
        </Button>
      </div>

      {/* Key Performance Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pdf-avoid-break">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 pdf-avoid-break">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-blue-700 flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              Revenue (
              {financialData[financialData.length - 1]?.year || "Latest"})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-900">
              $
              {financialData[
                financialData.length - 1
              ]?.revenue?.toLocaleString() || "N/A"}
              B
            </div>
            <div className="flex items-center gap-1 text-sm mt-1">
              {revenueTrend >= 0 ? (
                <TrendingUp className="h-4 w-4 text-green-600" />
              ) : (
                <TrendingDown className="h-4 w-4 text-red-600" />
              )}
              <span
                className={
                  revenueTrend >= 0 ? "text-green-600" : "text-red-600"
                }
              >
                {Math.abs(revenueTrend).toFixed(1)}%
              </span>
              <span className="text-gray-500">vs prev year</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200 pdf-avoid-break">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-green-700 flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Net Profit (
              {financialData[financialData.length - 1]?.year || "Latest"})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-900">
              $
              {financialData[
                financialData.length - 1
              ]?.profit?.toLocaleString() || "N/A"}
              B
            </div>
            <div className="flex items-center gap-1 text-sm mt-1">
              {profitTrend >= 0 ? (
                <TrendingUp className="h-4 w-4 text-green-600" />
              ) : (
                <TrendingDown className="h-4 w-4 text-red-600" />
              )}
              <span
                className={profitTrend >= 0 ? "text-green-600" : "text-red-600"}
              >
                {Math.abs(profitTrend).toFixed(1)}%
              </span>
              <span className="text-gray-500">vs prev year</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 pdf-avoid-break">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-purple-700 flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              EBITDA (
              {financialData[financialData.length - 1]?.year || "Latest"})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-900">
              $
              {financialData[
                financialData.length - 1
              ]?.ebitda?.toLocaleString() || "N/A"}
              B
            </div>
            <div className="flex items-center gap-1 text-sm mt-1">
              {ebitdaTrend >= 0 ? (
                <TrendingUp className="h-4 w-4 text-green-600" />
              ) : (
                <TrendingDown className="h-4 w-4 text-red-600" />
              )}
              <span
                className={ebitdaTrend >= 0 ? "text-green-600" : "text-red-600"}
              >
                {Math.abs(ebitdaTrend).toFixed(1)}%
              </span>
              <span className="text-gray-500">vs prev year</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200 pdf-avoid-break">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-orange-700 flex items-center gap-2">
              <Target className="h-4 w-4" />
              ROE ({financialData[financialData.length - 1]?.year || "Latest"})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-900">
              {financialData[financialData.length - 1]?.roe?.toFixed(1) ||
                "N/A"}
              %
            </div>
            <div className="flex items-center gap-1 text-sm mt-1">
              {roeTrend >= 0 ? (
                <TrendingUp className="h-4 w-4 text-green-600" />
              ) : (
                <TrendingDown className="h-4 w-4 text-red-600" />
              )}
              <span
                className={roeTrend >= 0 ? "text-green-600" : "text-red-600"}
              >
                {Math.abs(roeTrend).toFixed(1)}pp
              </span>
              <span className="text-gray-500">vs prev year</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Revenue and Profitability Trends with Dropdown */}
      <Card className="pdf-avoid-break pdf-chart-container" style={{ pageBreakInside: 'avoid', breakInside: 'avoid' }}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-blue-600" />
                Revenue & Profitability Performance
              </CardTitle>
              <p className="text-sm text-gray-600 mt-1">
                Select specific metrics to analyze trends with optimized scaling
                for better readability
              </p>
            </div>
            <div className="w-64">
              <Select
                value={
                  selectedMetrics.length === 4 ? "all" : selectedMetrics[0]
                }
                onValueChange={(value) => {
                  if (value === "all") {
                    setSelectedMetrics([
                      "revenue",
                      "profit",
                      "operating_income",
                      "ebitda",
                    ]);
                  } else {
                    setSelectedMetrics([value]);
                  }
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select metrics to display" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Metrics</SelectItem>
                  <SelectItem value="revenue">Revenue Trend</SelectItem>
                  <SelectItem value="profit">Profit Trend</SelectItem>
                  <SelectItem value="operating_income">
                    Operating Income Trend
                  </SelectItem>
                  <SelectItem value="ebitda">EBITDA Trend</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={{
              revenue: { label: "Revenue", color: "hsl(var(--chart-1))" },
              profit: { label: "Net Profit", color: "hsl(var(--chart-2))" },
              operating_income: {
                label: "Operating Income",
                color: "hsl(var(--chart-3))",
              },
              ebitda: { label: "EBITDA", color: "hsl(var(--chart-4))" },
            }}
            className="h-[450px] w-full"
          >
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={financialData}
                margin={{ top: 20, right: 20, left: 20, bottom: 60 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="year" />
                <YAxis
                  tickFormatter={(value) => `$${value}B`}
                  domain={
                    selectedMetrics.length === 1
                      ? ["dataMin - 1", "dataMax + 1"]
                      : ["dataMin - 5", "dataMax + 5"]
                  }
                />
                <ChartTooltip content={<RevenueTooltip />} />

                {selectedMetrics.includes("revenue") && (
                  <Line
                    type="monotone"
                    isAnimationActive={false}
                    dataKey="revenue"
                    stroke="var(--color-revenue)"
                    strokeWidth={
                      hoveredLegend === "revenue" || !hoveredLegend ? 4 : 2
                    }
                    strokeOpacity={
                      hoveredLegend === "revenue" || !hoveredLegend ? 1 : 0.3
                    }
                    name="Revenue"
                    dot={{
                      r: 6,
                      fill: "var(--color-revenue)",
                      strokeWidth: 2,
                      stroke: "#fff",
                    }}
                    activeDot={{
                      r: 8,
                      stroke: "var(--color-revenue)",
                      strokeWidth: 3,
                      fill: "var(--color-revenue)",
                    }}
                  />
                )}

                {selectedMetrics.includes("profit") && (
                  <Line
                    type="monotone"
                    isAnimationActive={false}
                    dataKey="profit"
                    stroke="var(--color-profit)"
                    strokeWidth={
                      hoveredLegend === "profit" || !hoveredLegend ? 4 : 2
                    }
                    strokeOpacity={
                      hoveredLegend === "profit" || !hoveredLegend ? 1 : 0.3
                    }
                    name="Net Profit"
                    dot={{
                      r: 6,
                      fill: "var(--color-profit)",
                      strokeWidth: 2,
                      stroke: "#fff",
                    }}
                    activeDot={{
                      r: 8,
                      stroke: "var(--color-profit)",
                      strokeWidth: 3,
                      fill: "var(--color-profit)",
                    }}
                  />
                )}

                {selectedMetrics.includes("operating_income") && (
                  <Line
                    isAnimationActive={false}
                    type="monotone"
                    dataKey="operating_income"
                    stroke="var(--color-operating_income)"
                    strokeWidth={
                      hoveredLegend === "operating_income" || !hoveredLegend
                        ? 4
                        : 2
                    }
                    strokeOpacity={
                      hoveredLegend === "operating_income" || !hoveredLegend
                        ? 1
                        : 0.3
                    }
                    name="Operating Income"
                    dot={{
                      r: 6,
                      fill: "var(--color-operating_income)",
                      strokeWidth: 2,
                      stroke: "#fff",
                    }}
                    activeDot={{
                      r: 8,
                      stroke: "var(--color-operating_income)",
                      strokeWidth: 3,
                      fill: "var(--color-operating_income)",
                    }}
                  />
                )}

                {selectedMetrics.includes("ebitda") && (
                  <Line
                    isAnimationActive={false}
                    type="monotone"
                    dataKey="ebitda"
                    stroke="var(--color-ebitda)"
                    strokeWidth={
                      hoveredLegend === "ebitda" || !hoveredLegend ? 4 : 2
                    }
                    strokeOpacity={
                      hoveredLegend === "ebitda" || !hoveredLegend ? 1 : 0.3
                    }
                    name="EBITDA"
                    dot={{
                      r: 6,
                      fill: "var(--color-ebitda)",
                      strokeWidth: 2,
                      stroke: "#fff",
                    }}
                    activeDot={{
                      r: 8,
                      stroke: "var(--color-ebitda)",
                      strokeWidth: 3,
                      fill: "var(--color-ebitda)",
                    }}
                  />
                )}
              </LineChart>
            </ResponsiveContainer>
            <CustomLegend
              payload={selectedMetrics.map((metric) => ({
                dataKey: metric,
                value:
                  metric === "revenue"
                    ? "Revenue"
                    : metric === "profit"
                    ? "Net Profit"
                    : metric === "operating_income"
                    ? "Operating Income"
                    : "EBITDA",
                color: `var(--color-${metric})`,
              }))}
              onMouseEnter={setHoveredLegend}
              onMouseLeave={() => setHoveredLegend(null)}
            />
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Financial Ratios and Margins */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pdf-avoid-break" style={{ pageBreakInside: 'avoid', breakInside: 'avoid' }}>
        <Card className="pdf-avoid-break pdf-chart-container" style={{ pageBreakInside: 'avoid', breakInside: 'avoid' }}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-green-600" />
              Profitability Ratios
            </CardTitle>
            <p className="text-sm text-gray-600">
              Return on Assets (ROA), Return on Equity (ROE), and EBITDA margin
              trends showing operational efficiency and shareholder returns
            </p>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                roa: { label: "ROA", color: "hsl(var(--chart-1))" },
                roe: { label: "ROE", color: "hsl(var(--chart-2))" },
                ebitda_margin: {
                  label: "EBITDA Margin",
                  color: "hsl(var(--chart-3))",
                },
              }}
              className="h-[350px] w-full"
            >
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={financialData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 80 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="year" />
                  <YAxis tickFormatter={(value) => `${value}%`} />
                  <ChartTooltip content={<RatioTooltip />} />
                  <Line
                    isAnimationActive={false}
                    type="monotone"
                    dataKey="roa"
                    stroke="var(--color-roa)"
                    strokeWidth={
                      hoveredLegend === "roa" || !hoveredLegend ? 4 : 2
                    }
                    strokeOpacity={
                      hoveredLegend === "roa" || !hoveredLegend ? 1 : 0.3
                    }
                    name="ROA (%)"
                    dot={{
                      r: 6,
                      fill: "var(--color-roa)",
                      strokeWidth: 2,
                      stroke: "#fff",
                    }}
                    activeDot={{
                      r: 8,
                      stroke: "var(--color-roa)",
                      strokeWidth: 3,
                      fill: "var(--color-roa)",
                    }}
                  />
                  <Line
                    isAnimationActive={false}
                    type="monotone"
                    dataKey="roe"
                    stroke="var(--color-roe)"
                    strokeWidth={
                      hoveredLegend === "roe" || !hoveredLegend ? 4 : 2
                    }
                    strokeOpacity={
                      hoveredLegend === "roe" || !hoveredLegend ? 1 : 0.3
                    }
                    name="ROE (%)"
                    dot={{
                      r: 6,
                      fill: "var(--color-roe)",
                      strokeWidth: 2,
                      stroke: "#fff",
                    }}
                    activeDot={{
                      r: 8,
                      stroke: "var(--color-roe)",
                      strokeWidth: 3,
                      fill: "var(--color-roe)",
                    }}
                  />
                  <Line
                    isAnimationActive={false}
                    type="monotone"
                    dataKey="ebitda_margin"
                    stroke="var(--color-ebitda_margin)"
                    strokeWidth={
                      hoveredLegend === "ebitda_margin" || !hoveredLegend
                        ? 4
                        : 2
                    }
                    strokeOpacity={
                      hoveredLegend === "ebitda_margin" || !hoveredLegend
                        ? 1
                        : 0.3
                    }
                    name="EBITDA Margin (%)"
                    dot={{
                      r: 6,
                      fill: "var(--color-ebitda_margin)",
                      strokeWidth: 2,
                      stroke: "#fff",
                    }}
                    activeDot={{
                      r: 8,
                      stroke: "var(--color-ebitda_margin)",
                      strokeWidth: 3,
                      fill: "var(--color-ebitda_margin)",
                    }}
                  />
                </LineChart>
              </ResponsiveContainer>
              <CustomLegend
                payload={[
                  { dataKey: "roa", value: "ROA", color: "var(--color-roa)" },
                  { dataKey: "roe", value: "ROE", color: "var(--color-roe)" },
                  {
                    dataKey: "ebitda_margin",
                    value: "EBITDA Margin",
                    color: "var(--color-ebitda_margin)",
                  },
                ]}
                onMouseEnter={setHoveredLegend}
                onMouseLeave={() => setHoveredLegend(null)}
              />
            </ChartContainer>
          </CardContent>
        </Card>

        <Card className="pdf-avoid-break pdf-chart-container" style={{ pageBreakInside: 'avoid', breakInside: 'avoid' }}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-purple-600" />
              Financial Leverage
            </CardTitle>
            <p className="text-sm text-gray-600">
              Debt-to-Equity ratio progression showing the company's capital
              structure and financial risk management over time
            </p>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                debt_equity: {
                  label: "Debt/Equity Ratio",
                  color: "hsl(var(--chart-5))",
                },
              }}
              className="h-[300px] w-full"
            >
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={financialData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="year" />
                  <YAxis tickFormatter={(value) => `${value}x`} />
                  <ChartTooltip content={<RatioTooltip />} />
                  <Area
                    isAnimationActive={false}
                    type="monotone"
                    dataKey="debt_equity"
                    stroke="var(--color-debt_equity)"
                    fill="var(--color-debt_equity)"
                    fillOpacity={0.3}
                    strokeWidth={3}
                    name="Debt/Equity Ratio"
                    dot={{
                      r: 6,
                      fill: "var(--color-debt_equity)",
                      strokeWidth: 2,
                      stroke: "#fff",
                    }}
                    activeDot={{
                      r: 8,
                      stroke: "var(--color-debt_equity)",
                      strokeWidth: 3,
                      fill: "var(--color-debt_equity)",
                    }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* Business Segment Analysis */}
      {segmentData.length > 0 && (
        <Card className="pdf-avoid-break pdf-chart-container" style={{ pageBreakInside: 'avoid', breakInside: 'avoid' }}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChart className="h-5 w-5 text-indigo-600" />
              Business Segment Performance ({revenueBreakdown.fiscal_year})
            </CardTitle>
            <p className="text-sm text-gray-600">
              Revenue distribution across business segments with detailed
              breakdown by division
            </p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Segment Pie Chart */}
              <div>
                <h4 className="font-semibold mb-4 text-center">
                  Revenue by Segment
                </h4>
                <ChartContainer
                  config={{
                    segment: { label: "Revenue", color: "hsl(var(--chart-1))" },
                  }}
                  className="h-[300px] w-full"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsPieChart
                      margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
                    >
                      <Pie
                        data={segmentData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ segment, percentage_of_total }) =>
                          `${segment}: ${percentage_of_total}%`
                        }
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="revenue_usd_million"
                      >
                        {segmentData.map((entry: any, index: number) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <ChartTooltip content={<SegmentTooltip />} />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </div>

              {/* Division Breakdown */}
              <div>
                <h4 className="font-semibold mb-4 text-center">
                  Revenue by Division
                </h4>
                <div className="space-y-4">
                  {divisionData.map((division: any, index: number) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className="w-4 h-4 rounded-full"
                          style={{ backgroundColor: division.color }}
                        />
                        <span className="font-medium text-sm">
                          {division.division}
                        </span>
                      </div>
                      <div className="text-right">
                        <div className="font-bold">
                          ${(division.revenue_usd_million / 1000).toFixed(1)}B
                        </div>
                        <div className="text-sm text-gray-600">
                          {division.percentage_of_total}%
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Geographic Revenue Distribution */}
      {geographicData.length > 0 && (
        <Card className="pdf-avoid-break pdf-chart-container" style={{ pageBreakInside: 'avoid', breakInside: 'avoid' }}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5 text-teal-600" />
              Geographic Revenue Distribution ({revenueBreakdown.fiscal_year})
            </CardTitle>
            <p className="text-sm text-gray-600">
              Regional breakdown of revenue showing market presence across
              different geographic regions
            </p>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                revenue: { label: "Revenue", color: "hsl(var(--chart-2))" },
              }}
              className="h-[350px] w-full"
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={geographicData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="region" />
                  <YAxis
                    tickFormatter={(value) => `$${(value / 1000).toFixed(0)}B`}
                  />
                  <ChartTooltip content={<GeographicTooltip />} />
                  <Bar
                    dataKey="revenue_usd_million"
                    fill="var(--color-revenue)"
                    name="Revenue"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      )}

      {/* Financial Analysis Insights */}
      {data.Insights && (
        <Card className="bg-gradient-to-br from-gray-50 to-gray-100 border-gray-200 pdf-avoid-break">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-gray-700" />
              Financial Performance Analysis
            </CardTitle>
            <p className="text-sm text-gray-600">
              Expert analysis of financial trends, market conditions, and
              strategic implications based on the latest financial data
            </p>
          </CardHeader>
          <CardContent>
            <div className="prose prose-sm max-w-none">
              <ReactMarkdown
                components={{
                  p: ({ children }) => (
                    <p className="text-gray-700 leading-relaxed mb-3">
                      {children}
                    </p>
                  ),
                  strong: ({ children }) => (
                    <strong className="font-semibold text-gray-900">
                      {children}
                    </strong>
                  ),
                  ul: ({ children }) => (
                    <ul className="list-disc pl-5 mb-3 space-y-1 list-disc">
                      {children}
                    </ul>
                  ),
                  li: ({ children }) => (
                    <li className="text-gray-700">{children}</li>
                  ),
                  a: ({ children }) => (
                    <a className="italic underline text-blue-500">{children}</a>
                  ),
                }}
              >
                {data.Insights}
              </ReactMarkdown>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
