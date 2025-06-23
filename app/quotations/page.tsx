"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { SidebarInset, SidebarTrigger } from "../../components/ui/sidebar";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Badge } from "../../components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../components/ui/dialog";
import {
  Search,
  Filter,
  Eye,
  DollarSign,
  Calendar,
  User,
  Building,
} from "lucide-react";
import { useQuotations } from "@/hooks/useAdmin";
import { PaginationControl } from "@/components/pagination-control";

type QuotationStatus = "pending" | "accepted" | "rejected" | "expired";

export default function QuotationsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [page, setPage] = useState(1);
  const [selectedQuotation, setSelectedQuotation] = useState<any | null>(null);

  const { quotations, loading, error, fetchQuotations, pagination } =
    useQuotations();

  useEffect(() => {
    fetchQuotations({ page, limit: 10 });
  }, [page]);

  const getStatusBadge = (status: QuotationStatus) => {
    switch (status) {
      case "pending":
        return (
          <Badge variant="outline" className="text-yellow-600">
            Pending
          </Badge>
        );
      case "accepted":
        return (
          <Badge variant="outline" className="text-green-600">
            Accepted
          </Badge>
        );
      case "rejected":
        return (
          <Badge variant="outline" className="text-red-600">
            Rejected
          </Badge>
        );
      case "expired":
        return (
          <Badge variant="outline" className="text-gray-600">
            Expired
          </Badge>
        );
      default:
        return null;
    }
  };

  const filteredQuotations = quotations.filter((quotation) => {
    const matchesSearch =
      quotation.quotation_items
        .map((item: any) => item.enquiry_item.product_type.name)
        .join(", ")
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      quotation.seller.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      quotation.enquiry.buyer.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      quotation.enquiry.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" ||
      quotation.quotation_items[0].status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  return (
    <SidebarInset>
      <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
        <SidebarTrigger className="-ml-1" />
        <div className="flex flex-1 items-center gap-2">
          <h1 className="text-lg font-semibold">Quotations Management</h1>
        </div>
      </header>

      <div className="flex-1 space-y-6 p-6">
        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle>Filters</CardTitle>
            <CardDescription>Search and filter quotations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search quotations..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-8"
                  />
                </div>
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[180px]">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="accepted">Accepted</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                  <SelectItem value="expired">Expired</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Quotations Table */}
        <Card>
          <CardHeader>
            <CardTitle>Quotations ({filteredQuotations.length})</CardTitle>
            <CardDescription>All quotations sent by sellers</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Quotation ID</TableHead>
                  <TableHead>Enquiry</TableHead>
                  <TableHead>Seller</TableHead>
                  <TableHead>Buyer</TableHead>
                  <TableHead>Part & Price</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Valid Until</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredQuotations.map((quotation) => (
                  <TableRow key={quotation.id}>
                    <TableCell className="font-medium">
                      {quotation.id}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {quotation.enquiry.id}
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">
                          {quotation.seller.name}
                        </div>
                        <div className="text-sm text-muted-foreground flex items-center gap-1">
                          <Building className="w-3 h-3" />
                          {quotation.seller.company_name}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <User className="w-3 h-3" />
                        <span className="text-sm">
                          {quotation.enquiry.buyer.name}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">
                          {quotation.quotation_items
                            .map(
                              (item: any) => item.enquiry_item.product_type.name
                            )
                            .join(", ")}
                        </div>
                        <div className="text-sm text-muted-foreground flex items-center gap-1">
                          <DollarSign className="w-3 h-3" />
                          {quotation.total_price}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(
                        quotation.quotation_items[0].status as QuotationStatus
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-sm">
                        <Calendar className="w-3 h-3" />
                        {new Date(
                          quotation.enquiry.created_at
                        ).toLocaleDateString()}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSelectedQuotation(quotation)}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-3xl">
                          <DialogHeader>
                            <DialogTitle>
                              Quotation Details - {quotation.id}
                            </DialogTitle>
                            <DialogDescription>
                              View detailed quotation information
                            </DialogDescription>
                          </DialogHeader>
                          {selectedQuotation && (
                            <div className="space-y-6">
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <label className="text-sm font-medium">
                                    Quotation ID
                                  </label>
                                  <p className="text-sm text-muted-foreground mt-1">
                                    {selectedQuotation.id}
                                  </p>
                                </div>
                                <div>
                                  <label className="text-sm font-medium">
                                    Related Enquiry
                                  </label>
                                  <p className="text-sm text-muted-foreground mt-1">
                                    {selectedQuotation.enquiry.id}
                                  </p>
                                </div>
                                <div>
                                  <label className="text-sm font-medium">
                                    Seller Information
                                  </label>
                                  <div className="mt-1 space-y-1">
                                    <p className="text-sm">
                                      {selectedQuotation.seller.name}
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                      {selectedQuotation.seller.company_name}
                                    </p>
                                  </div>
                                </div>
                                <div>
                                  <label className="text-sm font-medium">
                                    Buyer
                                  </label>
                                  <p className="text-sm text-muted-foreground mt-1">
                                    {selectedQuotation.enquiry.buyer.name}
                                  </p>
                                </div>
                                <div>
                                  <label className="text-sm font-medium">
                                    Part Name
                                  </label>
                                  <p className="text-sm text-muted-foreground mt-1">
                                    {selectedQuotation.quotation_items
                                      .map(
                                        (item: any) =>
                                          item.enquiry_item.product_type.name
                                      )
                                      .join(", ")}
                                  </p>
                                </div>
                                <div>
                                  <label className="text-sm font-medium">
                                    Price
                                  </label>
                                  <p className="text-sm text-muted-foreground mt-1">
                                    {selectedQuotation.total_price}
                                  </p>
                                </div>
                                <div>
                                  <label className="text-sm font-medium">
                                    Delivery Time
                                  </label>
                                  <p className="text-sm text-muted-foreground mt-1">
                                    {selectedQuotation.quotation_items
                                      .map((item: any) =>
                                        new Date(
                                          item.delivery_time
                                        ).toLocaleDateString()
                                      )
                                      .join(", ")}
                                  </p>
                                </div>
                                <div>
                                  <label className="text-sm font-medium">
                                    Warranty
                                  </label>
                                  <p className="text-sm text-muted-foreground mt-1">
                                    {selectedQuotation.quotation_items
                                      .map((item: any) => item.guarantee)
                                      .join(", ")}
                                  </p>
                                </div>
                                <div>
                                  <label className="text-sm font-medium">
                                    Status
                                  </label>
                                  <div className="mt-1">
                                    {getStatusBadge(
                                      selectedQuotation.quotation_items[0]
                                        .status as QuotationStatus
                                    )}
                                  </div>
                                </div>
                                <div>
                                  <label className="text-sm font-medium">
                                    Valid Until
                                  </label>
                                  <p className="text-sm text-muted-foreground mt-1">
                                    {new Date(
                                      selectedQuotation.enquiry.created_at
                                    ).toLocaleDateString()}
                                  </p>
                                </div>
                              </div>
                              <div>
                                <label className="text-sm font-medium">
                                  Description
                                </label>
                                <p className="text-sm text-muted-foreground mt-1 p-3 bg-muted rounded-md">
                                  {selectedQuotation.quotation_items
                                    .map(
                                      (item: any) => item.enquiry_item.details
                                    )
                                    .join(", ")}
                                </p>
                              </div>
                              <div>
                                <label className="text-sm font-medium">
                                  Created Date
                                </label>
                                <p className="text-sm text-muted-foreground mt-1">
                                  {new Date(
                                    selectedQuotation.created_at
                                  ).toLocaleDateString()}
                                </p>
                              </div>
                            </div>
                          )}
                        </DialogContent>
                      </Dialog>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        <div className="mt-4">
          <PaginationControl
            currentPage={page}
            totalPages={pagination.pages || 1}
            onPageChange={handlePageChange}
            isLoading={loading}
            siblingCount={1}
          />
        </div>
      </div>
    </SidebarInset>
  );
}
