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
import { Search, Filter, Eye, Car, Calendar } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useEnquiries } from "@/hooks/useAdmin";
import { PaginationControl } from "@/components/pagination-control";

type EnquiryStatus = "open" | "quoted" | "closed" | "expired";

export default function EnquiriesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedEnquiry, setSelectedEnquiry] = useState<any | null>(null);
  const { enquiries, loading, error, fetchEnquiries, pagination } =
    useEnquiries();
  const { toast } = useToast();
  const [page, setPage] = useState(1);

  useEffect(() => {
    fetchEnquiries({ page, limit: 10 });
  }, [page]);

  // const enquiries: Enquiry[] = [
  //   {
  //     id: "ENQ001",
  //     buyerName: "Alice Cooper",
  //     buyerEmail: "alice@email.com",
  //     partName: "Brake Pads",
  //     vehicleMake: "Toyota",
  //     vehicleModel: "Camry",
  //     vehicleYear: "2020",
  //     description:
  //       "Need front brake pads for Toyota Camry 2020. OEM preferred.",
  //     status: "open",
  //     createdDate: "2024-01-25",
  //     quotationsReceived: 3,
  //     urgency: "high",
  //   },
  //   {
  //     id: "ENQ002",
  //     buyerName: "Bob Johnson",
  //     buyerEmail: "bob@email.com",
  //     partName: "Engine Oil Filter",
  //     vehicleMake: "Honda",
  //     vehicleModel: "Civic",
  //     vehicleYear: "2019",
  //     description: "Looking for engine oil filter for Honda Civic 2019.",
  //     status: "quoted",
  //     createdDate: "2024-01-24",
  //     quotationsReceived: 5,
  //     urgency: "medium",
  //   },
  //   {
  //     id: "ENQ003",
  //     buyerName: "Charlie Brown",
  //     buyerEmail: "charlie@email.com",
  //     partName: "Headlight Assembly",
  //     vehicleMake: "Ford",
  //     vehicleModel: "F-150",
  //     vehicleYear: "2021",
  //     description: "Right side headlight assembly needed for Ford F-150 2021.",
  //     status: "closed",
  //     createdDate: "2024-01-20",
  //     quotationsReceived: 2,
  //     urgency: "low",
  //   },
  // ];

  const getStatusBadge = (status: EnquiryStatus) => {
    switch (status) {
      case "open":
        return (
          <Badge variant="outline" className="text-green-600">
            Open
          </Badge>
        );
      case "quoted":
        return (
          <Badge variant="outline" className="text-blue-600">
            Quoted
          </Badge>
        );
      case "closed":
        return (
          <Badge variant="outline" className="text-gray-600">
            Closed
          </Badge>
        );
      case "expired":
        return (
          <Badge variant="outline" className="text-red-600">
            Expired
          </Badge>
        );
      default:
        return null;
    }
  };

  // const getUrgencyBadge = (urgency: string) => {
  //   switch (urgency) {
  //     case "high":
  //       return <Badge variant="destructive">High</Badge>;
  //     case "medium":
  //       return (
  //         <Badge variant="outline" className="text-yellow-600">
  //           Medium
  //         </Badge>
  //       );
  //     case "low":
  //       return <Badge variant="secondary">Low</Badge>;
  //     default:
  //       return null;
  //   }
  // };

  const filteredEnquiries = enquiries.filter((enquiry) => {
    const matchesSearch =
      enquiry.enquiry_items
        .map((item) => item.product_type.name)
        .join(", ")
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      enquiry.buyer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      enquiry.vehicle.make.toLowerCase().includes(searchTerm.toLowerCase()) ||
      enquiry.vehicle.model.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || enquiry.status === statusFilter;
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
          <h1 className="text-lg font-semibold">Enquiries Management</h1>
        </div>
      </header>

      <div className="flex-1 space-y-6 p-6">
        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle>Filters</CardTitle>
            <CardDescription>Search and filter enquiries</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search enquiries..."
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
                  <SelectItem value="open">Open</SelectItem>
                  <SelectItem value="quoted">Quoted</SelectItem>
                  <SelectItem value="closed">Closed</SelectItem>
                  <SelectItem value="expired">Expired</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Enquiries Table */}
        <Card>
          <CardHeader>
            <CardTitle>Enquiries ({pagination.total})</CardTitle>
            <CardDescription>All part enquiries from buyers</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Enquiry ID</TableHead>
                  <TableHead>Buyer</TableHead>
                  <TableHead>Part & Vehicle</TableHead>
                  <TableHead>Status</TableHead>
                  {/* <TableHead>Urgency</TableHead> */}
                  <TableHead>Quotations</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEnquiries.map((enquiry) => (
                  <TableRow key={enquiry.id}>
                    <TableCell className="font-medium">{enquiry.id}</TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{enquiry.buyer.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {enquiry.buyer.email}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">
                          {enquiry.enquiry_items
                            .map((item) => item.product_type.name)
                            .join(", ")}
                        </div>
                        <div className="text-sm text-muted-foreground flex items-center gap-1">
                          <Car className="w-3 h-3" />
                          {enquiry.vehicle.make} {enquiry.vehicle.model}{" "}
                          {enquiry.vehicle.year}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(enquiry.status as EnquiryStatus)}
                    </TableCell>
                    {/* <TableCell>{getUrgencyBadge(enquiry.urgency)}</TableCell> */}
                    <TableCell>{enquiry.quotation_count}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-sm">
                        <Calendar className="w-3 h-3" />
                        {new Date(enquiry.created_at).toLocaleDateString()}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSelectedEnquiry(enquiry)}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-3xl">
                          <DialogHeader>
                            <DialogTitle>
                              Enquiry Details - {enquiry.id}
                            </DialogTitle>
                            <DialogDescription>
                              View detailed enquiry information and quotations
                            </DialogDescription>
                          </DialogHeader>
                          {selectedEnquiry && (
                            <div className="space-y-6">
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <label className="text-sm font-medium">
                                    Buyer Information
                                  </label>
                                  <div className="mt-1 space-y-1">
                                    <p className="text-sm">
                                      {selectedEnquiry.buyer.name}
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                      {selectedEnquiry.buyer.email}
                                    </p>
                                  </div>
                                </div>
                                <div>
                                  <label className="text-sm font-medium">
                                    Vehicle Information
                                  </label>
                                  <div className="mt-1 space-y-1">
                                    <p className="text-sm">
                                      {selectedEnquiry.vehicle.make}{" "}
                                      {selectedEnquiry.vehicle.model}
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                      Year: {selectedEnquiry.vehicle.year}
                                    </p>
                                  </div>
                                </div>
                                <div>
                                  <label className="text-sm font-medium">
                                    Part Required
                                  </label>
                                  <p className="text-sm text-muted-foreground mt-1">
                                    {selectedEnquiry.enquiry_items
                                      .map(
                                        (item: any) => item.product_type.name
                                      )
                                      .join(", ")}
                                  </p>
                                </div>
                                <div>
                                  <label className="text-sm font-medium">
                                    Status & Urgency
                                  </label>
                                  <div className="mt-1 flex gap-2">
                                    {getStatusBadge(
                                      selectedEnquiry.status as EnquiryStatus
                                    )}
                                    {/* {getUrgencyBadge(selectedEnquiry.urgency)} */}
                                  </div>
                                </div>
                              </div>
                              <div>
                                <label className="text-sm font-medium">
                                  Description
                                </label>
                                <p className="text-sm text-muted-foreground mt-1 p-3 bg-muted rounded-md">
                                  {selectedEnquiry.enquiry_items
                                    .map((item: any) => item.details)
                                    .join(", ")}
                                </p>
                              </div>
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <label className="text-sm font-medium">
                                    Created Date
                                  </label>
                                  <p className="text-sm text-muted-foreground mt-1">
                                    {new Date(
                                      selectedEnquiry.created_at
                                    ).toLocaleDateString()}
                                  </p>
                                </div>
                                <div>
                                  <label className="text-sm font-medium">
                                    Quotations Received
                                  </label>
                                  <p className="text-sm text-muted-foreground mt-1">
                                    {selectedEnquiry.quotation_count} quotations
                                  </p>
                                </div>
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
