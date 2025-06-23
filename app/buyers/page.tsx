"use client";

import { useState, useEffect, useCallback } from "react";
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
import { PaginationControl } from "../../components/pagination-control";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
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
  Eye,
  Ban,
  CheckCircle,
  Clock,
  MessageSquare,
  Calendar,
  Loader2,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useUsers } from "@/hooks/useAdmin";

export default function BuyersPage() {
  const { toast } = useToast();
  const { users, loading, error, pagination, fetchUsers, updateUserStatus } =
    useUsers();

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedBuyer, setSelectedBuyer] = useState<any>(null);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);

  useEffect(() => {
    fetchUsers({ page, limit: 10, userType: "buyer" });
  }, [page]);

  // Filter buyers from users
  const buyers = users.filter((user) => user.type === "buyer");

  const getStatusBadge = (status: string) => {
    switch (status) {
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
      case "inactive":
        return (
          <Badge className="insight-badge insight-badge-yellow">
            <Clock className="mr-1 h-3 w-3" />
            Inactive
          </Badge>
        );
      default:
        return null;
    }
  };

  const handleStatusChange = async (buyerId: string, newStatus: string) => {
    try {
      await updateUserStatus(buyerId, { status: newStatus });
      toast({
        title: "Status Updated",
        description: `Buyer status has been updated to ${newStatus}`,
      });
      // Refresh the list
      fetchUsers({ page, limit: 10, userType: "buyer" });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update buyer status",
        variant: "destructive",
      });
    }
  };

  const fetchData = useCallback(async () => {
    try {
      await fetchUsers({
        page,
        limit,
        userType: "buyer",
        search: searchTerm,
        status: statusFilter !== "all" ? statusFilter : undefined,
      });
      console.log("users fetched", users);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  }, [page, limit, searchTerm, statusFilter, fetchUsers]);

  const handleStatusFilter = (status: string) => {
    setStatusFilter(status);
    setPage(1);
    fetchData();
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const filteredBuyers = buyers.filter((buyer) => {
    const matchesSearch =
      buyer.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      buyer.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || buyer.status === statusFilter;
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

  return (
    <SidebarInset>
      <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
        <SidebarTrigger className="-ml-1" />
        <div className="flex flex-1 items-center gap-2">
          <h1 className="text-lg font-semibold">Buyers Management</h1>
        </div>
      </header>

      <div className="flex-1 space-y-6 p-6">
        {/* Search */}
        <Card>
          <CardHeader>
            <CardTitle>Search Buyers</CardTitle>
            <CardDescription>Find and manage buyer accounts</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search buyers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
          </CardContent>
        </Card>

        {/* Buyers Table */}
        <Card>
          <CardHeader>
            <CardTitle>Buyers ({pagination.total})</CardTitle>
            <CardDescription>
              All registered buyers on the platform
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Buyer Info</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Activity</TableHead>
                  <TableHead>Email Verification</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredBuyers.map((buyer) => (
                  <TableRow key={buyer.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{buyer.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {buyer.address}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Joined:{" "}
                          {new Date(buyer.created_at).toLocaleDateString()}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="text-sm">{buyer.email}</div>
                        <div className="text-sm text-muted-foreground">
                          {buyer.phone}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="flex items-center gap-1">
                          <MessageSquare className="w-4 h-4" />
                          <span className="text-sm">
                            {buyer.enquiry_count} enquiries
                          </span>
                        </div>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Calendar className="w-3 h-3" />
                          <span>
                            Last:{" "}
                            {new Date(
                              buyer.last_enquiry_date
                            ).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          buyer.status === "active" ? "default" : "secondary"
                        }
                      >
                        {buyer.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSelectedBuyer(buyer)}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>Buyer Details</DialogTitle>
                            <DialogDescription>
                              View detailed buyer information and activity
                            </DialogDescription>
                          </DialogHeader>
                          {selectedBuyer && (
                            <div className="space-y-4">
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <label className="text-sm font-medium">
                                    Name
                                  </label>
                                  <p className="text-sm text-muted-foreground">
                                    {selectedBuyer.name}
                                  </p>
                                </div>
                                <div>
                                  <label className="text-sm font-medium">
                                    Email
                                  </label>
                                  <p className="text-sm text-muted-foreground">
                                    {selectedBuyer.email}
                                  </p>
                                </div>
                                <div>
                                  <label className="text-sm font-medium">
                                    Phone
                                  </label>
                                  <p className="text-sm text-muted-foreground">
                                    {selectedBuyer.phone_number}
                                  </p>
                                </div>
                                <div>
                                  <label className="text-sm font-medium">
                                    Location
                                  </label>
                                  <p className="text-sm text-muted-foreground">
                                    {selectedBuyer.location}
                                  </p>
                                </div>
                                <div>
                                  <label className="text-sm font-medium">
                                    Registration Date
                                  </label>
                                  <p className="text-sm text-muted-foreground">
                                    {new Date(
                                      selectedBuyer.created_at
                                    ).toLocaleDateString()}
                                  </p>
                                </div>
                                <div>
                                  <label className="text-sm font-medium">
                                    Total Enquiries
                                  </label>
                                  <p className="text-sm text-muted-foreground">
                                    {selectedBuyer.enquiry_count}
                                  </p>
                                </div>
                                <div>
                                  <label className="text-sm font-medium">
                                    Last Activity
                                  </label>
                                  <p className="text-sm text-muted-foreground">
                                    {new Date(
                                      selectedBuyer.last_enquiry_date
                                    ).toLocaleDateString()}
                                  </p>
                                </div>
                                <div>
                                  <label className="text-sm font-medium">
                                    Status
                                  </label>
                                  <div className="mt-1">
                                    <Badge
                                      variant={
                                        selectedBuyer.status === "active"
                                          ? "default"
                                          : "secondary"
                                      }
                                    >
                                      {selectedBuyer.status}
                                    </Badge>
                                  </div>
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
            <div className="mt-4">
              <PaginationControl
                currentPage={page}
                totalPages={pagination.pages || 1}
                onPageChange={handlePageChange}
                isLoading={loading}
                siblingCount={1}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </SidebarInset>
  );
}
