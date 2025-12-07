"use client"

import { useState } from "react"
import { Plus, Search, Filter, MoreHorizontal, Building2, Globe, Users, TrendingUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { CompanyDetailModal } from "./company-detail-modal"
import { AddCompanyModal } from "./add-company-modal"
import type { Company } from "@/lib/types/crm"

interface CompaniesViewProps {
  companies: Company[]
  tenantId: string | null
}

const statusColors: Record<string, string> = {
  prospect: "bg-zinc-700 text-zinc-300",
  active: "bg-cyan-500/20 text-cyan-400 border border-cyan-500/30",
  client: "bg-[#00ff88]/20 text-[#00ff88] border border-[#00ff88]/30",
  churned: "bg-red-500/20 text-red-400 border border-red-500/30",
  archived: "bg-zinc-800 text-zinc-500",
}

const digitalScoreColors: Record<string, string> = {
  poor: "text-red-400",
  fair: "text-yellow-400",
  good: "text-cyan-400",
  excellent: "text-[#00ff88]",
}

export function CompaniesView({ companies, tenantId }: CompaniesViewProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [statusFilter, setStatusFilter] = useState<string | null>(null)

  const filteredCompanies = companies.filter((company) => {
    const matchesSearch =
      company.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      company.domain?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      company.industry?.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesStatus = !statusFilter || company.status === statusFilter

    return matchesSearch && matchesStatus
  })

  const stats = {
    total: companies.length,
    prospects: companies.filter((c) => c.status === "prospect").length,
    active: companies.filter((c) => c.status === "active").length,
    clients: companies.filter((c) => c.status === "client").length,
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Companies</h1>
          <p className="text-sm text-zinc-500 mt-1">Manage your accounts and track relationships</p>
        </div>
        <Button
          onClick={() => setIsAddModalOpen(true)}
          className="bg-[#00ff88] text-black hover:bg-[#00ff88]/90 font-semibold"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Company
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: "Total", value: stats.total, icon: Building2, color: "text-white" },
          { label: "Prospects", value: stats.prospects, icon: TrendingUp, color: "text-zinc-400" },
          { label: "Active", value: stats.active, icon: Users, color: "text-cyan-400" },
          { label: "Clients", value: stats.clients, icon: Globe, color: "text-[#00ff88]" },
        ].map((stat) => (
          <div key={stat.label} className="bg-zinc-900 border border-zinc-800 p-4">
            <div className="flex items-center justify-between">
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
              <span className={`text-2xl font-bold ${stat.color}`}>{stat.value}</span>
            </div>
            <p className="text-xs text-zinc-500 mt-2 uppercase tracking-wide">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
          <Input
            placeholder="Search companies..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-zinc-900 border-zinc-800 text-white placeholder:text-zinc-600"
          />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="border-zinc-800 bg-zinc-900 text-zinc-400 hover:text-white">
              <Filter className="w-4 h-4 mr-2" />
              {statusFilter ? statusFilter.charAt(0).toUpperCase() + statusFilter.slice(1) : "All Status"}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="bg-zinc-900 border-zinc-800">
            <DropdownMenuItem onClick={() => setStatusFilter(null)} className="text-zinc-300 focus:bg-zinc-800">
              All Status
            </DropdownMenuItem>
            {["prospect", "active", "client", "churned", "archived"].map((status) => (
              <DropdownMenuItem
                key={status}
                onClick={() => setStatusFilter(status)}
                className="text-zinc-300 focus:bg-zinc-800 capitalize"
              >
                {status}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Table */}
      <div className="bg-zinc-900 border border-zinc-800 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-zinc-800">
              <th className="text-left p-4 text-xs font-semibold uppercase tracking-wider text-zinc-500">Company</th>
              <th className="text-left p-4 text-xs font-semibold uppercase tracking-wider text-zinc-500">Industry</th>
              <th className="text-left p-4 text-xs font-semibold uppercase tracking-wider text-zinc-500">Status</th>
              <th className="text-left p-4 text-xs font-semibold uppercase tracking-wider text-zinc-500">
                Digital Score
              </th>
              <th className="text-left p-4 text-xs font-semibold uppercase tracking-wider text-zinc-500">Owner</th>
              <th className="w-12"></th>
            </tr>
          </thead>
          <tbody>
            {filteredCompanies.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-8 text-center text-zinc-500">
                  {companies.length === 0 ? (
                    <div className="space-y-2">
                      <Building2 className="w-8 h-8 mx-auto text-zinc-600" />
                      <p>No companies yet</p>
                      <Button
                        size="sm"
                        onClick={() => setIsAddModalOpen(true)}
                        className="bg-[#00ff88] text-black hover:bg-[#00ff88]/90"
                      >
                        Add your first company
                      </Button>
                    </div>
                  ) : (
                    "No companies match your search"
                  )}
                </td>
              </tr>
            ) : (
              filteredCompanies.map((company) => (
                <tr
                  key={company.id}
                  className="border-b border-zinc-800/50 hover:bg-zinc-800/30 cursor-pointer transition-colors"
                  onClick={() => setSelectedCompany(company)}
                >
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-zinc-800 border border-zinc-700 flex items-center justify-center">
                        <span className="text-sm font-bold text-[#00ff88]">{company.name.charAt(0).toUpperCase()}</span>
                      </div>
                      <div>
                        <p className="font-medium text-white">{company.name}</p>
                        {company.domain && <p className="text-xs text-zinc-500">{company.domain}</p>}
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="text-sm text-zinc-400">{company.industry || "—"}</span>
                  </td>
                  <td className="p-4">
                    <Badge className={statusColors[company.status]}>{company.status}</Badge>
                  </td>
                  <td className="p-4">
                    {company.website_quality ? (
                      <div className="flex items-center gap-2">
                        <span className={`text-sm font-mono ${digitalScoreColors[company.website_quality]}`}>
                          {company.website_quality.toUpperCase()}
                        </span>
                      </div>
                    ) : (
                      <span className="text-zinc-600 text-sm">Not scored</span>
                    )}
                  </td>
                  <td className="p-4">
                    <span className="text-sm text-zinc-400">{(company as any).owner?.full_name || "Unassigned"}</span>
                  </td>
                  <td className="p-4">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-zinc-500 hover:text-white">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="bg-zinc-900 border-zinc-800">
                        <DropdownMenuItem
                          onClick={(e) => {
                            e.stopPropagation()
                            setSelectedCompany(company)
                          }}
                          className="text-zinc-300 focus:bg-zinc-800"
                        >
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-zinc-300 focus:bg-zinc-800">Edit</DropdownMenuItem>
                        <DropdownMenuItem className="text-red-400 focus:bg-zinc-800">Delete</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Company Detail Modal */}
      {selectedCompany && <CompanyDetailModal company={selectedCompany} onClose={() => setSelectedCompany(null)} />}

      {/* Add Company Modal */}
      {isAddModalOpen && tenantId && <AddCompanyModal tenantId={tenantId} onClose={() => setIsAddModalOpen(false)} />}
    </div>
  )
}
