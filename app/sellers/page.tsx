"use client";

import { useState, useEffect } from "react";
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
import { Avatar, AvatarFallback } from "../../components/ui/avatar";
import {
  Search,
  Filter,
  Eye,
  Ban,
  CheckCircle,
  Clock,
  ChevronDown,
  Plus,
  Loader2,
} from "lucide-react";
import { useToast } from "../../hooks/use-toast";
import { useUsers } from "@/hooks/useAdmin";
import { PaginationControl } from "@/components/pagination-control";

export default function SellersPage() {
  const { toast } = useToast();
  const {
    users,
    loading,
    error,
    pagination,
    fetchUsers,
    updateUserStatus,
    verifySeller,
  } = useUsers();

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedSeller, setSelectedSeller] = useState<any | null>(null);
  const [page, setPage] = useState(1);

  useEffect(() => {
    fetchUsers({ page, limit: 10, userType: "seller" });
  }, [page]);

  // Filter sellers from users
  const sellers = users.filter((user) => user.type === "seller");

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <Badge className="insight-badge insight-badge-yellow">
            <Clock className="mr-1 h-3 w-3" />
            Pending
          </Badge>
        );
      case "verified":
        return (
          <Badge className="insight-badge insight-badge-blue">
            <CheckCircle className="mr-1 h-3 w-3" />
            Verified
          </Badge>
        );
      case "inactive":
        return (
          <Badge className="insight-badge insight-badge-gray">
            <CheckCircle className="mr-1 h-3 w-3" />
            Inactive
          </Badge>
        );
      case "active":
        return (
          <Badge className="insight-badge insight-badge-green">
            <CheckCircle className="mr-1 h-3 w-3" />
            Active
          </Badge>
        );
      case "banned":
        return (
          <Badge className="insight-badge insight-badge-red">
            <Ban className="mr-1 h-3 w-3" />
            Banned
          </Badge>
        );
      default:
        return null;
    }
  };

  const handleUpdateUserStatus = async (sellerId: string, status: string) => {
    try {
      await updateUserStatus(sellerId, { status });
      toast({
        title: "User Status Updated",
        description: `User status has been updated to ${status}`,
      });
      // Refresh the list
      fetchUsers({ page, limit: 10, userType: "seller" });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update user status",
        variant: "destructive",
      });
    }
  };

  const handleVerifySeller = async (sellerId: string) => {
    try {
      await verifySeller(sellerId);
      toast({
        title: "Seller Verified",
        description: "Seller has been successfully verified",
      });
      // Refresh the list
      fetchUsers({ page, limit: 10, userType: "seller" });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to verify seller",
        variant: "destructive",
      });
    }
  };

  const filteredSellers = sellers.filter((seller) => {
    const matchesSearch =
      seller.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      seller.company_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      seller.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || seller.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen w-full overflow-hidden">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }
  if (error) return <div>Error: {error}</div>;
  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  return (
    <SidebarInset>
      <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b bg-background px-6">
        <div className="flex items-center gap-2">
          <SidebarTrigger className="-ml-2" />
          <h1 className="text-xl font-semibold">Sellers Management</h1>
        </div>
        {/* <Button>
          <Plus className="mr-2 h-4 w-4" /> Add Seller
        </Button> */}
      </header>

      <div className="p-6">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search sellers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
          <div className="flex gap-2">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="verified">Verified</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="banned">Banned</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline">
              Export <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="insight-card">
          <div className="insight-card-header">
            <h2 className="insight-card-title">Sellers ({pagination.total})</h2>
            <div className="text-sm text-muted-foreground">
              Manage seller accounts and verification status
            </div>
          </div>
          <div className="overflow-hidden">
            <Table className="insight-table">
              <TableHeader>
                <TableRow>
                  <TableHead>Seller Info</TableHead>
                  <TableHead>Business</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Quotations</TableHead>
                  {/* <TableHead>Rating</TableHead> */}
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSellers.map((seller) => (
                  <TableRow key={seller.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-9 w-9 border">
                          <AvatarFallback>
                            {seller.name.substring(0, 2)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{seller.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {seller.email}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{seller.company_name}</div>
                        <div className="text-sm text-muted-foreground">
                          {seller.address}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(seller.status)}</TableCell>
                    <TableCell>
                      <div className="font-medium">
                        {seller.quotation_count}
                      </div>
                    </TableCell>
                    {/* <TableCell>
                      {seller.rating > 0 ? (
                        <div className="flex items-center">
                          <span className="text-yellow-500 mr-1">★</span>
                          <span className="font-medium">{seller.rating}</span>
                          <span className="text-sm text-muted-foreground ml-1">
                            /5
                          </span>
                        </div>
                      ) : (
                        <span className="text-muted-foreground">
                          No ratings
                        </span>
                      )}
                    </TableCell> */}
                    <TableCell>
                      <div className="flex gap-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setSelectedSeller(seller)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl">
                            <DialogHeader>
                              <DialogTitle>Seller Details</DialogTitle>
                              <DialogDescription>
                                Manage seller status and view detailed
                                information
                              </DialogDescription>
                            </DialogHeader>
                            {selectedSeller && (
                              <div className="space-y-6">
                                <div className="flex items-center gap-4">
                                  <Avatar className="h-16 w-16 border">
                                    <AvatarFallback className="text-lg">
                                      {selectedSeller.name.substring(0, 2)}
                                    </AvatarFallback>
                                  </Avatar>
                                  <div>
                                    <h3 className="text-lg font-semibold">
                                      {selectedSeller.name}
                                    </h3>
                                    <p className="text-muted-foreground">
                                      {selectedSeller.businessName}
                                    </p>
                                    <div className="mt-1">
                                      {getStatusBadge(selectedSeller.status)}
                                    </div>
                                  </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4 rounded-lg border p-4">
                                  <div>
                                    <label className="text-sm font-medium text-muted-foreground">
                                      Email
                                    </label>
                                    <p className="font-medium">
                                      {selectedSeller.email}
                                    </p>
                                  </div>
                                  <div>
                                    <label className="text-sm font-medium text-muted-foreground">
                                      Phone
                                    </label>
                                    <p className="font-medium">
                                      {selectedSeller.phone_number}
                                    </p>
                                  </div>
                                  <div>
                                    <label className="text-sm font-medium text-muted-foreground">
                                      Location
                                    </label>
                                    <p className="font-medium">
                                      {selectedSeller.address}
                                    </p>
                                  </div>
                                  <div>
                                    <label className="text-sm font-medium text-muted-foreground">
                                      Registration Date
                                    </label>
                                    <p className="font-medium">
                                      {new Date(
                                        selectedSeller.created_at
                                      ).toLocaleDateString()}
                                    </p>
                                  </div>
                                  <div>
                                    <label className="text-sm font-medium text-muted-foreground">
                                      Company Name
                                    </label>
                                    <p className="font-medium">
                                      {selectedSeller.company_name}
                                    </p>
                                  </div>
                                  {/*<div>
                                    <label className="text-sm font-medium text-muted-foreground">
                                      Company Description
                                    </label>
                                    <p className="font-medium">
                                      {selectedSeller.company_description}
                                    </p>
                                  </div>
                                   <div>
                                    <label className="text-sm font-medium text-muted-foreground">
                                      Company Registration Number
                                    </label>
                                    <p className="font-medium">
                                      {selectedSeller.registration_number}
                                    </p>
                                  </div>
                                  <div>
                                    <label className="text-sm font-medium text-muted-foreground">
                                      Company VAT Number
                                    </label>
                                    <p className="font-medium">
                                      {selectedSeller.vat_number}
                                    </p>
                                  </div>
                                  <div>
                                    <label className="text-sm font-medium text-muted-foreground">
                                      Company Legal Status
                                    </label>
                                    <p className="font-medium">
                                      {selectedSeller.legal_status}
                                    </p>
                                  </div>
                                  <div>
                                    <label className="text-sm font-medium text-muted-foreground">
                                      Company Established Year
                                    </label>
                                    <p className="font-medium">
                                      {selectedSeller.established_year}
                                    </p>
                                  </div> */}
                                  <div>
                                    <label className="text-sm font-medium text-muted-foreground">
                                      Last Activity
                                    </label>
                                    <p className="font-medium">
                                      {new Date(
                                        selectedSeller.last_quotation_date
                                      ).toLocaleDateString()}
                                    </p>
                                  </div>
                                </div>
                                <div>
                                  <label className="text-sm font-medium">
                                    Change Status
                                  </label>
                                  <div className="mt-2 flex flex-wrap gap-2">
                                    {selectedSeller.status === "pending" && (
                                      <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() =>
                                          handleVerifySeller(selectedSeller.id)
                                        }
                                        className="text-blue-600"
                                      >
                                        <CheckCircle className="mr-1 h-4 w-4" />
                                        Verify
                                      </Button>
                                    )}
                                    {selectedSeller.status !== "active" && (
                                      <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() =>
                                          handleUpdateUserStatus(
                                            selectedSeller.id,
                                            "active"
                                          )
                                        }
                                        className="text-green-600"
                                      >
                                        <CheckCircle className="mr-1 h-4 w-4" />
                                        Activate
                                      </Button>
                                    )}
                                    {selectedSeller.status !== "inactive" && (
                                      <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() =>
                                          handleUpdateUserStatus(
                                            selectedSeller.id,
                                            "inactive"
                                          )
                                        }
                                        className="text-gray-600"
                                      >
                                        <CheckCircle className="mr-1 h-4 w-4" />
                                        Inactivate
                                      </Button>
                                    )}
                                    {selectedSeller.status !== "banned" && (
                                      <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() =>
                                          handleUpdateUserStatus(
                                            selectedSeller.id,
                                            "banned"
                                          )
                                        }
                                        className="text-red-600"
                                      >
                                        <Ban className="mr-1 h-4 w-4" />
                                        Ban
                                      </Button>
                                    )}
                                  </div>
                                </div>

                                {/* <div className="flex justify-end gap-2">
                                  <Button variant="outline">
                                    View Quotations
                                  </Button>
                                  <Button>Save Changes</Button>
                                </div> */}
                              </div>
                            )}
                          </DialogContent>
                        </Dialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
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
