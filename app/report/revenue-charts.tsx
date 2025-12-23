"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip } from "@/components/ui/chart";
import { BarChart3, Building2, Globe, PieChart } from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart as RechartsPieChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";

interface RevenueChartsProps {
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

const DivisionTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-lg">
        <p className="font-semibold text-gray-900 mb-2">{data.division}</p>
        <div className="space-y-1">
          <p className="text-sm">
            <span className="font-medium">Revenue:</span> $
            {data.revenue_usd_million?.toLocaleString()}M
          </p>
          <p className="text-sm">
            <span className="font-medium">Share:</span>{" "}
            {data.percentage_of_total}%
          </p>
          <p className="text-sm">
            <span className="font-medium">Type:</span> {data.division_type}
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

export default function RevenueCharts({ data }: RevenueChartsProps) {
  // Process revenue breakdown data
  const segmentData =
    data.revenue_by_segment?.map((segment: any, index: number) => ({
      segment: segment.segment,
      revenue_usd_million: segment.revenue_usd_million,
      percentage_of_total: segment.percentage_of_total,
      color: COLORS[index % COLORS.length],
    })) || [];

  const divisionData =
    data.revenue_by_division?.map((division: any, index: number) => ({
      division: division.division,
      division_type: division.division_type,
      revenue_usd_million: division.revenue_usd_million,
      percentage_of_total: division.percentage_of_total,
      color: COLORS[index % COLORS.length],
    })) || [];

  // Process geographic data from segments
  const geographicData: any[] = [];
  data.revenue_by_segment?.forEach((segment: any) => {
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

  return (
    <div className="space-y-8">
      {/* Revenue Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pdf-avoid-break">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 pdf-avoid-break">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-blue-700 flex items-center gap-2">
              <Building2 className="h-4 w-4" />
              Total Revenue ({data.fiscal_year})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-900">
              ${(data.total_group_revenue_usd_million / 1000).toFixed(1)}B
            </div>
            <div className="text-sm text-gray-600 mt-1">Group Revenue</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200 pdf-avoid-break">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-green-700 flex items-center gap-2">
              <PieChart className="h-4 w-4" />
              Business Segments
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-900">
              {segmentData.length}
            </div>
            <div className="text-sm text-gray-600 mt-1">Active Segments</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 pdf-avoid-break">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-purple-700 flex items-center gap-2">
              <Globe className="h-4 w-4" />
              Geographic Regions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-900">
              {geographicData.length}
            </div>
            <div className="text-sm text-gray-600 mt-1">Active Regions</div>
          </CardContent>
        </Card>
      </div>

      {/* Revenue by Segment */}
      {segmentData.length > 0 && (
        <Card className="pdf-avoid-break pdf-chart-container" style={{ pageBreakInside: 'avoid', breakInside: 'avoid' }}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChart className="h-5 w-5 text-indigo-600" />
              Revenue by Business Segment ({data.fiscal_year})
            </CardTitle>
            <p className="text-sm text-gray-600">
              Revenue distribution across primary business segments showing
              market focus and diversification
            </p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Segment Pie Chart */}
              <div>
                <h4 className="font-semibold mb-4 text-center">
                  Segment Distribution
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
                        isAnimationActive={false}
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

              {/* Segment Details */}
              <div>
                <h4 className="font-semibold mb-4 text-center">
                  Segment Performance
                </h4>
                <div className="space-y-4">
                  {segmentData.map((segment: any, index: number) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className="w-4 h-4 rounded-full"
                          style={{ backgroundColor: segment.color }}
                        />
                        <span className="font-medium text-sm">
                          {segment.segment}
                        </span>
                      </div>
                      <div className="text-right">
                        <div className="font-bold">
                          ${(segment.revenue_usd_million / 1000).toFixed(1)}B
                        </div>
                        <div className="text-sm text-gray-600">
                          {segment.percentage_of_total}%
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

      {/* Revenue by Division */}
      {divisionData.length > 0 && (
        <Card className="pdf-avoid-break pdf-chart-container" style={{ pageBreakInside: 'avoid', breakInside: 'avoid' }}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-blue-600" />
              Revenue by Division ({data.fiscal_year})
            </CardTitle>
            <p className="text-sm text-gray-600">
              Detailed breakdown of revenue by operational divisions showing
              business unit performance
            </p>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                revenue: { label: "Revenue", color: "hsl(var(--chart-1))" },
              }}
              className="h-[400px] w-full"
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={divisionData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="division"
                    angle={-45}
                    textAnchor="end"
                    height={80}
                    interval={0}
                  />
                  <YAxis
                    tickFormatter={(value) => `$${(value / 1000).toFixed(0)}B`}
                  />
                  <ChartTooltip content={<DivisionTooltip />} />
                  <Bar
                    dataKey="revenue_usd_million"
                    fill="var(--color-revenue)"
                    name="Revenue"
                    radius={[4, 4, 0, 0]}
                    isAnimationActive={false}
                  />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      )}

      {/* Geographic Revenue Distribution */}
      {geographicData.length > 0 && (
        <Card className="pdf-avoid-break pdf-chart-container" style={{ pageBreakInside: 'avoid', breakInside: 'avoid' }}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5 text-teal-600" />
              Geographic Revenue Distribution ({data.fiscal_year})
            </CardTitle>
            <p className="text-sm text-gray-600">
              Regional breakdown of revenue showing global market presence and
              geographic diversification
            </p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-1 gap-8">
              {/* Geographic Bar Chart */}
              <div>
                <h4 className="font-semibold mb-4 text-center">
                  Revenue by Region
                </h4>
                <ChartContainer
                  config={{
                    revenue: { label: "Revenue", color: "hsl(var(--chart-2))" },
                  }}
                  className="h-[300px] w-full"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={geographicData}
                      margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="region" />
                      <YAxis
                        tickFormatter={(value) =>
                          `$${(value / 1000).toFixed(0)}B`
                        }
                      />
                      <ChartTooltip content={<GeographicTooltip />} />
                      <Bar
                        dataKey="revenue_usd_million"
                        fill="var(--color-revenue)"
                        name="Revenue"
                        radius={[4, 4, 0, 0]}
                        isAnimationActive={false}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </div>

              {/* Geographic Details */}
              <div>
                <h4 className="font-semibold mb-4 text-center">
                  Regional Performance
                </h4>
                <div className="space-y-4">
                  {geographicData.map((region: any, index: number) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-4 h-4 rounded-full bg-teal-500" />
                        <span className="font-medium text-sm">
                          {region.region}
                        </span>
                      </div>
                      <div className="text-right">
                        <div className="font-bold">
                          ${(region.revenue_usd_million / 1000).toFixed(1)}B
                        </div>
                        <div className="text-sm text-gray-600">
                          {region.percentage?.toFixed(1)}%
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

      {/* Revenue Summary Table */}
      <Card className="pdf-avoid-break" style={{ pageBreakInside: 'avoid', breakInside: 'avoid' }}>
        <CardHeader>
          <CardTitle>Revenue Breakdown Summary ({data.fiscal_year})</CardTitle>
          <p className="text-sm text-gray-600">
            Comprehensive overview of revenue distribution across segments,
            divisions, and regions
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
            {/* Segments Table */}
            <div>
              <h4 className="font-semibold mb-3">By Segment</h4>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-gray-300 text-sm">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="border border-gray-300 px-2 py-1 text-left">
                        Segment
                      </th>
                      <th className="border border-gray-300 px-2 py-1 text-right">
                        Revenue ($B)
                      </th>
                      <th className="border border-gray-300 px-2 py-1 text-right">
                        Share (%)
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {segmentData.map((segment: any, index: number) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="border border-gray-300 px-2 py-1 font-medium">
                          {segment.segment}
                        </td>
                        <td className="border border-gray-300 px-2 py-1 text-right">
                          {(segment.revenue_usd_million / 1000).toFixed(1)}
                        </td>
                        <td className="border border-gray-300 px-2 py-1 text-right">
                          {segment.percentage_of_total}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Divisions Table */}
            <div>
              <h4 className="font-semibold mb-3">By Division</h4>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-gray-300 text-sm">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="border border-gray-300 px-2 py-1 text-left">
                        Division
                      </th>
                      <th className="border border-gray-300 px-2 py-1 text-right">
                        Revenue ($B)
                      </th>
                      <th className="border border-gray-300 px-2 py-1 text-right">
                        Share (%)
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {divisionData.map((division: any, index: number) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="border border-gray-300 px-2 py-1 font-medium">
                          {division.division}
                        </td>
                        <td className="border border-gray-300 px-2 py-1 text-right">
                          {(division.revenue_usd_million / 1000).toFixed(1)}
                        </td>
                        <td className="border border-gray-300 px-2 py-1 text-right">
                          {division.percentage_of_total}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Geographic Table */}
            <div>
              <h4 className="font-semibold mb-3">By Region</h4>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-gray-300 text-sm">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="border border-gray-300 px-2 py-1 text-left">
                        Region
                      </th>
                      <th className="border border-gray-300 px-2 py-1 text-right">
                        Revenue ($B)
                      </th>
                      <th className="border border-gray-300 px-2 py-1 text-right">
                        Share (%)
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {geographicData.map((region: any, index: number) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="border border-gray-300 px-2 py-1 font-medium">
                          {region.region}
                        </td>
                        <td className="border border-gray-300 px-2 py-1 text-right">
                          {(region.revenue_usd_million / 1000).toFixed(1)}
                        </td>
                        <td className="border border-gray-300 px-2 py-1 text-right">
                          {region.percentage?.toFixed(1)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
