"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Users, ExternalLink, Calendar, Briefcase } from "lucide-react"

interface LeadershipSectionProps {
  data: any
}

export default function LeadershipSection({ data }: LeadershipSectionProps) {
  const leadership = data.leadership || []

  return (
    <div className="space-y-6">
      {/* Leadership Overview */}
      <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 pdf-avoid-break">
        <CardHeader className="pb-4">
          <CardTitle className="text-xl font-bold text-blue-900 flex items-center gap-2">
            <Users className="h-6 w-6" />
            Executive Leadership Team
          </CardTitle>
          <p className="text-blue-700">
            Meet the senior executives driving strategic vision and operational excellence
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-white/50 rounded-lg">
              <div className="text-2xl font-bold text-blue-900">{leadership.length}</div>
              <div className="text-sm text-blue-700">Key Executives</div>
            </div>
            <div className="text-center p-4 bg-white/50 rounded-lg">
              <div className="text-2xl font-bold text-blue-900">
                {Math.round(
                  leadership.reduce((acc: number, leader: any) => {
                    const tenure = leader.tenure || ""
                    const years = tenure.match(/(\d+)\s*years?/)?.[1]
                    return acc + (years ? Number.parseInt(years) : 0)
                  }, 0) / leadership.length,
                )}
              </div>
              <div className="text-sm text-blue-700">Avg Tenure (Years)</div>
            </div>
            <div className="text-center p-4 bg-white/50 rounded-lg">
              <div className="text-2xl font-bold text-blue-900">100%</div>
              <div className="text-sm text-blue-700">LinkedIn Profiles</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Leadership Profiles */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pdf-leadership-grid">
        {leadership.map((leader: any, index: number) => (
          <Card key={index} className="hover:shadow-lg transition-shadow pdf-avoid-break pdf-leadership-card" style={{ pageBreakInside: 'avoid', breakInside: 'avoid' }}>
            <CardHeader className="pb-4">
              <div className="flex items-start gap-4">
                <div className="relative flex-shrink-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={leader.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(leader.name || 'User')}&size=80&background=3B82F6&color=fff&bold=true`}
                    alt={leader.name}
                    width={80}
                    height={80}
                    className="rounded-full border-4 border-white shadow-md w-20 h-20 object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(leader.name || 'User')}&size=80&background=3B82F6&color=fff&bold=true`;
                    }}
                  />
                  <div className="absolute -bottom-2 -right-2 bg-blue-600 text-white rounded-full p-1">
                    <Users className="h-3 w-3" />
                  </div>
                </div>
                <div className="flex-1">
                  <CardTitle className="text-xl font-bold text-gray-900 mb-1">{leader.name}</CardTitle>
                  <Badge variant="secondary" className="mb-2">
                    {leader.role}
                  </Badge>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      <span>Joined {leader.year_joined}</span>
                    </div>
                    {leader.linkedin_url && (
                      <a
                        href={leader.linkedin_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-blue-600 hover:text-blue-800 transition-colors"
                      >
                        <ExternalLink className="h-3 w-3" />
                        <span>LinkedIn</span>
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Description */}
              <div>
                <p className="text-gray-700 text-sm leading-relaxed">{leader.description}</p>
              </div>

              {/* Tenure */}
              {leader.tenure && (
                <div className="bg-gray-50 p-3 rounded-lg">
                  <div className="flex items-center gap-2 mb-1">
                    <Briefcase className="h-4 w-4 text-gray-600" />
                    <span className="font-medium text-sm text-gray-900">Tenure</span>
                  </div>
                  <p className="text-sm text-gray-700">{leader.tenure}</p>
                </div>
              )}

              {/* Key Responsibilities */}
              {leader.key_responsibilities && (
                <div className="bg-blue-50 p-3 rounded-lg">
                  <div className="font-medium text-sm text-blue-900 mb-1">Key Responsibilities</div>
                  <p className="text-sm text-blue-800">{leader.key_responsibilities}</p>
                </div>
              )}

              {/* Previous Experience */}
              {leader.previous_experience && leader.previous_experience.length > 0 && (
                <div>
                  <div className="font-medium text-sm text-gray-900 mb-2">Previous Experience</div>
                  <div className="space-y-1">
                    {leader.previous_experience.map((exp: string, expIndex: number) => (
                      <div key={expIndex} className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-gray-400 rounded-full flex-shrink-0" />
                        <span className="text-sm text-gray-700">{exp}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Leadership Summary */}
      <Card className="bg-gradient-to-br from-gray-50 to-gray-100 border-gray-200 pdf-avoid-break">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-gray-700" />
            Leadership Team Analysis
          </CardTitle>
          <p className="text-sm text-gray-600">Executive team composition and experience overview</p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Experience Distribution */}
            <div>
              <h4 className="font-semibold mb-3">Experience Highlights</h4>
              <div className="space-y-2">
                {leadership.map((leader: any, index: number) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-white rounded">
                    <span className="text-sm font-medium">{leader.name}</span>
                    <span className="text-xs text-gray-600">{leader.tenure}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Key Roles */}
            <div>
              <h4 className="font-semibold mb-3">Executive Roles</h4>
              <div className="space-y-2">
                {leadership.map((leader: any, index: number) => (
                  <div key={index} className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">
                      {leader.role}
                    </Badge>
                    <span className="text-sm text-gray-700">{leader.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
