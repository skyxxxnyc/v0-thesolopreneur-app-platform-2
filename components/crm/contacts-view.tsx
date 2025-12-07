"use client"

import { useState } from "react"
import { Plus, Search, Filter, MoreHorizontal, UserCircle, Mail, Phone, Building2, Crown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { ContactDetailModal } from "./contact-detail-modal"
import { AddContactModal } from "./add-contact-modal"
import type { Contact } from "@/lib/types/crm"

interface ContactsViewProps {
  contacts: Contact[]
  companies: { id: string; name: string }[]
  tenantId: string | null
}

const authorityColors: Record<string, string> = {
  champion: "bg-[#00ff88]/20 text-[#00ff88] border border-[#00ff88]/30",
  decision_maker: "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30",
  economic_buyer: "bg-cyan-500/20 text-cyan-400 border border-cyan-500/30",
  influencer: "bg-zinc-700 text-zinc-300",
  end_user: "bg-zinc-800 text-zinc-500",
}

export function ContactsView({ contacts, companies, tenantId }: ContactsViewProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [companyFilter, setCompanyFilter] = useState<string | null>(null)

  const filteredContacts = contacts.filter((contact) => {
    const fullName = `${contact.first_name} ${contact.last_name || ""}`.toLowerCase()
    const matchesSearch =
      fullName.includes(searchQuery.toLowerCase()) ||
      contact.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.job_title?.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesCompany = !companyFilter || contact.company_id === companyFilter

    return matchesSearch && matchesCompany
  })

  const stats = {
    total: contacts.length,
    decisionMakers: contacts.filter((c) => c.is_decision_maker).length,
    withCompany: contacts.filter((c) => c.company_id).length,
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Contacts</h1>
          <p className="text-sm text-zinc-500 mt-1">People at your target companies</p>
        </div>
        <Button
          onClick={() => setIsAddModalOpen(true)}
          className="bg-[#00ff88] text-black hover:bg-[#00ff88]/90 font-semibold"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Contact
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-zinc-900 border border-zinc-800 p-4">
          <div className="flex items-center justify-between">
            <UserCircle className="w-5 h-5 text-white" />
            <span className="text-2xl font-bold text-white">{stats.total}</span>
          </div>
          <p className="text-xs text-zinc-500 mt-2 uppercase tracking-wide">Total Contacts</p>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 p-4">
          <div className="flex items-center justify-between">
            <Crown className="w-5 h-5 text-yellow-400" />
            <span className="text-2xl font-bold text-yellow-400">{stats.decisionMakers}</span>
          </div>
          <p className="text-xs text-zinc-500 mt-2 uppercase tracking-wide">Decision Makers</p>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 p-4">
          <div className="flex items-center justify-between">
            <Building2 className="w-5 h-5 text-cyan-400" />
            <span className="text-2xl font-bold text-cyan-400">{stats.withCompany}</span>
          </div>
          <p className="text-xs text-zinc-500 mt-2 uppercase tracking-wide">Linked to Company</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
          <Input
            placeholder="Search contacts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-zinc-900 border-zinc-800 text-white placeholder:text-zinc-600"
          />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="border-zinc-800 bg-zinc-900 text-zinc-400 hover:text-white">
              <Filter className="w-4 h-4 mr-2" />
              {companyFilter ? companies.find((c) => c.id === companyFilter)?.name : "All Companies"}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="bg-zinc-900 border-zinc-800 max-h-64 overflow-auto">
            <DropdownMenuItem onClick={() => setCompanyFilter(null)} className="text-zinc-300 focus:bg-zinc-800">
              All Companies
            </DropdownMenuItem>
            {companies.map((company) => (
              <DropdownMenuItem
                key={company.id}
                onClick={() => setCompanyFilter(company.id)}
                className="text-zinc-300 focus:bg-zinc-800"
              >
                {company.name}
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
              <th className="text-left p-4 text-xs font-semibold uppercase tracking-wider text-zinc-500">Contact</th>
              <th className="text-left p-4 text-xs font-semibold uppercase tracking-wider text-zinc-500">Company</th>
              <th className="text-left p-4 text-xs font-semibold uppercase tracking-wider text-zinc-500">Role</th>
              <th className="text-left p-4 text-xs font-semibold uppercase tracking-wider text-zinc-500">Authority</th>
              <th className="text-left p-4 text-xs font-semibold uppercase tracking-wider text-zinc-500">
                Contact Info
              </th>
              <th className="w-12"></th>
            </tr>
          </thead>
          <tbody>
            {filteredContacts.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-8 text-center text-zinc-500">
                  {contacts.length === 0 ? (
                    <div className="space-y-2">
                      <UserCircle className="w-8 h-8 mx-auto text-zinc-600" />
                      <p>No contacts yet</p>
                      <Button
                        size="sm"
                        onClick={() => setIsAddModalOpen(true)}
                        className="bg-[#00ff88] text-black hover:bg-[#00ff88]/90"
                      >
                        Add your first contact
                      </Button>
                    </div>
                  ) : (
                    "No contacts match your search"
                  )}
                </td>
              </tr>
            ) : (
              filteredContacts.map((contact) => (
                <tr
                  key={contact.id}
                  className="border-b border-zinc-800/50 hover:bg-zinc-800/30 cursor-pointer transition-colors"
                  onClick={() => setSelectedContact(contact)}
                >
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-zinc-800 border border-zinc-700 flex items-center justify-center">
                        <span className="text-sm font-bold text-cyan-400">
                          {contact.first_name.charAt(0)}
                          {contact.last_name?.charAt(0) || ""}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-white">
                          {contact.first_name} {contact.last_name}
                        </p>
                        {contact.job_title && <p className="text-xs text-zinc-500">{contact.job_title}</p>}
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    {(contact as any).company ? (
                      <span className="text-sm text-zinc-400">{(contact as any).company.name}</span>
                    ) : (
                      <span className="text-sm text-zinc-600">No company</span>
                    )}
                  </td>
                  <td className="p-4">
                    <span className="text-sm text-zinc-400">{contact.department || "—"}</span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      {contact.is_decision_maker && <Crown className="w-4 h-4 text-yellow-400" />}
                      {contact.authority_level && (
                        <Badge className={authorityColors[contact.authority_level]}>
                          {contact.authority_level.replace("_", " ")}
                        </Badge>
                      )}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-3 text-zinc-500">
                      {contact.email && <Mail className="w-4 h-4" />}
                      {contact.phone && <Phone className="w-4 h-4" />}
                    </div>
                  </td>
                  <td className="p-4">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-zinc-500 hover:text-white">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="bg-zinc-900 border-zinc-800">
                        <DropdownMenuItem className="text-zinc-300 focus:bg-zinc-800">View Details</DropdownMenuItem>
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

      {selectedContact && <ContactDetailModal contact={selectedContact} onClose={() => setSelectedContact(null)} />}

      {isAddModalOpen && tenantId && (
        <AddContactModal tenantId={tenantId} companies={companies} onClose={() => setIsAddModalOpen(false)} />
      )}
    </div>
  )
}
