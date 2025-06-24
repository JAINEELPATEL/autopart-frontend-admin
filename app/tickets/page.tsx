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
import { Textarea } from "../../components/ui/textarea";
import { Avatar, AvatarFallback } from "../../components/ui/avatar";
import {
  Search,
  Filter,
  Eye,
  AlertCircle,
  Clock,
  CheckCircle,
  Calendar,
  ChevronDown,
  Upload,
  X,
  Image as ImageIcon,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useFeedbacks } from "@/hooks/useAdmin";
import { PaginationControl } from "@/components/pagination-control";
import { uploadImageToS3 } from "../utils/uploadImageToS3";

type FeedbackStatus = "open" | "resolved";

interface FeedbackMessage {
  id: string;
  message: string;
  screenshot_url: string[] | null;
  is_admin: boolean;
  created_at: string;
  sender_id?: string;
  sender?: {
    id: string;
    name: string;
    email: string;
  };
}

interface Feedback {
  id: string;
  status: string;
  created_at: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
  messages: FeedbackMessage[];
}

export default function TicketsPage() {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedFeedback, setSelectedFeedback] = useState<Feedback | null>(
    null
  );
  const [response, setResponse] = useState("");
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [fileUrls, setFileUrls] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);

  const {
    feedbacks,
    currentMessages,
    loading,
    error,
    pagination,
    fetchFeedbacks,
    fetchFeedbackMessages,
    updateFeedbackStatus,
    replyToFeedback,
    clearCurrentMessages,
  } = useFeedbacks();

  useEffect(() => {
    fetchFeedbacks({ page, limit });
  }, [page, limit]);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);

    // Check if adding these files would exceed the 5 file limit
    if (selectedFiles.length + files.length > 5) {
      toast({
        title: "Too many files",
        description: "You can only upload up to 5 images at once",
        variant: "destructive",
      });
      return;
    }

    setSelectedFiles((prev) => [...prev, ...files]);

    // Create preview URLs for images
    files.forEach((file) => {
      if (file.type.startsWith("image/")) {
        const url = URL.createObjectURL(file);
        setFileUrls((prev) => [...prev, url]);
      }
    });
  };

  const removeFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
    setFileUrls((prev) => prev.filter((_, i) => i !== index));
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "open":
        return (
          <Badge className="insight-badge insight-badge-red">
            <AlertCircle className="mr-1 h-3 w-3" />
            Open
          </Badge>
        );
      case "resolved":
        return (
          <Badge className="insight-badge insight-badge-green">
            <CheckCircle className="mr-1 h-3 w-3" />
            Resolved
          </Badge>
        );
      default:
        return null;
    }
  };

  const handleStatusUpdate = async (
    feedbackId: string,
    newStatus: FeedbackStatus
  ) => {
    try {
      // Step 1: Call the update API
      const result = await updateFeedbackStatus(feedbackId, {
        status: newStatus,
      });

      // Optional: Check result if needed
      if (!result?.success) {
        throw new Error("Update returned unsuccessful response");
      }

      // Step 2: Show success toast
      toast({
        title: "Status Updated",
        description: `Feedback ${feedbackId} status updated to ${newStatus}`,
      });

      // Step 3: Try-catch separately for fetching
      try {
        await fetchFeedbacks({ page, limit });
      } catch (fetchError) {
        console.warn("Fetch feedbacks failed", fetchError);
      }
    } catch (error) {
      console.error("Status update failed", error);
      // toast({
      //   title: "Error",
      //   description: "Failed to update status",
      //   variant: "destructive",
      // });
    }
  };

  const handleResponseSubmit = async () => {
    if (selectedFeedback && (response.trim() || selectedFiles.length > 0)) {
      setUploading(true);
      try {
        let screenshotUrls: string[] = [];

        // Upload files to S3 first
        if (selectedFiles.length > 0) {
          screenshotUrls = await Promise.all(
            selectedFiles.map((file) => uploadImageToS3(file))
          );
        }

        // Send the response with S3 URLs
        await replyToFeedback(selectedFeedback.id, {
          message: response,
          screenshotUrls: screenshotUrls,
        });

        toast({
          title: "Response Sent",
          description: `Response sent to ${selectedFeedback.user.name}`,
        });

        setResponse("");
        setSelectedFiles([]);
        setFileUrls([]);

        // Refresh messages
        fetchFeedbackMessages(selectedFeedback.id);
        // Refresh the feedbacks list
        fetchFeedbacks({ page, limit });
      } catch (error) {
        console.error("Error sending response:", error);
        toast({
          title: "Error",
          description: "Failed to send response",
          variant: "destructive",
        });
      } finally {
        setUploading(false);
      }
    }
  };

  const handleFeedbackClick = async (feedback: Feedback) => {
    setSelectedFeedback(feedback);
    await fetchFeedbackMessages(feedback.id);
  };

  const filteredFeedbacks = feedbacks.filter((feedback) => {
    const matchesSearch =
      feedback.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      feedback.user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      feedback.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || feedback.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const openCount = feedbacks.filter((f) => f.status === "open").length;
  const resolvedCount = feedbacks.filter((f) => f.status === "resolved").length;

  // Helper function to get sender name
  const getSenderName = (message: FeedbackMessage, feedback: Feedback) => {
    if (message.sender?.name) {
      return message.sender.name;
    }
    // If no sender info in message, use the feedback user info for non-admin messages
    if (!message.is_admin) {
      return feedback.user.name;
    }
    return "Admin";
  };

  return (
    <SidebarInset>
      <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b bg-background px-6">
        <div className="flex items-center gap-2">
          <SidebarTrigger className="-ml-2" />
          <h1 className="text-xl font-semibold">Support Tickets</h1>
        </div>
        {/* <Button>Assign Tickets</Button> */}
      </header>

      <div className="p-6">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search tickets..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[150px]">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="open">Open</SelectItem>
                <SelectItem value="resolved">Resolved</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline">
              Export <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="insight-card">
          <div className="insight-card-header">
            <div>
              <h2 className="insight-card-title">
                Support Tickets ({pagination?.total || 0})
              </h2>
              <div className="text-sm text-muted-foreground">
                Manage customer support requests
              </div>
            </div>
            <div className="flex gap-2">
              <Badge className="insight-badge insight-badge-red">
                Open: {openCount}
              </Badge>
              <Badge className="insight-badge insight-badge-green">
                Resolved: {resolvedCount}
              </Badge>
            </div>
          </div>
          <div className="overflow-hidden">
            <Table className="insight-table">
              <TableHeader>
                <TableRow>
                  <TableHead>Ticket ID</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Messages</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredFeedbacks.map((feedback) => (
                  <TableRow key={feedback.id}>
                    <TableCell className="font-medium">{feedback.id}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8 border">
                          <AvatarFallback>
                            {feedback.user.name.substring(0, 2)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">
                            {feedback.user.name}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {feedback.user.email}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(feedback.status)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <span className="text-sm">
                          {feedback.messages?.length || 0} messages
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-sm">
                        <Calendar className="h-3 w-3" />
                        {new Date(feedback.created_at).toLocaleDateString()}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleFeedbackClick(feedback)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-4xl max-h-[80vh] flex flex-col">
                          <DialogHeader>
                            <DialogTitle>
                              Ticket Details - {feedback.id}
                            </DialogTitle>
                            <DialogDescription>
                              Manage support ticket and respond to customer
                            </DialogDescription>
                          </DialogHeader>
                          {selectedFeedback && (
                            <div className="space-y-6 overflow-y-auto flex-1">
                              <div className="flex items-center gap-4 rounded-lg border p-4">
                                <Avatar className="h-12 w-12 border">
                                  <AvatarFallback>
                                    {selectedFeedback.user.name.substring(0, 2)}
                                  </AvatarFallback>
                                </Avatar>
                                <div className="flex-1">
                                  <h3 className="font-semibold">
                                    Support Ticket #{selectedFeedback.id}
                                  </h3>
                                  <p className="text-sm text-muted-foreground">
                                    Submitted by {selectedFeedback.user.name}
                                  </p>
                                  <div className="mt-2 flex gap-2">
                                    {getStatusBadge(selectedFeedback.status)}
                                  </div>
                                </div>
                              </div>

                              <div>
                                <label className="text-sm font-medium mb-2 block">
                                  Messages
                                </label>
                                <div className="h-[300px] w-full overflow-y-auto border rounded-md p-4">
                                  <div className="space-y-4">
                                    {currentMessages.map((message) => (
                                      <div
                                        key={message.id}
                                        className={`flex ${
                                          message.is_admin
                                            ? "justify-end"
                                            : "justify-start"
                                        }`}
                                      >
                                        <div
                                          className={`max-w-[70%] rounded-lg p-3 ${
                                            message.is_admin
                                              ? "bg-blue-100 text-blue-900"
                                              : "bg-gray-100 text-gray-900"
                                          }`}
                                        >
                                          <div className="flex items-center gap-2 mb-1">
                                            <span className="text-xs font-medium">
                                              {getSenderName(
                                                message,
                                                selectedFeedback
                                              )}
                                              {message.is_admin && " (Admin)"}
                                            </span>
                                            <span className="text-xs opacity-70">
                                              {new Date(
                                                message.created_at
                                              ).toLocaleString()}
                                            </span>
                                          </div>
                                          <p className="text-sm mb-2">
                                            {message.message}
                                          </p>
                                          {message.screenshot_url &&
                                            message.screenshot_url.length >
                                              0 && (
                                              <div className="flex flex-wrap gap-2">
                                                {message.screenshot_url.map(
                                                  (url, index) => (
                                                    <div
                                                      key={index}
                                                      className="relative"
                                                    >
                                                      <img
                                                        src={url}
                                                        alt={`Screenshot ${
                                                          index + 1
                                                        }`}
                                                        className="w-20 h-20 object-cover rounded border cursor-pointer hover:opacity-80"
                                                        onClick={() =>
                                                          window.open(
                                                            url,
                                                            "_blank"
                                                          )
                                                        }
                                                      />
                                                    </div>
                                                  )
                                                )}
                                              </div>
                                            )}
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              </div>

                              <div>
                                <label className="text-sm font-medium">
                                  Admin Response
                                </label>
                                <Textarea
                                  placeholder="Type your response here..."
                                  value={response}
                                  onChange={(e) => setResponse(e.target.value)}
                                  className="mt-2"
                                  rows={4}
                                />

                                {/* File Upload Section */}
                                <div className="mt-4">
                                  <label className="text-sm font-medium">
                                    Attach Screenshots (Max 5 images)
                                  </label>
                                  <div className="mt-2 space-y-2">
                                    <div className="flex items-center gap-2">
                                      <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={() =>
                                          document
                                            .getElementById("file-upload")
                                            ?.click()
                                        }
                                        disabled={selectedFiles.length >= 5}
                                      >
                                        <Upload className="h-4 w-4 mr-2" />
                                        Upload Images ({selectedFiles.length}/5)
                                      </Button>
                                      <input
                                        id="file-upload"
                                        type="file"
                                        multiple
                                        accept="image/*"
                                        className="hidden"
                                        onChange={handleFileSelect}
                                      />
                                    </div>

                                    {/* File Previews */}
                                    {fileUrls.length > 0 && (
                                      <div className="flex flex-wrap gap-2 mt-2">
                                        {fileUrls.map((url, index) => (
                                          <div key={index} className="relative">
                                            <img
                                              src={url}
                                              alt={`Preview ${index + 1}`}
                                              className="w-20 h-20 object-cover rounded border"
                                            />
                                            <Button
                                              type="button"
                                              variant="destructive"
                                              size="sm"
                                              className="absolute -top-2 -right-2 h-6 w-6 p-0"
                                              onClick={() => removeFile(index)}
                                            >
                                              <X className="h-3 w-3" />
                                            </Button>
                                          </div>
                                        ))}
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>

                              <div className="flex justify-between items-center pt-4 border-t">
                                <div className="flex gap-2">
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() =>
                                      handleStatusUpdate(
                                        selectedFeedback.id,
                                        "open"
                                      )
                                    }
                                    className="text-red-600"
                                  >
                                    Mark Open
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() =>
                                      handleStatusUpdate(
                                        selectedFeedback.id,
                                        "resolved"
                                      )
                                    }
                                    className="text-green-600"
                                  >
                                    Mark Resolved
                                  </Button>
                                </div>
                                <Button
                                  onClick={handleResponseSubmit}
                                  disabled={
                                    !response.trim() &&
                                    selectedFiles.length === 0
                                  }
                                >
                                  Send Response
                                </Button>
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
          </div>
        </div>

        <div className="mt-4">
          <PaginationControl
            currentPage={page}
            totalPages={pagination?.pages || 1}
            onPageChange={handlePageChange}
            isLoading={loading}
            siblingCount={1}
          />
        </div>
      </div>
    </SidebarInset>
  );
}
