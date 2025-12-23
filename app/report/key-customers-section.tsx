"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip } from "@/components/ui/chart";
import {
  BarChart3,
  Building2,
  ExternalLink,
  Globe,
  Handshake,
  PieChart,
  TrendingDown,
  Users,
} from "lucide-react";
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

interface KeyCustomersSectionProps {
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
  "#8DD1E1",
  "#D084D0",
];

const IndustryTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-lg">
        <p className="font-semibold text-gray-900 mb-2">{data.industry}</p>
        <div className="space-y-1">
          <p className="text-sm">
            <span className="font-medium">Customers:</span> {data.count}
          </p>
          <p className="text-sm">
            <span className="font-medium">Share:</span>{" "}
            {data.percentage.toFixed(1)}%
          </p>
        </div>
      </div>
    );
  }
  return null;
};

export default function KeyCustomersSection({
  data,
}: KeyCustomersSectionProps) {
  const customers = data.details || [];

  // Group customers by industry and calculate percentages
  const customersByIndustry = customers.reduce((acc: any, customer: any) => {
    const industry = customer.industry || "Other";
    if (!acc[industry]) {
      acc[industry] = [];
    }
    acc[industry].push(customer);
    return acc;
  }, {});

  // Create industry distribution data sorted by percentage (decreasing order)
  const industryDistribution = Object.keys(customersByIndustry)
    .map((industry) => ({
      industry,
      count: customersByIndustry[industry].length,
      percentage:
        (customersByIndustry[industry].length / customers.length) * 100,
      customers: customersByIndustry[industry],
      color:
        COLORS[
          Object.keys(customersByIndustry).indexOf(industry) % COLORS.length
        ],
    }))
    .sort((a, b) => b.percentage - a.percentage);

  const industries = industryDistribution.map((item) => item.industry);

  return (
    <div className="space-y-8">
      {/* Customer Portfolio Overview */}
      <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 border-blue-200 pdf-avoid-break">
        <CardHeader className="pb-4">
          <CardTitle className="text-2xl font-bold text-blue-900 flex items-center gap-3">
            <Handshake className="h-7 w-7" />
            Strategic Customer Portfolio
          </CardTitle>
          <p className="text-blue-700 text-lg">
            Comprehensive overview of key client relationships and industry
            partnerships
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center p-6 bg-white/70 rounded-xl shadow-sm">
              <div className="text-3xl font-bold text-blue-900 mb-2">
                {customers.length}
              </div>
              <div className="text-sm font-medium text-blue-700">
                Total Key Customers
              </div>
            </div>
            <div className="text-center p-6 bg-white/70 rounded-xl shadow-sm">
              <div className="text-3xl font-bold text-blue-900 mb-2">
                {industries.length}
              </div>
              <div className="text-sm font-medium text-blue-700">
                Industry Verticals
              </div>
            </div>
            <div className="text-center p-6 bg-white/70 rounded-xl shadow-sm">
              <div className="text-3xl font-bold text-blue-900 mb-2">
                {industryDistribution[0]?.percentage.toFixed(1)}%
              </div>
              <div className="text-sm font-medium text-blue-700">
                Top Industry Share
              </div>
            </div>
            <div className="text-center p-6 bg-white/70 rounded-xl shadow-sm">
              <div className="text-3xl font-bold text-blue-900 mb-2">
                Global
              </div>
              <div className="text-sm font-medium text-blue-700">
                Market Presence
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Industry Distribution Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pdf-avoid-break" style={{ pageBreakInside: 'avoid', breakInside: 'avoid' }}>
        {/* Industry Distribution Chart */}
        <Card className="pdf-avoid-break pdf-chart-container" style={{ pageBreakInside: 'avoid', breakInside: 'avoid' }}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChart className="h-5 w-5 text-purple-600" />
              Customer Distribution by Industry
            </CardTitle>
            <p className="text-sm text-gray-600">
              Market diversification across {industries.length} industry
              verticals
            </p>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                customers: { label: "Customers", color: "hsl(var(--chart-1))" },
              }}
              className="h-[300px] w-full"
            >
              <ResponsiveContainer width="100%" height="100%">
                <RechartsPieChart
                  margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
                >
                  <Pie
                    data={industryDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ industry, percentage }) =>
                      `${industry}: ${percentage.toFixed(1)}%`
                    }
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="count"
                    isAnimationActive={false}
                  >
                    {industryDistribution.map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <ChartTooltip content={<IndustryTooltip />} />
                </RechartsPieChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Industry Rankings */}
        <Card className="pdf-avoid-break" style={{ pageBreakInside: 'avoid', breakInside: 'avoid' }}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingDown className="h-5 w-5 text-green-600" />
              Industry Rankings (Decreasing Order)
            </CardTitle>
            <p className="text-sm text-gray-600">
              Customer concentration by industry vertical
            </p>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {industryDistribution.map((industry, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-white border-2 border-gray-300 font-bold text-sm">
                      {index + 1}
                    </div>
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: industry.color }}
                    />
                    <div>
                      <div className="font-semibold text-gray-900">
                        {industry.industry}
                      </div>
                      <div className="text-sm text-gray-600">
                        {industry.count} customers
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-bold text-gray-900">
                      {industry.percentage.toFixed(1)}%
                    </div>
                    <div className="text-sm text-gray-600">of portfolio</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Industry Distribution Bar Chart */}
      <Card className="pdf-avoid-break pdf-chart-container" style={{ pageBreakInside: 'avoid', breakInside: 'avoid' }}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-blue-600" />
            Customer Volume by Industry
          </CardTitle>
          <p className="text-sm text-gray-600">
            Comparative analysis of customer distribution across industry
            sectors
          </p>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={{
              count: { label: "Customers", color: "hsl(var(--chart-1))" },
            }}
            className="h-[350px] w-full"
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={industryDistribution}
                margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="industry"
                  angle={-45}
                  textAnchor="end"
                  height={80}
                  interval={0}
                />
                <YAxis />
                <ChartTooltip content={<IndustryTooltip />} />
                <Bar
                  dataKey="count"
                  fill="var(--color-count)"
                  name="Customers"
                  radius={[4, 4, 0, 0]}
                  isAnimationActive={false}
                />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Customer Showcase by Industry */}
      {industryDistribution.map((industryData, industryIndex) => (
        <Card
          key={industryIndex}
          className="border-l-4 pdf-avoid-break"
          style={{ borderLeftColor: industryData.color, pageBreakInside: 'avoid', breakInside: 'avoid' }}
        >
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div
                  className="w-6 h-6 rounded-full"
                  style={{ backgroundColor: industryData.color }}
                />
                <div>
                  <CardTitle className="text-xl font-bold text-gray-900">
                    {industryData.industry} Sector
                  </CardTitle>
                  <p className="text-sm text-gray-600">
                    {industryData.count} customers •{" "}
                    {industryData.percentage.toFixed(1)}% of portfolio
                  </p>
                </div>
              </div>
              <Badge variant="secondary" className="text-lg px-3 py-1">
                #{industryIndex + 1}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {industryData.customers.map(
                (customer: any, customerIndex: number) => (
                  <Card
                    key={customerIndex}
                    className="hover:shadow-lg transition-all duration-300 border-2 hover:border-blue-200"
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-center gap-4">
                        <div className="relative flex-shrink-0">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={
                              customer.logo_url ||
                              `https://ui-avatars.com/api/?name=${encodeURIComponent(customer.company_name || 'Co')}&size=60&background=E5E7EB&color=374151&bold=true`
                            }
                            alt={customer.company_name}
                            width={60}
                            height={60}
                            className="rounded-lg border-2 border-gray-200 bg-white p-2 shadow-sm w-[60px] h-[60px] object-contain"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(customer.company_name || 'Co')}&size=60&background=E5E7EB&color=374151&bold=true`;
                            }}
                          />
                          <div
                            className="absolute -top-1 -right-1 w-4 h-4 rounded-full"
                            style={{ backgroundColor: industryData.color }}
                          />
                        </div>
                        <div className="flex-1">
                          <CardTitle className="text-lg font-bold text-gray-900 mb-1 leading-tight">
                            {customer.company_name}
                          </CardTitle>
                          <Badge
                            variant="outline"
                            className="text-xs"
                            style={{
                              borderColor: industryData.color,
                              color: industryData.color,
                            }}
                          >
                            {customer.industry}
                          </Badge>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="space-y-3">
                        {/* Company Website */}
                        {customer.company_website && (
                          <div className="flex items-center gap-2">
                            <Globe className="h-4 w-4 text-blue-600 flex-shrink-0" />
                            <a
                              href={customer.company_website}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm text-blue-600 hover:text-blue-800 transition-colors flex items-center gap-1 truncate"
                            >
                              <span className="truncate">
                                {customer.company_website
                                  .replace(/^https?:\/\//, "")
                                  .replace(/^www\./, "")}
                              </span>
                              <ExternalLink className="h-3 w-3 flex-shrink-0" />
                            </a>
                          </div>
                        )}

                        {/* Industry Info */}
                        <div className="flex items-center gap-2">
                          <Building2 className="h-4 w-4 text-gray-600 flex-shrink-0" />
                          <span className="text-sm text-gray-600">
                            <span className="font-medium">Sector:</span>{" "}
                            {customer.industry}
                          </span>
                        </div>

                        {/* Partnership Status */}
                        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-3 rounded-lg border border-blue-100">
                          <div className="flex items-center gap-2 mb-1">
                            <Handshake className="h-4 w-4 text-blue-600" />
                            <span className="font-medium text-sm text-blue-900">
                              Strategic Partnership
                            </span>
                          </div>
                          <p className="text-xs text-blue-700">
                            Key customer relationship
                          </p>
                        </div>

                        {/* Visit Website Button */}
                        {customer.company_website && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full bg-transparent"
                            asChild
                          >
                            <a
                              href={customer.company_website}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center justify-center gap-2"
                            >
                              <Globe className="h-4 w-4" />
                              Visit Website
                              <ExternalLink className="h-3 w-3" />
                            </a>
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ),
              )}
            </div>
          </CardContent>
        </Card>
      ))}

      {/* Portfolio Analytics Summary */}
      <Card className="bg-gradient-to-br from-gray-50 to-gray-100 border-gray-200 pdf-avoid-break" style={{ pageBreakInside: 'avoid', breakInside: 'avoid' }}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-gray-700" />
            Customer Portfolio Analytics
          </CardTitle>
          <p className="text-sm text-gray-600">
            Comprehensive analysis of customer distribution and industry
            diversification
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Market Concentration */}
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <TrendingDown className="h-5 w-5 text-orange-600" />
                <span className="font-semibold text-gray-900">
                  Market Concentration
                </span>
              </div>
              <div className="text-2xl font-bold text-orange-600 mb-1">
                {industryDistribution
                  .slice(0, 3)
                  .reduce((sum, industry) => sum + industry.percentage, 0)
                  .toFixed(1)}
                %
              </div>
              <div className="text-sm text-gray-600">Top 3 industries</div>
            </div>

            {/* Diversification Index */}
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <BarChart3 className="h-5 w-5 text-green-600" />
                <span className="font-semibold text-gray-900">
                  Diversification
                </span>
              </div>
              <div className="text-2xl font-bold text-green-600 mb-1">
                {industries.length > 5
                  ? "High"
                  : industries.length > 3
                  ? "Medium"
                  : "Low"}
              </div>
              <div className="text-sm text-gray-600">
                {industries.length} industries
              </div>
            </div>

            {/* Average per Industry */}
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <Users className="h-5 w-5 text-blue-600" />
                <span className="font-semibold text-gray-900">
                  Avg per Industry
                </span>
              </div>
              <div className="text-2xl font-bold text-blue-600 mb-1">
                {(customers.length / industries.length).toFixed(1)}
              </div>
              <div className="text-sm text-gray-600">customers/industry</div>
            </div>

            {/* Leading Sector */}
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <Building2 className="h-5 w-5 text-purple-600" />
                <span className="font-semibold text-gray-900">
                  Leading Sector
                </span>
              </div>
              <div className="text-lg font-bold text-purple-600 mb-1">
                {industryDistribution[0]?.industry}
              </div>
              <div className="text-sm text-gray-600">
                {industryDistribution[0]?.percentage.toFixed(1)}% share
              </div>
            </div>
          </div>

          {/* Industry Insights */}
          <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h4 className="font-semibold text-blue-900 mb-2">
              Key Portfolio Insights
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-800">
              <div>
                • <strong>{industryDistribution[0]?.industry}</strong>{" "}
                represents the largest customer segment at{" "}
                {industryDistribution[0]?.percentage.toFixed(1)}%
              </div>
              <div>
                • Portfolio spans{" "}
                <strong>{industries.length} industry verticals</strong> showing
                strong diversification
              </div>
              <div>
                • Top 3 industries account for{" "}
                <strong>
                  {industryDistribution
                    .slice(0, 3)
                    .reduce((sum, industry) => sum + industry.percentage, 0)
                    .toFixed(1)}
                  %
                </strong>{" "}
                of customer base
              </div>
              <div>
                • Average of{" "}
                <strong>
                  {(customers.length / industries.length).toFixed(1)} customers
                  per industry
                </strong>{" "}
                indicates balanced distribution
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
