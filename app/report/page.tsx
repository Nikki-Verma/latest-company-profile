"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  ArrowLeft,
  Award,
  BarChart3,
  BookOpen,
  Briefcase,
  Building2,
  Calendar,
  DollarSign,
  Download,
  ExternalLink,
  FileText,
  Globe,
  Handshake,
  History,
  Loader2,
  MapPin,
  PieChart,
  Share,
  Target,
  TrendingUp,
  Users,
} from "lucide-react";
import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import FinancialCharts from "./financial-charts";
import KeyCustomersSection from "./key-customers-section";
import LeadershipSection from "./leadership-section";
import RevenueCharts from "./revenue-charts";

interface CompanyProfile {
  Company_Name: string;
  Company_Website: string;
  Products_and_Services_Portfolio: string;
  Headquarters: string;
  End_Markets: string;
  Key_Customers: any;
  Number_of_Employees: string;
  Key_Management: any;
  Financial_Overview: any;
  Historical_Timeline: string;
  Key_Merger_and_Acquisitions: string;
  Recent_Developments: string;
  Financing_Details: string;
  Ownership_Details: string;
  Revenue_Breakdown: any;
  Business_Overview: string;
}

const sectionConfig = [
  {
    key: "Business_Overview",
    title: "Executive Summary",
    icon: Building2,
    description: "Core business model and strategic overview",
    color: "bg-white border-gray-200",
    hasVisualization: false,
  },
  {
    key: "Financial_Overview",
    title: "Financial Performance",
    icon: DollarSign,
    description: "Key financial metrics and performance indicators",
    color: "bg-white border-gray-200",
    hasVisualization: true,
  },
  {
    key: "Revenue_Breakdown",
    title: "Revenue Analysis",
    icon: PieChart,
    description: "Revenue segmentation and market analysis",
    color: "bg-white border-gray-200",
    hasVisualization: true,
  },
  {
    key: "Key_Management",
    title: "Leadership Team",
    icon: Users,
    description: "Executive leadership and management structure",
    color: "bg-white border-gray-200",
    hasVisualization: true,
  },
  {
    key: "Key_Customers",
    title: "Customer Portfolio",
    icon: Handshake,
    description: "Major clients and strategic partnerships",
    color: "bg-white border-gray-200",
    hasVisualization: true,
  },
  {
    key: "Products_and_Services_Portfolio",
    title: "Products & Services",
    icon: Briefcase,
    description: "Complete portfolio and service offerings",
    color: "bg-white border-gray-200",
    hasVisualization: false,
  },
  {
    key: "End_Markets",
    title: "Market Position",
    icon: Target,
    description: "Target markets and competitive positioning",
    color: "bg-white border-gray-200",
    hasVisualization: false,
  },
  {
    key: "Recent_Developments",
    title: "Recent Developments",
    icon: TrendingUp,
    description: "Latest news, updates, and strategic initiatives",
    color: "bg-white border-gray-200",
    hasVisualization: false,
  },
  {
    key: "Historical_Timeline",
    title: "Company History",
    icon: History,
    description: "Key milestones and corporate evolution",
    color: "bg-white border-gray-200",
    hasVisualization: false,
  },
  {
    key: "Key_Merger_and_Acquisitions",
    title: "M&A Activity",
    icon: Award,
    description: "Mergers, acquisitions, and strategic transactions",
    color: "bg-white border-gray-200",
    hasVisualization: false,
  },
  {
    key: "Financing_Details",
    title: "Capital Structure",
    icon: FileText,
    description: "Funding history and financial structure",
    color: "bg-white border-gray-200",
    hasVisualization: false,
  },
  {
    key: "Ownership_Details",
    title: "Ownership Structure",
    icon: BarChart3,
    description: "Shareholding and ownership information",
    color: "bg-white border-gray-200",
    hasVisualization: false,
  },
];

export default function CompanyReportPage() {
  const [data, setData] = useState<CompanyProfile | null>(null);
  const [activeSection, setActiveSection] =
    useState<string>("Business_Overview");
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadingStarted, setDownloadingStarted] = useState(false);
  useEffect(() => {
    const storedData = sessionStorage.getItem("companyProfileData");
    if (storedData) {
      try {
        const parsedData = JSON.parse(storedData);
        console.log("Loaded company profile data:", parsedData);
        setData(parsedData);
      } catch (error) {
        console.error("Error parsing stored data:", error);
      }
    }
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSectionChange = (sectionKey: string) => {
    setActiveSection(sectionKey);
    scrollToTop();
  };

  // Function to wait for images to load
  const prefetchImages = async (element: HTMLElement): Promise<void> => {
    const images = element.querySelectorAll("img");
    const imagePromises: Promise<void>[] = [];

    images.forEach((img) => {
      if (!img.complete) {
        const promise = new Promise<void>((resolve) => {
          const timeout = setTimeout(() => resolve(), 3000);
          img.onload = () => {
            clearTimeout(timeout);
            resolve();
          };
          img.onerror = () => {
            clearTimeout(timeout);
            resolve();
          };
        });
        imagePromises.push(promise);
      }
    });

    await Promise.all(imagePromises);
  };

  const downloadPDF = async () => {
    try {
      setIsDownloading(true);
      const html2pdf = (await import("html2pdf.js")).default;

      const element = document.getElementById("report-content");
      if (!element) return;

      // Disable window scroll
      document.body.style.overflow = "hidden";
      setDownloadingStarted(true);
      const originalWidth = element.style.width; // Save original width
      const originaldisplay = element.style.display; // Save original width

      element.style.display = "block";

      // Prefetch all images before generating PDF
      await prefetchImages(element);
      
      // Wait for images to render
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Find the table wrapper (or the specific content you want to export)
      const allElements = element.querySelectorAll("*");
      // Calculate the maximum width among all table containers
      let maxWidth = 0;
      allElements.forEach((childElement: any) => {
        const childWidth = childElement.scrollWidth;
        if (childWidth > maxWidth) {
          maxWidth = childWidth;
        }
      });

      // Conditionally apply the max width if it exceeds the current element width

      if (maxWidth + 16 > element.scrollWidth) {
        element.style.width = `${maxWidth + 16}px`; // Expand to max width
      }

      const options = {
        margin: 10,
        filename: `${data?.Company_Name || "company"}-report.pdf`,
        image: { type: 'jpeg', quality: 0.95 },
        html2canvas: {
          scale: 2,
          scrollX: 0,
          scrollY: 0,
          useCORS: true,
          allowTaint: true,
          logging: false,
          width:
            maxWidth + 16 > element.scrollWidth
              ? maxWidth + 16
              : element.scrollWidth,
          windowWidth:
            maxWidth + 16 > element.scrollWidth
              ? maxWidth + 16
              : element.scrollWidth,
        },
        jsPDF: {
          unit: "mm",
          format: "a4",
          orientation: "portrait",
        },
        pagebreak: {
          mode: ["css", "legacy"],
          before: ".pdf-page-break-before",
          avoid: ".pdf-avoid-break",
        },
      };

      // Use jsPDF to render selectable text
      html2pdf()
        .from(element)
        .set(options)
        .toPdf()
        .get("pdf")
        .then((pdf: any) => {
          pdf.setFontSize(12); // Set font size for text
        })
        .save()
        .finally(() => {
          document.body.style.overflow = "auto";
          element.style.width = originalWidth;
          element.style.display = originaldisplay;
          setDownloadingStarted(false);
        });
    } catch (error) {
      console.error("Error while exporting PDF:", error);
    } finally {
      setIsDownloading(false);
    }
  };

  if (!data) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="p-8 text-center">
          <CardContent>
            <Building2 className="h-12 w-12 mx-auto mb-4 text-gray-400" />
            <h2 className="text-xl font-semibold mb-2">No Report Data Found</h2>
            <p className="text-gray-600 mb-4">
              Please run an analysis first to view the report.
            </p>
            <Button onClick={() => (window.location.href = "/")}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Analysis
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const currentSection = sectionConfig.find(
    (section) => section.key === activeSection,
  );
  const currentContent = data[activeSection as keyof CompanyProfile];

  const renderSectionContent = () => {
    if (!currentSection || !currentContent) return null;

    // Special handling for sections with visualizations
    if (
      currentSection.key === "Financial_Overview" &&
      typeof currentContent === "object"
    ) {
      return <FinancialCharts data={currentContent} />;
    }

    if (
      currentSection.key === "Revenue_Breakdown" &&
      typeof currentContent === "object"
    ) {
      return <RevenueCharts data={currentContent} />;
    }

    if (
      currentSection.key === "Key_Management" &&
      typeof currentContent === "object"
    ) {
      return <LeadershipSection data={currentContent} />;
    }

    if (
      currentSection.key === "Key_Customers" &&
      typeof currentContent === "object"
    ) {
      return <KeyCustomersSection data={currentContent} />;
    }

    console.log(`currentContent`, currentContent);
    // Default markdown rendering for other sections
    return (
      <div className="prose prose-lg max-w-none">
        <ReactMarkdown
          components={{
            h1: ({ children }) => (
              <h1 className="text-2xl font-bold mb-4 text-gray-900 border-b pb-2">
                {children}
              </h1>
            ),
            h2: ({ children }) => (
              <h2 className="text-xl font-semibold mb-3 text-gray-800 mt-6">
                {children}
              </h2>
            ),
            h3: ({ children }) => (
              <h3 className="text-lg font-medium mb-2 text-gray-800 mt-4">
                {children}
              </h3>
            ),
            h4: ({ children }) => (
              <h4 className="text-base font-medium mb-2 text-gray-700 mt-3">
                {children}
              </h4>
            ),
            p: ({ children }) => (
              <p className="text-gray-700 mb-4 leading-relaxed">{children}</p>
            ),
            ul: ({ children }) => (
              <ul className="mb-4 pl-6 space-y-2 list-disc">{children}</ul>
            ),
            ol: ({ children }) => (
              <ol className="mb-4 pl-6 space-y-2 list-disc">{children}</ol>
            ),
            li: ({ children }) => <li className="text-gray-700">{children}</li>,
            strong: ({ children }) => (
              <strong className="font-semibold text-gray-900">
                {children}
              </strong>
            ),
            table: ({ children }) => (
              <div className="overflow-x-auto mb-4">
                <table className="min-w-full border-collapse border border-gray-300 bg-white">
                  {children}
                </table>
              </div>
            ),
            th: ({ children }) => (
              <th className="border border-gray-300 px-4 py-2 bg-gray-50 font-semibold text-left">
                {children}
              </th>
            ),
            td: ({ children }) => (
              <td className="border border-gray-300 px-4 py-2">{children}</td>
            ),
            blockquote: ({ children }) => (
              <blockquote className="border-l-4 border-blue-200 pl-4 italic text-gray-700 mb-4 bg-blue-50 py-2">
                {children}
              </blockquote>
            ),
            code: ({ children }) => (
              <code className="bg-gray-100 px-2 py-1 rounded text-sm font-mono">
                {children}
              </code>
            ),
            pre: ({ children }) => (
              <pre className="bg-gray-100 p-4 rounded-lg overflow-x-auto mb-4">
                {children}
              </pre>
            ),
            a: ({ children }) => (
              <a className="italic underline text-blue-500">{children}</a>
            ),
          }}
        >
          {typeof currentContent === "string"
            ? currentContent
            : JSON.stringify(currentContent, null, 2)}
        </ReactMarkdown>
      </div>
    );
  };

  const renderSectionContentDownload = ({
    currentSectionDownload,
    currentContentDownload,
  }: {
    currentSectionDownload: any;
    currentContentDownload: any;
  }) => {
    if (!currentSectionDownload || !currentContentDownload) return null;

    // Special handling for sections with visualizations
    if (
      currentSectionDownload.key === "Financial_Overview" &&
      typeof currentContentDownload === "object"
    ) {
      return <FinancialCharts data={currentContentDownload} />;
    }

    if (
      currentSectionDownload.key === "Revenue_Breakdown" &&
      typeof currentContentDownload === "object"
    ) {
      return <RevenueCharts data={currentContentDownload} />;
    }

    if (
      currentSectionDownload.key === "Key_Management" &&
      typeof currentContentDownload === "object"
    ) {
      return <LeadershipSection data={currentContentDownload} />;
    }

    if (
      currentSectionDownload.key === "Key_Customers" &&
      typeof currentContentDownload === "object"
    ) {
      return <KeyCustomersSection data={currentContentDownload} />;
    }

    console.log(`currentContent`, currentContentDownload);
    // Default markdown rendering for other sections
    return (
      <div className="prose prose-lg max-w-none">
        <ReactMarkdown
          components={{
            h1: ({ children }) => (
              <h1 className="text-2xl font-bold mb-4 text-gray-900 border-b pb-2">
                {children}
              </h1>
            ),
            h2: ({ children }) => (
              <h2 className="text-xl font-semibold mb-3 text-gray-800 mt-6">
                {children}
              </h2>
            ),
            h3: ({ children }) => (
              <h3 className="text-lg font-medium mb-2 text-gray-800 mt-4">
                {children}
              </h3>
            ),
            h4: ({ children }) => (
              <h4 className="text-base font-medium mb-2 text-gray-700 mt-3">
                {children}
              </h4>
            ),
            p: ({ children }) => (
              <p className="text-gray-700 mb-4 leading-relaxed">{children}</p>
            ),
            ul: ({ children }) => (
              <ul className="mb-4 pl-6 space-y-2 list-disc">{children}</ul>
            ),
            ol: ({ children }) => (
              <ol className="mb-4 pl-6 space-y-2 list-disc">{children}</ol>
            ),
            li: ({ children }) => <li className="text-gray-700">{children}</li>,
            strong: ({ children }) => (
              <strong className="font-semibold text-gray-900">
                {children}
              </strong>
            ),
            table: ({ children }) => (
              <div className="overflow-x-auto mb-4">
                <table className="min-w-full border-collapse border border-gray-300 bg-white">
                  {children}
                </table>
              </div>
            ),
            th: ({ children }) => (
              <th className="border border-gray-300 px-4 py-2 bg-gray-50 font-semibold text-left">
                {children}
              </th>
            ),
            td: ({ children }) => (
              <td className="border border-gray-300 px-4 py-2">{children}</td>
            ),
            blockquote: ({ children }) => (
              <blockquote className="border-l-4 border-blue-200 pl-4 italic text-gray-700 mb-4 bg-blue-50 py-2">
                {children}
              </blockquote>
            ),
            code: ({ children }) => (
              <code className="bg-gray-100 px-2 py-1 rounded text-sm font-mono">
                {children}
              </code>
            ),
            pre: ({ children }) => (
              <pre className="bg-gray-100 p-4 rounded-lg overflow-x-auto mb-4">
                {children}
              </pre>
            ),
            a: ({ children }) => (
              <a className="italic underline text-blue-500">{children}</a>
            ),
          }}
        >
          {typeof currentContentDownload === "string"
            ? currentContentDownload
            : JSON.stringify(currentContentDownload, null, 2)}
        </ReactMarkdown>
      </div>
    );
  };

  return (
    <>
      {downloadingStarted && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            zIndex: 9999999,
            background: "rgb(154 ,153, 153, 0.38)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div className="flex justify-center">
            <div className="relative">
              <div className="absolute inset-0 w-24 h-24 border-4 border-blue-200 rounded-full animate-spin border-t-blue-600"></div>
            </div>
          </div>
        </div>
      )}
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => (window.location.href = "/")}
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back
                </Button>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                    <Building2 className="h-6 w-6 text-blue-600" />
                    {data.Company_Name}
                  </h1>
                  <p className="text-sm text-gray-600">
                    Company Research Report
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Globe className="h-4 w-4" />
                    <a
                      href={data.Company_Website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-blue-600 transition-colors font-medium flex items-center gap-1"
                    >
                      {data.Company_Website}
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                    <Calendar className="h-3 w-3" />
                    Generated: {new Date().toLocaleDateString()}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Share className="h-4 w-4 mr-2" />
                    Share
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={downloadPDF}
                    disabled={isDownloading}
                  >
                    {isDownloading ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <Download className="h-4 w-4 mr-2" />
                    )}
                    {isDownloading ? "Generating..." : "Download PDF"}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Company Overview Banner */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
          <div className="max-w-7xl mx-auto px-6 py-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="md:col-span-2">
                <h2 className="text-3xl font-bold mb-2">{data.Company_Name}</h2>
                <div className="flex items-center gap-2 mb-4">
                  <MapPin className="h-4 w-4" />
                  <span className="text-blue-100">{data.Headquarters}</span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 md:col-span-2">
                <div className="bg-white/10 rounded-lg p-4 text-center">
                  <Users className="h-6 w-6 mx-auto mb-2" />
                  <div className="text-sm text-blue-100">Employees</div>
                  <div className="font-semibold">
                    {data.Number_of_Employees || "N/A"}
                  </div>
                </div>
                <div className="bg-white/10 rounded-lg p-4 text-center">
                  <Globe className="h-6 w-6 mx-auto mb-2" />
                  <div className="text-sm text-blue-100">Global Reach</div>
                  <div className="font-semibold">Worldwide</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Navigation Sidebar */}
            <div className="lg:col-span-1">
              <Card className="sticky top-24">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <BookOpen className="h-5 w-5" />
                    Report Sections
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <ScrollArea className="h-[calc(100vh-200px)]">
                    <div className="space-y-1 p-4">
                      {sectionConfig.map((section) => {
                        const IconComponent = section.icon;
                        const hasContent =
                          data[section.key as keyof CompanyProfile];

                        if (!hasContent) return null;

                        return (
                          <button
                            key={section.key}
                            onClick={() => handleSectionChange(section.key)}
                            className={`w-full text-left p-3 rounded-lg transition-all duration-200 ${
                              activeSection === section.key
                                ? "bg-blue-100 border-l-4 border-blue-500 text-blue-900"
                                : "hover:bg-gray-50 text-gray-700"
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <IconComponent className="h-4 w-4 flex-shrink-0" />
                              <div className="flex-1">
                                <div className="font-medium text-sm flex items-center gap-2">
                                  {section.title}
                                </div>
                                <div className="text-xs text-gray-500 mt-1">
                                  {section.description}
                                </div>
                              </div>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3">
              {currentSection && currentContent && (
                <Card className={`${currentSection.color} border-2`}>
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-white rounded-lg shadow-sm">
                          <currentSection.icon className="h-6 w-6 text-blue-600" />
                        </div>
                        <div>
                          <CardTitle className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                            {currentSection.title}
                          </CardTitle>
                          <p className="text-gray-600 mt-1">
                            {currentSection.description}
                          </p>
                        </div>
                      </div>
                      <Badge variant="secondary" className="text-sm">
                        {sectionConfig.findIndex(
                          (s) => s.key === activeSection,
                        ) + 1}{" "}
                        of{" "}
                        {
                          sectionConfig.filter(
                            (s) => data[s.key as keyof CompanyProfile],
                          ).length
                        }
                      </Badge>
                    </div>
                    <Separator className="mt-4" />
                  </CardHeader>
                  <CardContent>
                    <div className="bg-white rounded-lg p-6 shadow-sm">
                      {renderSectionContent()}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Navigation Footer */}
              <div className="flex justify-between items-center mt-8">
                <Button
                  variant="outline"
                  onClick={() => {
                    const availableSections = sectionConfig.filter(
                      (s) => data[s.key as keyof CompanyProfile],
                    );
                    const currentAvailableIndex = availableSections.findIndex(
                      (s) => s.key === activeSection,
                    );

                    if (currentAvailableIndex > 0) {
                      handleSectionChange(
                        availableSections[currentAvailableIndex - 1].key,
                      );
                    }
                  }}
                  disabled={
                    sectionConfig
                      .filter((s) => data[s.key as keyof CompanyProfile])
                      .findIndex((s) => s.key === activeSection) === 0
                  }
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Previous Section
                </Button>

                <div className="text-sm text-gray-500">
                  Section{" "}
                  {sectionConfig
                    .filter((s) => data[s.key as keyof CompanyProfile])
                    .findIndex((s) => s.key === activeSection) + 1}{" "}
                  of{" "}
                  {
                    sectionConfig.filter(
                      (s) => data[s.key as keyof CompanyProfile],
                    ).length
                  }
                </div>

                <Button
                  onClick={() => {
                    const availableSections = sectionConfig.filter(
                      (s) => data[s.key as keyof CompanyProfile],
                    );
                    const currentAvailableIndex = availableSections.findIndex(
                      (s) => s.key === activeSection,
                    );

                    if (currentAvailableIndex < availableSections.length - 1) {
                      handleSectionChange(
                        availableSections[currentAvailableIndex + 1].key,
                      );
                    }
                  }}
                  disabled={
                    sectionConfig
                      .filter((s) => data[s.key as keyof CompanyProfile])
                      .findIndex((s) => s.key === activeSection) ===
                    sectionConfig.filter(
                      (s) => data[s.key as keyof CompanyProfile],
                    ).length -
                      1
                  }
                >
                  Next Section
                  <ArrowLeft className="h-4 w-4 ml-2 rotate-180" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* PDF Download Content - Hidden from view but used for PDF generation */}
      <style jsx global>{`
        /* PDF Page Break Styles */
        #report-content .pdf-page-break-before {
          page-break-before: always !important;
          break-before: page !important;
        }
        
        #report-content .pdf-avoid-break {
          page-break-inside: avoid !important;
          break-inside: avoid !important;
        }
        
        #report-content .pdf-chart-container {
          page-break-inside: avoid !important;
          break-inside: avoid !important;
        }
        
        #report-content .pdf-section-card {
          page-break-inside: avoid !important;
          break-inside: avoid !important;
        }
        
        #report-content .recharts-wrapper {
          page-break-inside: avoid !important;
          break-inside: avoid !important;
        }
        
        #report-content table {
          page-break-inside: avoid !important;
          break-inside: avoid !important;
        }
        
        #report-content img {
          page-break-inside: avoid !important;
          break-inside: avoid !important;
        }
        
        #report-content .grid > * {
          page-break-inside: avoid !important;
          break-inside: avoid !important;
        }
      `}</style>
      <div style={{ display: "none" }} id="report-content">
        <div className="bg-gray-50" style={{ width: '100%' }}>
          {/* Company Overview Banner - First Page */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white pdf-avoid-break" style={{ width: '100%', padding: '16px' }}>
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold mb-1">
                  {data.Company_Name}
                </h2>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  <span className="text-blue-100 text-sm">{data.Headquarters}</span>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="bg-white/10 rounded-lg p-2 text-center">
                  <div className="text-xs text-blue-100">Employees</div>
                  <div className="font-semibold text-sm">
                    {data.Number_of_Employees || "N/A"}
                  </div>
                </div>
                <div className="bg-white/10 rounded-lg p-2 text-center">
                  <div className="text-xs text-blue-100">Global Reach</div>
                  <div className="font-semibold text-sm">Worldwide</div>
                </div>
              </div>
            </div>
          </div>

          <div className="px-2 py-2" style={{ width: '100%' }}>
            {sectionConfig.map((section, index) => {
              const currentSectionDownload = section;
              const currentContentDownload =
                data[section?.key as keyof CompanyProfile];

              if (!currentContentDownload) return null;

              // Calculate actual visible index for section numbering
              const visibleSections = sectionConfig.filter(
                (s) => data[s.key as keyof CompanyProfile]
              );
              const actualIndex = visibleSections.findIndex(
                (s) => s.key === section.key
              );

              {/* Main Content - Each section starts on a new page */}
              return (
                <div 
                  key={section.key}
                  className={`pdf-section-wrapper ${actualIndex > 0 ? 'pdf-page-break-before' : ''}`}
                  style={{ 
                    pageBreakBefore: actualIndex > 0 ? 'always' : 'auto',
                    breakBefore: actualIndex > 0 ? 'page' : 'auto',
                    width: '100%',
                    display: 'block'
                  }}
                >
                  {currentSectionDownload && currentContentDownload && (
                    <Card
                      className={`${currentSectionDownload.color} border-2 pdf-section-card pdf-avoid-break`}
                      style={{ width: '100%', marginBottom: '8px' }}
                    >
                      <CardHeader className="pb-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="p-1 bg-white rounded-lg shadow-sm">
                              <currentSectionDownload.icon className="h-5 w-5 text-blue-600" />
                            </div>
                            <div>
                              <CardTitle className="text-xl font-bold text-gray-900 flex items-center gap-2">
                                {currentSectionDownload.title}
                              </CardTitle>
                              <p className="text-gray-600 text-sm">
                                {currentSectionDownload.description}
                              </p>
                            </div>
                          </div>
                          <Badge variant="secondary" className="text-xs">
                            {actualIndex} of {visibleSections.length}
                          </Badge>
                        </div>
                        <Separator className="mt-2" />
                      </CardHeader>
                      <CardContent style={{ width: '100%', padding: '8px' }}>
                        <div className="bg-white rounded-lg p-2 shadow-sm pdf-content-wrapper" style={{ width: '100%' }}>
                          {renderSectionContentDownload({
                            currentContentDownload: currentContentDownload,
                            currentSectionDownload: currentSectionDownload,
                          })}
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}
