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
  MessageSquare,
  Calendar,
  User,
  Building,
} from "lucide-react";
import { useConversations } from "@/hooks/useAdmin";
import { PaginationControl } from "@/components/pagination-control";

interface Message {
  id: string;
  sender: string;
  content: string;
  timestamp: string;
  type: "buyer" | "seller";
}

interface Conversation {
  id: string;
  room_id: string;
  buyerName: string;
  sellerName: string;
  sellerBusiness: string;
  partName: string;
  lastMessage: string;
  lastMessageTime: string;
  messageCount: number;
  status: "active" | "resolved" | "escalated";
  messages: Message[];
}

export default function MessagesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedConversation, setSelectedConversation] =
    useState<Conversation | null>(null);
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const {
    conversations,
    currentMessages,
    loading,
    error,
    pagination,
    fetchConversations,
    fetchMessagesBetween,
  } = useConversations();

  useEffect(() => {
    fetchConversations({ page, limit });
  }, [page]);

  const handleRoomClick = (conversation: any) => {
    setSelectedRoom(conversation.room_id);
    setSelectedConversation(conversation);
    const buyer = conversation.participants.find(
      (p: any) => p.type === "buyer"
    );
    const seller = conversation.participants.find(
      (p: any) => p.type === "seller"
    );
    if (buyer && seller) {
      fetchMessagesBetween(buyer.id, seller.id);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Active":
        return (
          <Badge variant="outline" className="text-green-600">
            Active
          </Badge>
        );
      case "resolved":
        return (
          <Badge variant="outline" className="text-blue-600">
            Resolved
          </Badge>
        );
      case "escalated":
        return (
          <Badge variant="outline" className="text-red-600">
            Escalated
          </Badge>
        );
      default:
        return null;
    }
  };

  const filteredConversations = conversations.filter(
    (conversation) =>
      conversation.participants[0].name
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      conversation.participants[1].name
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      conversation.participants[0].type
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      conversation.participants[1].type
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      conversation.room_id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  return (
    <SidebarInset>
      <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
        <SidebarTrigger className="-ml-1" />
        <div className="flex flex-1 items-center gap-2">
          <h1 className="text-lg font-semibold">Messages & Conversations</h1>
        </div>
      </header>

      <div className="flex-1 space-y-6 p-6">
        {/* Search */}
        <Card>
          <CardHeader>
            <CardTitle>Search Conversations</CardTitle>
            <CardDescription>
              Monitor buyer-seller communications
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search conversations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
          </CardContent>
        </Card>

        {/* Conversations Table */}
        <Card>
          <CardHeader>
            <CardTitle>Conversations ({pagination.total})</CardTitle>
            <CardDescription>All buyer-seller message threads</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Room ID</TableHead>
                  <TableHead>Participants</TableHead>
                  {/* <TableHead>Part</TableHead> */}
                  <TableHead>Last Message</TableHead>
                  <TableHead>Messages</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredConversations.map((conversation) => (
                  <TableRow key={conversation.room_id}>
                    <TableCell className="font-medium">
                      {conversation.room_id}
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center gap-1 text-sm">
                          <User className="w-3 h-3" />
                          <span className="font-medium">
                            {conversation.participants[0].name}
                          </span>
                          <span className="text-muted-foreground">(Buyer)</span>
                        </div>
                        <div className="flex items-center gap-1 text-sm">
                          <Building className="w-3 h-3" />
                          <span className="font-medium">
                            {conversation.participants[1].name}
                          </span>
                          <span className="text-muted-foreground">
                            ({conversation.participants[1].type})
                          </span>
                        </div>
                      </div>
                    </TableCell>
                    {/* <TableCell>{conversation.partName}</TableCell> */}
                    <TableCell>
                      <div>
                        <div className="text-sm max-w-[200px] truncate">
                          {conversation.last_message.content}
                        </div>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Calendar className="w-3 h-3" />
                          {new Date(
                            conversation.last_message.date
                          ).toLocaleDateString()}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <MessageSquare className="w-4 h-4" />
                        <span className="text-sm">
                          {conversation.messages_count}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(conversation.status)}</TableCell>
                    <TableCell>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleRoomClick(conversation)}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-4xl max-h-[80vh] flex flex-col">
                          <DialogHeader>
                            <DialogTitle>
                              Conversation - {selectedConversation?.room_id}
                            </DialogTitle>
                            <DialogDescription>
                              Message thread between{" "}
                              {conversation.participants[0].name} and{" "}
                              {conversation.participants[1].name}
                            </DialogDescription>
                          </DialogHeader>

                          <div className="overflow-y-auto flex-1 space-y-4 pr-2">
                            <div className="grid grid-cols-3 gap-4 p-4 bg-muted rounded-lg">
                              <div>
                                <label className="text-sm font-medium">
                                  Buyer
                                </label>
                                <p className="text-sm text-muted-foreground">
                                  {conversation.participants[0].name}
                                </p>
                              </div>
                              <div>
                                <label className="text-sm font-medium">
                                  Seller
                                </label>
                                <p className="text-sm text-muted-foreground">
                                  {conversation.participants[1].name} (
                                  {conversation.participants[1].type})
                                </p>
                              </div>
                              {/* <div>
                                <label className="text-sm font-medium">
                                  Part
                                </label>
                                <p className="text-sm text-muted-foreground">
                                  {selectedConversation?.partName}
                                </p>
                              </div> */}
                            </div>

                            <div>
                              <label className="text-sm font-medium mb-2 block">
                                Messages
                              </label>
                              <div className="h-[300px] w-full overflow-y-auto border rounded-md p-4">
                                <div className="space-y-4">
                                  {/* {currentMessages.map((message) => (
                                    <div
                                      key={message.id}
                                      className={`flex ${
                                        message.sender_id ===
                                        conversation.participants[1].id
                                          ? "justify-start"
                                          : "justify-end"
                                      }`}
                                    >
                                      <div
                                        className={`max-w-[70%] rounded-lg p-3 ${
                                          message.receiver_id ===
                                          conversation.participants[0].id
                                            ? "bg-blue-100 text-blue-900"
                                            : "bg-green-100 text-green-900"
                                        }`}
                                      >
                                        <div className="flex items-center gap-2 mb-1">
                                          <span className="text-xs font-medium">
                                            {message.sender.name}
                                          </span>
                                          <span className="text-xs opacity-70">
                                            {new Date(
                                              message.timestamp
                                            ).toLocaleString()}
                                          </span>
                                        </div>
                                        <p className="text-sm">
                                          {message.content}
                                        </p>
                                      </div>
                                    </div>
                                  ))} */}
                                  {currentMessages.map((message) => {
                                    // Find sender's role from participants
                                    const sender =
                                      conversation.participants.find(
                                        (p) => p.id === message.sender_id
                                      );
                                    const isBuyer = sender?.type === "buyer";
                                    return (
                                      <div
                                        key={message.id}
                                        className={`flex ${
                                          isBuyer
                                            ? "justify-start"
                                            : "justify-end"
                                        }`}
                                      >
                                        <div
                                          className={`max-w-[70%] rounded-lg p-3 ${
                                            isBuyer
                                              ? "bg-blue-100 text-blue-900"
                                              : "bg-green-100 text-green-900"
                                          }`}
                                        >
                                          <div className="flex items-center gap-2 mb-1">
                                            <span className="text-xs font-medium">
                                              {message.sender.name}
                                            </span>
                                            <span className="text-xs opacity-70">
                                              {new Date(
                                                message.timestamp
                                              ).toLocaleString()}
                                            </span>
                                          </div>
                                          <p className="text-sm">
                                            {message.content}
                                          </p>
                                        </div>
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                            </div>

                            <div className="flex justify-between items-center pt-4 border-t">
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-medium">
                                  Status:
                                </span>
                                {getStatusBadge(conversation.status ?? "")}
                              </div>
                              <div className="text-sm text-muted-foreground">
                                Total Messages: {conversation.messages_count}
                              </div>
                            </div>
                          </div>
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
